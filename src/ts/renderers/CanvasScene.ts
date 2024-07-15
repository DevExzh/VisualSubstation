import {safariVersionSupportOffscreenCanvas} from "../common/BrowserCheck.ts";
import {ControlsProxy} from "../virtual-element/ControlsProxy.ts";
import {CanvasRenderer} from "./CanvasRenderer.ts";
import {Router, useRouter} from "vue-router";
import {RouteSwitchEvent} from "../events/RouterEvents.ts";
import {WorkerEvent} from "../events/WorkerEvents.ts";
import {AnyEvent, EventObject} from "../events/AnyEvent.ts";
import {WorkerMessageType} from "../virtual-element/WorkerProxy.ts";
import {v4} from "uuid";
import {SceneObjectBoundingBoxEvent} from "../events/SceneEvents.ts";
import {ElMessage} from "element-plus";

/**
 * 渲染模式
 * @description 在 Chrome 69 以及 Safari 17 更新版本的浏览器上，支持在 Web Worker 上进行渲染
 * @enum
 */
export enum RenderMode {
    // 自动尝试能否在 Web Worker 上进行渲染，若不能则回退到普通模式
    Auto,
    // 普通模式，也就是所有场景的渲染都在同一个解释器线程上
    Normal,
    // 在 Web Worker 上进行渲染
    WebWorker,
}

type FunctionCall = {
    type: 'function-call',
    uuid: string,
    error?: string,
    returned?: any,
};

type PropertyOperation<T> = {
    type: 'prop-op',
    uuid: string,
    error?: string,
    value?: T
};

/**
 * 渲染场景，用以屏蔽 `CanvasRenderer` 的上下文差异性
 * @description 所有实现渲染的 canvas 必须继承此类，并重写 `initWorker` 和 `initRenderer` 两个抽象方法。
 * @see CanvasRenderer
 * @see CanvasScene.initWorker
 * @see CanvasScene.initRenderer
 * @class
 * @abstract
 */
export abstract class CanvasScene extends EventTarget implements Disposable {
    protected _mode: RenderMode = RenderMode.Auto;
    protected _canvas: HTMLCanvasElement;
    protected _renderDevice?: ControlsProxy | CanvasRenderer;
    protected _router: Router = useRouter();

    /**
     * 检查当前浏览器是否支持离屏渲染
     * @description 需要注意的是，直到 Safari 17 才正式支持在 WebGL 2 上下文中离屏渲染，在尝试移动到专用渲染上下文前必须先检查是否
     * 可用，否则就自动回退到单解释器线程上
     * @protected
     */
    protected isWorkerSupported(): boolean {
        return !!this._canvas.transferControlToOffscreen && safariVersionSupportOffscreenCanvas();
    }

    /**
     * 当前渲染上下文所依附的 HTML `<canvas>` 元素
     * @property
     */
    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public constructor(
        canvas: HTMLCanvasElement,
        renderMode: RenderMode = RenderMode.Auto,
    ) {
        super();
        this._canvas = canvas;
        this.renderMode = renderMode;
    }

    /**
     * 事件处理函数，负责处理 `CanvasRenderer` 分发的事件
     * @description 无论在哪个渲染上下文，该事件处理函数总是会在渲染器事件发生时被调用。
     * @param event 发生的事件
     * @protected
     */
    protected async eventHandler(event: EventObject): Promise<boolean> {
        switch (event.type) {
            default: return false;
            case 'bounding-box': {
                super.dispatchEvent(new SceneObjectBoundingBoxEvent((event as SceneObjectBoundingBoxEvent).boundingBox));
                return true;
            }
            case 'message-box': {
                ElMessage({
                    message: event['message'],
                    customClass: 'msg-box'
                });
                return true;
            }
            case 'route-switch': {
                try {
                    await this._router.push({
                        name: (event as RouteSwitchEvent).routeName
                    });
                } catch (e) {
                    console.error(e);
                }
                return true;
            }
        }
    }

    /**
     * 渲染模式
     * @description 如果 Web Worker 的离屏渲染可用，则会自动选择 Web Worker 进行渲染；否则就会自动回退到单线程执行
     * @param mode 渲染模式
     * @prop
     * @default RenderMode.WebWorker
     */
    public set renderMode(mode: RenderMode) {
        if(mode === RenderMode.Auto) {
            if(this.isWorkerSupported()) {
                this._mode = RenderMode.WebWorker
            } else {
                console.warn(
                    '当前浏览器不支持离屏渲染，所有渲染操作都将在同一解释器上下文中执行。' +
                    '为确保更好的体验以及更优的渲染性能，请将您的浏览器升级到以下任意版本以上：\n' +
                    '- Google Chrome 69（于 2018 年 9 月 4 日发布）\n' +
                    '- Microsoft Edge 79（于 2020 年 1 月 15 日发布）\n' +
                    '- Mozilla Firefox 105（于 2022 年 9 月 20 日发布）\n' +
                    '- Apple Safari 17（于 2023 年 9 月 18 日发布）'
                );
                this._mode = RenderMode.Normal;
            }
        } else {
            this._mode = mode;
        }
        if(this._mode === RenderMode.WebWorker) {
            const worker: Worker = this.initWorker();
            worker.addEventListener('message', async (ev: MessageEvent<WorkerEvent>) => {
                if(ev.data.type !== 'worker-event') return;
                await this.eventHandler(ev.data.event);
            });
            this._renderDevice = new ControlsProxy(
                worker,
                this._canvas.transferControlToOffscreen(),
                this._canvas
            );
        } else {
            const renderer: CanvasRenderer = this.initRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.addEventListener(
                'any',
                evt => this.eventHandler((evt as AnyEvent).listenedEvent),
                {passive: true}
            );
            const refreshSize = () => {
                renderer.resizeEvent({
                    width: window.innerWidth,
                    height: window.innerHeight,
                }).then();
            };
            // 监听当前页的 Resize 事件（注意：一定得是 window 对象，只有 window 对象才会产生 resize 事件）
            window.addEventListener(
                'resize',
                refreshSize
            );
            this._renderDevice = renderer;
            refreshSize();
        }
    }

