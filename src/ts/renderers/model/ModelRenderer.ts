import {CameraViewType, CanvasSize,} from "../../common/Types.ts";
import {ModelLoader, ModelObjectLoadEvent} from "../../../../../bounding-box/src/ModelLoader.ts";
import {EdgeHighlighter} from "../../effects/EdgeHighlighter.ts";
import {TextureLoader} from "../../loaders/TextureLoader.ts";
import {
    CameraViewTypeChangeEvent,
    LoadEvent,
    LoadState, ObjectSelectionEvent, SceneObjectBoundingBoxEvent,
} from "../../events/SceneEvents.ts";
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {CameraControls} from "../../controllers/CameraControls.ts";
import {Tween} from "@tweenjs/tween.js";
import {
    acceleratedRaycast,
    computeBoundsTree,
    disposeBoundsTree,
    MeshBVH,
    StaticGeometryGenerator
} from 'three-mesh-bvh';
import {Player} from "../../physical/Player.ts";
import {Flame} from "../../effects/Flame.ts";
import {
    Mesh,
    SpotLight,
    BufferGeometry,
    AmbientLight,
    Fog,
    Box3,
    Color,
    Vector3,
    RepeatWrapping,
    CircleGeometry, MeshStandardMaterial, Object3D
} from "three";
// @ts-ignore
BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
// @ts-ignore
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

let textureLoader = new TextureLoader;

/**
 * 渲染器
 * @class
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 */
export class ModelRenderer extends CanvasRenderer {
    // 模型加载器
    private readonly _modelLoader: ModelLoader;
    // 边框高亮
    private readonly _clickHighlighter: EdgeHighlighter;
    private _topMostLight: SpotLight = new SpotLight(0xffffff, 1);
    private _exclusions: string[] = [];
    private _controls: CameraControls;
    private _player: Player = new Player('/player.glb');
    private _collider: Mesh = new Mesh;

    public override setPixelRatio(ratio: number) {
        this._clickHighlighter.pixelRatio = this._pixelRatio;
        super.setPixelRatio(ratio);
    }

    public override render() {
        super.render();
    }

    /**
     * 渲染器的构造函数
     * @param canvas HTML <canvas> 元素或者离屏 canvas（仅 Web Worker）
     * @param bodyElement HTML <body> 元素或者虚拟元素
     * @param shadows 是否产生阴影
     */
    public constructor(
        canvas: HTMLCanvasElement | OffscreenCanvas,
        bodyElement: unknown,
        shadows: boolean = true,
    ) {
        super(canvas, bodyElement, shadows);
        this._context.scene.fog = new Fog(0x252525, 200, 250);
        // 初始化灯光
        this.add(new AmbientLight(0xffffff, 0.25));
        this._topMostLight.castShadow = true;
        this._topMostLight.shadow.bias = -0.0001;
        this._topMostLight.shadow.mapSize.set(2048, 2048);
        this._topMostLight.shadow.map?.setSize(2048, 2048);
        // 初始化控制器
        this._controls = new CameraControls(this._context.camera, this._bodyElement as HTMLElement);
        this._controls.addEventListener('change', this.cameraChangeEvent.bind(this));
        this._controls.addEventListener('camera-view-type', evt => {
            let typeName: string;
            switch ((evt as CameraViewTypeChangeEvent).viewType) {
                case CameraViewType.FirstPerson: typeName = '第一人称'; break;
                case CameraViewType.ThirdPerson: typeName = '第三人称'; break;
                case CameraViewType.Spectator: typeName = '上帝'; break;
                default: typeName = '未知'; break;
            }
            this.messageBox({
                message: `已切换到 ${typeName} 视角`
            });
            this.dispatchEvent(new CameraViewTypeChangeEvent((evt as CameraViewTypeChangeEvent).viewType));
        });
        this._controls.player = this._player;
        this._controls.maxDistance = 256;
        this._controls.minDistance = 8;
        // 加载模型
        this._modelLoader = new ModelLoader(this._context, shadows, shadows);
        this._modelLoader.addEventListener('model-object-loaded', async (evt: Event) => {
            const event = evt as ModelObjectLoadEvent;
            const name = event.name, object = event.object as unknown as Object3D;
            if(this._modelLoader.exclusions.includes(name)) {
                this._exclusions.push(object.uuid);
                if(!!object.traverse) {
                    object.traverse(m => {
                        if(m.type === 'Mesh') {
                            this._exclusions.push(m.uuid);
                        }
                    });
                }
            }
            const boundingBox: Box3 = new Box3().setFromObject(object, true);
            this.dispatchEvent(new SceneObjectBoundingBoxEvent({
                min: [boundingBox.min.x, boundingBox.min.y, boundingBox.min.z],
                max: [boundingBox.max.x, boundingBox.max.y, boundingBox.max.z],
                name: object.name,
                uuid: object.uuid,
                userData: Object.assign(event.object.userData, {
                    fileName: name
                }),
            }));
        });
        this._modelLoader.addEventListener('complete', _ => {
            this._clickHighlighter.selectionExclusion = this._exclusions;
        });
        // 初始化边框高亮
        this._clickHighlighter = new EdgeHighlighter(
            this._context,
            new Color(0xff9800),
            new Color(0xff0000)
        );
        this._clickHighlighter.addEventListener('object-selection', evt => {
            const event: ObjectSelectionEvent = evt as ObjectSelectionEvent;
            if(event.objects.length === 0) return;
            this.dispatchEvent(new ObjectSelectionEvent(event.selected, event.camera, ...event.objects));
        });
        this.add(new Flame(this._context));
    }

