import {cameraObjectFormThreeCamera, CanvasSize, ThreeContext} from "../common/Types.ts";
import {
    CameraChangeEvent,
} from "../events/SceneEvents.ts";
import {Deg2Rad} from "../common/Helper.ts";
import {AnyEvent} from "../events/AnyEvent.ts";
import {Object3D, PCFSoftShadowMap, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer} from "three";

function getCanvasSize(canvas: HTMLElement | OffscreenCanvas): CanvasSize {
    return (
        ("width" in canvas)
            ? {
                width: canvas.width,
                height: canvas.height
            }
            : {
                width: canvas.clientWidth,
                height: canvas.clientHeight
            }
    );
}

export type MessageBoxParams = Partial<{
    boxType: 'success' | 'warning' | 'info' | 'error';
    icon: string;
    showAsHTML: boolean;
    center: boolean;
    className: string;
    grouping: boolean;
}> & { message: string };

/**
 * 渲染器，所有在 `<canvas>` 元素上进行渲染的 3D 场景必须继承此类
 * @class
 * @author Ryker Zhu
 * @since 1st May, 2024
 */
export class CanvasRenderer extends EventTarget implements Disposable {
    // 画布，可以是 HTML 元素也可以是离屏渲染，视浏览器支持情况而定
    protected _canvas: HTMLElement | OffscreenCanvas;
    // HTML body 元素
    // @ts-ignore
    protected _bodyElement: HTMLElement | unknown;
    // 渲染上下文
    protected _context: ThreeContext;
    // 像素比率（对高分辨率屏幕非常重要）
    protected _pixelRatio: number = 2;
    // 所有添加进场景的元素
    protected _scene_obj: Record<string, Object3D> = {};

    public setPixelRatio(ratio: number): void {
        this._pixelRatio = ratio;
        if(this._context.renderer instanceof WebGLRenderer) {
            this._context.renderer.setPixelRatio(this._pixelRatio);
        }
        this._context.camera.updateProjectionMatrix();
        this.render();
    }

    /**
     * 渲染当前帧
     * @function
     */
    public render(): void {
        this._context.renderer.render(this._context.scene, this._context.camera);
    }