    /**
     * 初始化 Worker
     * @description 在设置渲染模式时，会自动选择是否使用 Worker，若被分配至 Web Worker 上下文则该函数会被调用。
     * @see initRenderer
     * @protected
     */
    protected abstract initWorker(): Worker;

    /**
     * 初始化渲染器
     * @description 当且仅当指定渲染模式为普通或者浏览器不支持在 Web Worker 上渲染时，该函数才会被调用以初始化渲染器。
     * @see initWorker
     * @protected
     */
    protected abstract initRenderer(): CanvasRenderer;

    /**
     * 调用任意函数
     * @param functionName 函数名。必须和渲染器的成员函数名一致，否则就会抛出异常。
     * @param isAsync 是否为异步函数
     * @param expectResult 是否需要返回值。如果被调用的函数返回类型为 `void`，则传入 `false`；反之传入 `true`
     * @param parameters 任意参数。必须和所调用的函数的参数类型和参数个数严格一致，否则就会抛出异常。
     */
    public call(
        functionName: string,
        isAsync: boolean = false,
        expectResult: boolean = false,
        ...parameters: any[]
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if(this._mode === RenderMode.WebWorker) {
                const renderer: ControlsProxy = (this._renderDevice as ControlsProxy);
                const uuid: string = v4();
                renderer.postCustomEvent(WorkerMessageType.FUNCTION_CALL, {
                    functionName,
                    isAsync,
                    parameters,
                    uuid
                });
                if(!expectResult) resolve(undefined);
                const eventListener = (e: EventObject) => {
                    // 检查是否为函数回调事件
                    if(e.type !== 'function-call') return;
                    const event = e as FunctionCall;
                    // 检查该事件的 uuid 是否与当前的一致
                    if(event.uuid !== uuid) return;
                    if(event.error) {
                        reject(event.error);
                    } else {
                        resolve(event.returned);
                    }
                    renderer.worker.removeEventListener('message', eventListener);
                };
                renderer.worker.addEventListener('message', eventListener);
            } else {
                const renderer: CanvasRenderer = (this._renderDevice as CanvasRenderer);
                if(functionName in renderer) {
                    // @ts-ignore
                    const func = renderer[functionName];
                    if(typeof func === 'function') {
                        resolve(func(...parameters));
                    } else {
                        reject(`${functionName} is not a function`);
                    }
                } else {
                    reject('Function not exists');
                }
            }
        });
    }

    /**
     * 设置渲染器的属性
     * @param propertyName 属性名
     * @param value 设置值
     * @see get
     */
    public set<T>(
        propertyName: string,
        value: T,
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if(this._mode === RenderMode.WebWorker) {
                const renderer: ControlsProxy = (this._renderDevice as ControlsProxy);
                const uuid: string = v4();
                const eventListener = (e: EventObject) => {
                    if(e.type !== 'prop-op') return;
                    const event = e as PropertyOperation<T>;
                    if(event.uuid !== uuid) return;
                    if(event.error) {
                        reject(event.error);
                    } else {
                        const val = event.value;
                        if(val) {
                            resolve(val);
                        } else {
                            reject('Error occurs when trying to set property');
                        }
                    }
                    renderer.worker.removeEventListener('message', eventListener);
                };
                renderer.worker.addEventListener('message', eventListener);
                renderer.postCustomEvent(WorkerMessageType.PROPERTY_GET_SET, {
                    propertyName,
                    uuid,
                    operation: 'set',
                    value
                });
            } else {
                const renderer: CanvasRenderer = (this._renderDevice as CanvasRenderer);
                if(propertyName in renderer) {
                    // @ts-ignore
                    renderer[propertyName] = value;
                    resolve(value);
                } else {
                    reject(`${propertyName} not exists`);
                }
            }
        });
    }

    /**
     * 获取渲染器的属性
     * @param propertyName 属性名
     * @see set
     */
    public get(propertyName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if(this._mode === RenderMode.WebWorker) {
                const renderer: ControlsProxy = (this._renderDevice as ControlsProxy);
                const uuid: string = v4();
                const eventListener = (e: EventObject) => {
                    if(e.type !== 'prop-op') return;
                    const event = e as PropertyOperation<any>;
                    if(event.uuid !== uuid) return;
                    if(event.error) {
                        reject(event.error);
                    } else {
                        resolve(event.value);
                    }
                    renderer.worker.removeEventListener('message', eventListener);
                };
                renderer.worker.addEventListener('message', eventListener);
                renderer.postCustomEvent(WorkerMessageType.PROPERTY_GET_SET, {
                    propertyName,
                    uuid,
                    operation: 'get',
                });
            } else {
                const renderer: CanvasRenderer = (this._renderDevice as CanvasRenderer);
                if(propertyName in renderer) {
                    // @ts-ignore
                    resolve(renderer[propertyName]);
                } else {
                    reject(`${propertyName} not exists`);
                }
            }
        });
    }

    /**
     * 销毁当前场景
     * @function
     */
    [Symbol.dispose](): void {
        this._renderDevice = undefined;
    }
}