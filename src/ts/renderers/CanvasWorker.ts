import {
    ListenerEvent,
    VirtualElement,
    VirtualElementFactory,
    VirtualWindow
} from "../virtual-element/VirtualElement.ts";
import {CanvasRenderer} from "./CanvasRenderer.ts";
import {
    WorkerCommonMessages,
    WorkerEventMessage,
    WorkerFunctionCallMessage,
    WorkerMessageType, WorkerPropertyOperationMessage,
    WorkerResizeEventMessage
} from "../virtual-element/WorkerProxy.ts";
import {AnyEvent} from "../events/AnyEvent.ts";

// @ts-ignore
self['document'] = {};
// @ts-ignore
self['window'] = new VirtualWindow();
self.window['document'] = document;

export type RendererInitializer = (canvas: OffscreenCanvas, element: VirtualElement) => CanvasRenderer;

/**
 * 离屏渲染工作线程
 * @description 如果需要监听自定义事件，请继承该类，并重写 `messageEvent` 方法
 * @see CanvasWorker.messageEvent
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 * @since 27 June, 2024
 */
export class CanvasWorker extends EventTarget {
    protected _elementFactory: VirtualElementFactory = new VirtualElementFactory();
    protected _renderer?: CanvasRenderer;
    protected readonly _initializer: RendererInitializer;

    /**
     * 构造一个运行在 Web Worker 上下文的 `CanvasRenderer`
     * @see CanvasRenderer
     * @see RendererInitializer
     * @param initializer 初始化回调函数，接受两个参数并返回一个继承于 `CanvasRenderer` 抽象类的实例。
     */
    public constructor(
        initializer: RendererInitializer
    ) {
        super();
        self.onmessage = (ev: MessageEvent<WorkerCommonMessages>): void => {
            switch (ev.data.type) {
                case WorkerMessageType.FACTORY: {
                    this._elementFactory.getElement(ev.data.params.id);
                    break;
                }
                case WorkerMessageType.DISPOSE: {
                    this._renderer?.[Symbol.dispose]();
                    break;
                }
                case WorkerMessageType.EVENT: {
                    this._elementFactory.getElement(ev.data.params.id)?.
                    dispatchEvent(ev.data.params.event as unknown as ListenerEvent);
                    const event = ev.data as WorkerEventMessage;
                    if(event.params.event.type === 'resize') {
                        const resize = (ev.data as WorkerResizeEventMessage).params.event;
                        this._renderer?.resizeEvent({
                            width: resize.width,
                            height: resize.height,
                        });
                        // @ts-ignore
                        self['window']['innerWidth'] = resize.width;
                        // @ts-ignore
                        self['window']['innerHeight'] = resize.height;
                    }
                    break;
                }
                case WorkerMessageType.INIT: {
                    this._renderer = this._initializer(
                        ev.data.params.canvas as OffscreenCanvas,
                        this._elementFactory.getElement(ev.data.params.id)
                    );
                    const pixelRatio: number = ev.data.params.pixelRatio;
                    // @ts-ignore
                    self['window']['devicePixelRatio'] = pixelRatio;
                    this._renderer.setPixelRatio(pixelRatio);
                    this._renderer.addEventListener('any', evt => {
                        const event = evt as AnyEvent;
                        self.postMessage({
                            type: 'worker-event',
                            event: event.listenedEvent
                        });
                    });
                    break;
                }
                case WorkerMessageType.FUNCTION_CALL: {
                    const event: WorkerFunctionCallMessage = ev.data as WorkerFunctionCallMessage;
                    // 检查 renderer 是否为 undefined
                    if(!this._renderer) {
                        self.postMessage({
                            type: 'function-call',
                            uuid: event.params.uuid,
                            error: 'Renderer is not ready',
                            returned: undefined
                        });
                        break;
                    }
                    // 检查调用的函数名是否存在
                    if(event.params.functionName in this._renderer) {
                        (async (): Promise<any> => {
                            // @ts-ignore
                            let func = this._renderer[event.params.functionName];
                            if(typeof func !== 'function') {
                                throw new Error(`${event.params.functionName} is not a function`);
                            }
                            func = func.bind(this._renderer);
                            if(event.params.isAsync) {
                                return await func(...event.params.parameters);
                            } else {
                                return func(...event.params.parameters);
                            }
                        })().then(returned => {
                            try {
                                self.postMessage({
                                    type: 'function-call',
                                    uuid: event.params.uuid,
                                    error: undefined,
                                    returned
                                });
                            } catch (e) {
                                self.postMessage({
                                    type: 'function-call',
                                    uuid: event.params.uuid,
                                    error: e,
                                    returned: undefined
                                });
                            }
                        }).catch(reason => {
                            self.postMessage({
                                type: 'function-call',
                                uuid: event.params.uuid,
                                error: reason,
                                returned: undefined
                            })
                        });
                    } else {
                        self.postMessage({
                            type: 'function-call',
                            uuid: event.params.uuid,
                            error: 'Function not exists',
                            returned: undefined
                        });
                    }
                    break;
                }
                case WorkerMessageType.PROPERTY_GET_SET: {
                    const event: WorkerPropertyOperationMessage = ev.data as WorkerPropertyOperationMessage;
                    // 检查 renderer 是否为 undefined
                    if(!this._renderer) {
                        self.postMessage({
                            type: 'prop-op',
                            uuid: event.params.uuid,
                            error: 'Renderer is not ready',
                            value: undefined
                        });
                        break;
                    }
                    if(event.params.propertyName in this._renderer) {
                        try {
                            if(event.params.operation === 'set') {
                                self.postMessage({
                                    type: 'prop-op',
                                    uuid: event.params.uuid,
                                    error: undefined,
                                    // @ts-ignore
                                    value: (this._renderer[event.params.propertyName] = event.params.value)
                                });
                            } else {
                                self.postMessage({
                                    type: 'prop-op',
                                    uuid: event.params.uuid,
                                    error: undefined,
                                    // @ts-ignore
                                    value: this._renderer[event.params.propertyName]
                                });
                            }
                        } catch (e) {
                            self.postMessage({
                                type: 'prop-op',
                                uuid: event.params.uuid,
                                error: e,
                                value: undefined
                            });
                        }
                    } else {
                        self.postMessage({
                            type: 'prop-op',
                            uuid: event.params.uuid,
                            error: 'Property not exists',
                            value: undefined
                        });
                    }
                    break;
                }
                default: {
                    this.messageEvent(ev);
                    break;
                }
            }
        };
        this._initializer = initializer;
    }

    /**
     * 当前线程收到 `CanvasScene` 消息后的事件处理函数
     * @description 该函数在基类 `CanvasWorker` 中只是一个空函数，什么都不做。需要注意的是，最好通过继承本基类来监听消息事件，而不是
     * 直接 `self.onmessage = eventHandler` 或者 `self.addEventListener('message', eventHandler)`，因为该事件处理函数会过滤
     * 掉与 `CanvasScene` 进行消息传递的内部事件，而直接添加事件监听器会失去事件过滤机制。
     * @param event 消息事件
     * @protected
     */ // @ts-ignore
    protected messageEvent(event: MessageEvent): void {}
}