    protected override async pointerDownEvent(event: PointerEvent): Promise<void> {
        await super.pointerDownEvent(event);
        this._clickHighlighter.onPointerDown(event);
    }

    public override async resizeEvent(size?: CanvasSize): Promise<CanvasSize> {
        const canvasSize = await super.resizeEvent(size);
        this._clickHighlighter.onResize(canvasSize);
        return canvasSize;
    }

    public toggleCameraViewType(): void {
        this._controls.toggleCamera();
    }

    public currentCameraViewType(): CameraViewType {
        return this._controls.cameraViewType;
    }

    /**
     * 加载所有预定义的模型
     * @async
     * @function
     */
    public async loadModels(manifestPath: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                this._clickHighlighter.selectionExclusion.push(this._player.uuid);
                await this._modelLoader.loadAll(manifestPath);
                const sceneAABB = new Box3().setFromObject(this._context.scene, true);
                const delta = new Vector3().copy(sceneAABB.max).sub(sceneAABB.min);
                let centerPoint: Vector3 = new Vector3(0, 0, 0);
                sceneAABB.getCenter(centerPoint);
                this._player.position.copy(centerPoint).y = sceneAABB.min.y + 0.5;
                this.add(this._player);
                this._topMostLight.position.set(centerPoint.x, sceneAABB.max.y + 30, centerPoint.z);
                this._topMostLight.target.position.set(centerPoint.x, sceneAABB.min.y, centerPoint.z);
                this._topMostLight.power = (delta.y + 100) * Math.max(delta.x, delta.z);
                this._topMostLight.updateWorldMatrix(true, false);
                this._topMostLight.target.updateWorldMatrix(true, false);
                this.add(this._topMostLight);
                const staticGeoGenerator: StaticGeometryGenerator =
                    new StaticGeometryGenerator(this._modelLoader.models);
                staticGeoGenerator.attributes = [ 'position' ];
                const mergedGeometry = staticGeoGenerator.generate();
                // @ts-ignore
                mergedGeometry.boundsTree = new MeshBVH( mergedGeometry );
                this._collider.geometry = mergedGeometry;
                this._controls.collider = this._collider;
                // 最底层平面
                const texture = await textureLoader.loadAsync('/textures/ground-plane.jpg');
                texture.wrapT = texture.wrapS = RepeatWrapping;
                texture.repeat.set(64, 64);
                const plane = new Mesh(
                    new CircleGeometry(1024, 64),
                    new MeshStandardMaterial({
                        map: texture,
                    })
                );
                plane.receiveShadow = false;
                plane.position.set(0, sceneAABB.min.y - 0.25, 0);
                plane.rotateX(-Math.PI / 2);
                this._clickHighlighter.selectionExclusion.push(plane.uuid);
                this.add(plane);
                await this.compile();
                this.dispatchEvent(new LoadEvent(LoadState.Completed));
                let isAnimating: boolean = true;
                const animation: Tween<any> = new Tween({
                    x: this.camera.position.x,
                    y: this.camera.position.y,
                    z: this.camera.position.z,
                }).to({
                    x: 64,
                    y: 64,
                    z: 90.5,
                }).onUpdate(o => {
                    this.camera.position.set(o.x, o.y, o.z);
                    this._controls.update();
                }).onComplete(() => {
                    isAnimating = false;
                }).start();
                const animate = (time?: number) => {
                    if(isAnimating) {
                        animation.update(time);
                        requestAnimationFrame(animate);
                    }
                };
                animate();
                resolve();
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }

    public override [Symbol.dispose] (): void {
        super[Symbol.dispose]();
    }
}