    /**
     * 用球坐标系设置 3D 物体的位置
     * @param object 待坐标变换的 3D 物体
     * @param radius 球的半径，原点到点的直线距离
     * @param theta （单位：弧度）从正 z 轴到该点的向量与 z 轴的夹角
     * @param phi （单位：弧度）从正 x 轴到该点的向量在 xy 平面的投影与 x 轴的夹角
     * @see https://en.wikipedia.org/wiki/Spherical_coordinate_system
     * @static
     */
    public static setObjectPositionFromSpherical(object: Object3D, radius: number, theta: number, phi: number): void {
        object.position.set(
            radius * Math.sin(theta) * Math.cos(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(theta)
        );
    }

    public static getBiasedSphericalCoords(bias: Vector3, radius: number, theta: number, phi: number): Vector3 {
        return new Vector3(
            bias.x + Deg2Rad * radius * Math.sin(theta) * Math.cos(phi),
            bias.y + Deg2Rad * radius * Math.sin(theta) * Math.sin(phi),
            bias.z + Deg2Rad * radius * Math.cos(theta)
        );
    }

    /**
     * 用球坐标系设置 3D 物体的位置
     * @param object 待坐标变换的 3D 物体
     * @param radius 球的半径，原点到点的直线距离
     * @param theta （单位：角度）从正 z 轴到该点的向量与 z 轴的夹角
     * @param phi （单位：角度）从正 x 轴到该点的向量在 xy 平面的投影与 x 轴的夹角
     * @see setObjectPositionFromSpherical
     * @static
     */
    public static setObjectPositionFromSphericalAngles(
        object: Object3D, radius: number, theta: number, phi: number
    ): void {
        CanvasRenderer.setObjectPositionFromSpherical(object, radius, Deg2Rad * theta, Deg2Rad * phi);
    }

    public setCameraPosition(radius: number, theta: number, phi: number): void {
        CanvasRenderer.setObjectPositionFromSpherical(this._context.camera, radius, theta, phi);
        this._context.camera.updateProjectionMatrix();
    }

    public static getNormalizedPointerPosition(e: PointerEvent): Vector2 {
        const x = ( e.clientX / window.innerWidth) * 2 - 1;
        const y = - ( e.clientY / window.innerHeight) * 2 + 1;
        return new Vector2(x, y);
    }

    protected constructor(
        canvas: HTMLElement | OffscreenCanvas,
        bodyElement: unknown,
        shadows: boolean = true,
        context?: ThreeContext
    ) {
        super();
        this._canvas = canvas;
        this._bodyElement = bodyElement;
        // 初始化渲染上下文
        this._context = context ?? {
            renderer: new WebGLRenderer({
                canvas: this._canvas,
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            }),
            camera: new PerspectiveCamera(50, ((canvas): number => {
                const size = getCanvasSize(canvas);
                return size.width / size.height;
            })(canvas), 0.2, 1024),
            scene: new Scene()
        };
        this._context.scene.castShadow = this._context.scene.receiveShadow = shadows;
        if(this._context.renderer instanceof WebGLRenderer) {
            this._context.renderer.shadowMap.enabled = shadows;
            this._context.renderer.shadowMap.type = PCFSoftShadowMap;
        }
        // 添加事件监听器
        const element = (this._bodyElement as HTMLElement);
        element.addEventListener('pointerdown', this.pointerDownEvent.bind(this));
        element.addEventListener('pointerup', this.pointerUpEvent.bind(this));
        element.addEventListener('pointermove', this.pointerMoveEvent.bind(this));
        element.addEventListener('keydown', this.keyDownEvent.bind(this));
        element.addEventListener('keyup', this.keyUpEvent.bind(this));
        element.addEventListener('wheel', this.wheelEvent.bind(this));
        element.addEventListener('contextmenu', this.contextMenuEvent.bind(this));
    }

    public [Symbol.dispose](): void {
        if(this._context.renderer instanceof WebGLRenderer) {
            this._context.renderer.dispose();
        }
    }

    public add(...objects: Object3D[]): void {
        this._context.scene.add(...objects);
        for (const object of objects) {
            this._scene_obj[object.uuid] = object;
        }
        this.render();
    }

    public remove(...objects: Object3D[]): void {
        this._context.scene.remove(...objects);
        this.render();
    }

    public removeByUuid(uuid: string): void {
        this._context.scene.remove(this._scene_obj[uuid]);
        this.render();
    }

    /**
     * 获取渲染器的渲染上下文
     * @return ThreeContext
     */
    public get context(): ThreeContext {
        return this._context;
    }

    public get canvas(): HTMLElement | OffscreenCanvas {
        return this._canvas;
    }

    public get camera(): PerspectiveCamera {
        return this._context.camera;
    }

    protected async compile(): Promise<void> {
        if(this._context.renderer instanceof WebGLRenderer) {
            await this._context.renderer.compileAsync(this._context.scene, this.camera);
        }
    }

    public messageBox(
        params: MessageBoxParams
    ): void {
        super.dispatchEvent(new AnyEvent(Object.assign({
            type: 'message-box'
        }, params)));
    }

    public override dispatchEvent(event: Event): boolean {
        super.dispatchEvent(new AnyEvent(event));
        return super.dispatchEvent(event);
    }
    public async cameraChangeEvent(): Promise<void> {
        // 当相机对象发生变化时重新渲染
        this.render();
        // 传播事件，通知相机位置发生变化
        this.dispatchEvent(new CameraChangeEvent(cameraObjectFormThreeCamera(this.camera)));
    }
    protected async pointerMoveEvent(_: PointerEvent): Promise<void> {}
    protected async pointerDownEvent(_: PointerEvent): Promise<void> {}
    protected async pointerUpEvent(_: PointerEvent): Promise<void> {}
    protected async keyDownEvent(_: KeyboardEvent): Promise<void> {}
    protected async keyUpEvent(_: KeyboardEvent): Promise<void> {}
    protected async wheelEvent(_: WheelEvent): Promise<void> {}
    protected async contextMenuEvent(_: MouseEvent): Promise<void> {}
    public async resizeEvent(size?: CanvasSize): Promise<CanvasSize> {
        const canvasSize: CanvasSize = size ?? getCanvasSize(this._canvas);
        this._context.renderer.setSize(canvasSize.width, canvasSize.height, false);
        this.camera.aspect = canvasSize.width / canvasSize.height;
        this.camera.updateProjectionMatrix();
        this.render();
        return canvasSize;
    }
}