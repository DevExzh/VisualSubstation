import {createVNode, render, VNodeTypes} from "vue";
import {CSS3DObject, CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import {ThreeContext} from "./common/Types.ts";

export class Component3D {
    private renderer: CSS3DRenderer;
    private objects: CSS3DObject[] = [];
    private context: ThreeContext;

    createComponent(
        type: VNodeTypes,
        props?: any
    ): void {
        const mountPoint = document.createElement('div');
        render(createVNode(type, props), mountPoint);
        const obj: CSS3DObject = new CSS3DObject(mountPoint);
        this.objects.push(obj);
        this.context.scene.add(obj);
    }

    constructor(context: ThreeContext, mountPoint: HTMLElement) {
        this.context = context;
        this.renderer = new CSS3DRenderer({
            element: mountPoint,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.renderer.render(this.context.scene, this.context.camera);
    }
}