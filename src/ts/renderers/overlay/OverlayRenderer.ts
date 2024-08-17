import * as THREE from 'three';
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {CSS3DObject, CSS3DRenderer, CSS3DSprite} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {CameraChangeEvent, SceneObjectBoundingBoxEvent} from "../../events/SceneEvents.ts";
import {CanvasScene} from "../CanvasScene.ts";
import {CameraObject} from "../../common/Types.ts";
import {InvisibleBox} from "../../meshes/InvisibleBox.ts";
import {Component, createVNode, render, VNode, VNodeProps} from "vue";
import OverlayDecorator from "../../../components/overlay/OverlayDecorator.vue";

export enum OverlayRendererType {
    CSS,
    SimplifiedCSS,
}

const _vector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

/**
 * 叠加在 3D 场景上的 DOM 元素渲染器
 * @description 注意！由于此渲染器需要操作 DOM 树，故不支持在 Web Worker 上下文中运行。
 * @author Ryker Zhu
 * @since 27 June, 2024
 */
export class OverlayRenderer extends CanvasRenderer {
    protected _listenedScene?: CanvasScene;
    protected _boxes: Record<string, InvisibleBox> = {};
    protected _containers: HTMLElement[] = [];
    protected _objects: THREE.Object3D[] = [];
    public readonly scaleFactor: number;

    constructor(
        canvas: HTMLElement,
        attached?: CanvasScene,
        type: OverlayRendererType = OverlayRendererType.CSS
    ) {
        super(canvas, canvas, true, {
            renderer: ((): any =>  {
                switch (type) {
                    case OverlayRendererType.CSS:
                        return new CSS3DRenderer({
                            element: canvas
                        });
                    case OverlayRendererType.SimplifiedCSS:
                        return new CSS2DRenderer({
                            element: canvas
                        });
                }
            })() as THREE.Renderer,
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera,
        });
        this.scaleFactor = 1 / (parseFloat(getComputedStyle(document.documentElement).fontSize));
        this._context.renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', () => {
            this._context.camera.aspect = window.innerWidth / window.innerHeight;
            this._context.camera.updateProjectionMatrix();
            this._context.renderer.setSize(window.innerWidth, window.innerHeight);
            this.render();
        });
        // 忽略指针事件
        canvas.style.pointerEvents = 'none';
        if(attached) this.attachTo(attached);
    }

    public attachTo(renderer: CanvasScene): void {
        this._listenedScene = renderer;
        this._listenedScene.addEventListener('camera-change', evt => {
            // 当模型场景中的相机发生变化时，同步更新相机对象
            const camera: CameraObject = (evt as CameraChangeEvent).camera;
            if(!camera) return;
            this._context.camera.position.set(...camera.position);
            this._context.camera.rotation.set(...camera.rotation);
            this._context.camera.fov = camera.fov;
            this._context.camera.aspect = camera.aspect;
            this._context.camera.filmGauge = camera.filmGauge;
            this._context.camera.updateMatrixWorld(true);
            this._context.renderer.render(this._context.scene, this._context.camera);
        });
        this._listenedScene.addEventListener('bounding-box', evt => {
            const box: InvisibleBox = new InvisibleBox((evt as SceneObjectBoundingBoxEvent).boundingBox);
            this._boxes[box.uuid] = box;
            this._context.scene.add(box);
        });
    }

    public getObjectUuidByFileName(fileName: string): (string | undefined) {
        for(const uuid in this._boxes) {
            const userData = this._boxes[uuid].userData['fileName'];
            if(userData === fileName) {
                return uuid;
            }
        }
        return undefined;
    }

    private renderAsSprite(node: VNode): CSS3DObject {
        const container: HTMLDivElement = document.createElement('div');
        render(node, container);
        const obj: CSS3DObject = new CSS3DSprite(container);
        obj.scale.multiplyScalar(this.scaleFactor);
        this._context.scene.add(obj);
        this._objects.push(obj);
        this._containers.push(container);
        return obj;
    }

    /**
     * 将一个 HTML 元素吸附到场景中的某个物体上
     * @param element 需要添加的 Vue 组件
     * @param props 待添加的 Vue 组件的属性
     * @param uuid （可选）被吸附物体的 UUID，如果不传此参数则默认不吸附
     */
    public addComponent(element: Component, props?: Record<string, any> & VNodeProps, uuid?: string): CSS3DObject {
        if(uuid !== undefined && !(uuid in this._boxes)) {
            throw new Error(`Object with uuid ${uuid} is not registered`);
        }
        const node: VNode = createVNode(OverlayDecorator, {}, [
            createVNode(element, props)
        ]);
        const obj = this.renderAsSprite(node);
        if(uuid) {
            const box: InvisibleBox = this._boxes[uuid];
            box.boundingBox.getCenter(_vector);
            _vector.y = box.boundingBox.max.y + 0.25;
            obj.position.copy(_vector);
        }
        this._context.renderer.render(this._context.scene, this._context.camera);
        return obj;
    }

    /**
     * 在指定位置上创建浮空 HTML 元素
     * @param position 指定的位置
     * @param element 需要添加的 Vue 组件
     * @param props 待添加的 Vue 组件的属性
     * @param children 子组件
     * @param scaleFactor 伸缩因子
     */
    public addComponentToPosition(
        position: [number, number, number],
        element: Component,
        props?: Record<string, any> & VNodeProps,
        children?: any,
        scaleFactor?: number
    ): CSS3DObject {
        const obj = this.renderAsSprite(createVNode(element, props, children));
        obj.position.set(...position);
        if(scaleFactor) obj.scale.multiplyScalar(scaleFactor);
        this._context.renderer.render(this._context.scene, this._context.camera);
        return obj;
    }

    public clearAll(): void {
        this._context.scene.remove(...this._objects);
        this._containers.length = this._objects.length = 0;
        this.render();
    }

    [Symbol.dispose](): void {
        super[Symbol.dispose]();
    }
}