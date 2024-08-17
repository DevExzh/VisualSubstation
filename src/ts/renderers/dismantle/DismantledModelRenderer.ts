import {CanvasRenderer} from "../CanvasRenderer.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {DragControls} from "three/examples/jsm/controls/DragControls.js";
import * as TWEEN from "@tweenjs/tween.js";
import {LoadedObject, ModelLoader, ModelObjectLoadEvent} from "../../loaders/ModelLoader.ts";
import {LoadEvent, LoadState} from "../../events/SceneEvents.ts";
import {AmbientLight, Box3, HemisphereLight, Mesh, Object3D, Vector3} from "three";

const _box: Box3 = new Box3();
const _vec: Vector3 = new Vector3();

export class DismantledModelRenderer extends CanvasRenderer {
    private controls: OrbitControls;
    private dragControls: DragControls;
    private modelLoader: ModelLoader;
    private initialPositions: Map<Object3D, Vector3> = new Map();
    private objects: Map<string, LoadedObject> = new Map();
    private animating: boolean = false; // 动画进行中的标志
    private dragging: boolean = false; // 拖动进行中的标志

    public constructor(
        canvas: HTMLCanvasElement | OffscreenCanvas,
        bodyElement: unknown,
    ) {
        super(canvas, bodyElement);
        this.controls = new OrbitControls(this.camera, bodyElement as unknown as HTMLElement);
        this.controls.addEventListener('change', this.render.bind(this)); // 监听控制器变化事件
        // 添加拖拽控制
        this.dragControls = new DragControls([], this.camera, bodyElement as unknown as HTMLElement);
        this.dragControls.addEventListener('dragstart', () => {
            this.controls.enabled = false;
            this.dragging = true;
            this.animate();
        });
        this.dragControls.addEventListener('dragend', () => {
            this.controls.enabled = true;
            this.dragging = false;
            this.render();
        });
        this.camera.position.z = 10;
        // 添加环境光和全景光
        this.add(
            new AmbientLight(0x404040),
            new HemisphereLight(0xffffbb, 0x080820, 1)
        );
        this.modelLoader = new ModelLoader(this._context);
        this.modelLoader.addEventListener('model-object-loaded', evt => {
            const event: ModelObjectLoadEvent = evt as ModelObjectLoadEvent;
            _box.setFromObject(event.object);
            _box.getCenter(_vec);
            event.object.position.sub(_vec);
            _vec.set(...event.object.userData.initialPosition);
            event.object.position.add(_vec);
            this.objects.set(event.object.userData.originalName, event.object);
            event.object.traverse(child => {
                if((child as Mesh).isMesh) {
                    this.initialPositions.set(child, child.position.clone())
                }
            });
            this.render();
        });
        this.modelLoader.addEventListener('complete', _ => {
            this.dragControls.setObjects(this.modelLoader.models);
            this.dispatchEvent(new LoadEvent(LoadState.Completed));
        });
    }

    async loadAll(manifestPath: string): Promise<void> {
        await this.modelLoader.loadAll(manifestPath);
    }

    // 动画循环
    private animate(): void {
        if (this.animating || this.dragging) {
            requestAnimationFrame(this.animate.bind(this));
            TWEEN.update();
            this.render();
        }
    }

    // 重置模型位置
    public resetModelPosition(): void {
        this.animating = true; // 开始动画
        this.initialPositions.forEach((position, child) => {
            new TWEEN.Tween(child.position)
                .to({ x: position.x, y: position.y, z: position.z }, 2000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(this.render.bind(this))
                .onComplete(() => {
                    this.animating = false; // 动画完成
                })
                .start();
        });
        this.animate();
    }

    // 移动模型位置
    public moveModelByDistance(model: Object3D | string, distance: number, component: 'x' | 'y' | 'z'): void {
        this.animating = true; // 开始动画
        if(typeof model === 'string') {
            model = this.objects.get(model) as Object3D;
        }
        model.traverse((child: Object3D) => {
            if ((child as Mesh).isMesh) {
                const newPos = { ...child.position };
                newPos[component] += distance;
                new TWEEN.Tween(child.position)
                    .to(newPos, 2000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(this.render.bind(this))
                    .onComplete(() => {
                        this.animating = false; // 动画完成
                    })
                    .start();
            }
        });
        this.animate();
    }
}