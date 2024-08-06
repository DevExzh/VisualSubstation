import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass.js";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js";
import {OutputPass} from "three/examples/jsm/postprocessing/OutputPass.js";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {
    cameraObjectFormThreeCamera,
    CanvasSize, SceneObject, sceneObjectFromObject3D,
    ThreeContext
} from "../common/Types.ts";
import {ObjectSelectionEvent} from "../events/SceneEvents.ts";
import {Color, Intersection, Object3D, Raycaster, Vector2, WebGLRenderer} from "three";

export class EdgeHighlighter extends EventTarget {
    private context: ThreeContext;
    private isOnAnimation: boolean = false;
    private composer: EffectComposer;
    private readonly clickOutlinePass: OutlinePass;
    private readonly manualOutlinePass: OutlinePass;
    private readonly rayCaster: Raycaster = new Raycaster();
    public selectionExclusion: string[] = [];
    private canvasSize: CanvasSize = {width: -1, height: -1};

    set pixelRatio(ratio: number) {
        this.composer.setPixelRatio(ratio);
    }

    setSize(size: CanvasSize): void {
        this.canvasSize = size;
        this.composer.setSize(size.width, size.height);
    }

    public animate = () => {
        if(this.isOnAnimation) requestAnimationFrame(this.animate);
        this.composer.render();
    };

    constructor(
        context: ThreeContext,
        clickColor: Color,
        manualColor: Color,
    ) {
        super();
        this.context = context;
        // @ts-ignore
        this.rayCaster.firstHitOnly = true;
        this.composer = new EffectComposer(this.context.renderer as WebGLRenderer);
        this.composer.setPixelRatio(window.devicePixelRatio);

        // 产生高亮轮廓的效果
        const getPass = (color: Color): OutlinePass => {
            const outlinePass: OutlinePass = new OutlinePass(
                new Vector2(window.innerWidth, window.innerHeight),
                this.context.scene,
                this.context.camera
            );
            outlinePass.renderToScreen = true;
            outlinePass.hiddenEdgeColor = outlinePass.visibleEdgeColor = color;
            outlinePass.pulsePeriod = 1.5;
            outlinePass.edgeStrength = 5;
            outlinePass.edgeGlow = 2.5;
            outlinePass.edgeThickness = 3;
            outlinePass.usePatternTexture = false;
            return outlinePass;
        };
        this.clickOutlinePass = getPass.bind(this)(clickColor);
        this.manualOutlinePass = getPass.bind(this)(manualColor);

        this.composer.addPass(new RenderPass(this.context.scene, this.context.camera));
        this.composer.addPass(this.clickOutlinePass);
        this.composer.addPass(this.manualOutlinePass);
        this.composer.addPass(new OutputPass());
    }

    set selectedObjects(objects: Object3D[]) {
        const selected: Object3D[] = [];
        for(const obj of objects) {
            if(!this.selectionExclusion?.includes(obj.name)) selected.push(obj);
        }
        if(selected == this.manualOutlinePass.selectedObjects) return;
        this.manualOutlinePass.selectedObjects = selected;
        if(objects.length > 0) {
            this.isOnAnimation = true;
            this.manualOutlinePass.enabled = true;
            this.animate();
        } else {
            this.isOnAnimation = false;
            this.manualOutlinePass.enabled = false;
        }
    }

    onResize(size: CanvasSize) {
        this.setSize(size);
        this.composer.render();
    }

    onPointerDown(e: PointerEvent) {
        const x = ( e.clientX / this.canvasSize.width ) * 2 - 1;
        const y = - ( e.clientY / this.canvasSize.height ) * 2 + 1;
        this.rayCaster.setFromCamera(new Vector2(x, y), this.context.camera);
        const intersects: Intersection[] = this.rayCaster.intersectObject(this.context.scene, true);
        // 当且仅当有相交时
        if(e.isPrimary && e.button === 0 &&
            intersects.length > 0 && // 只选中符合条件的
            !this.selectionExclusion?.includes(intersects[0].object.uuid)
        ) {
            let objSelected: Object3D = intersects[0].object;
            while(objSelected.parent) {
                if("fileName" in objSelected.userData) {
                    break;
                }
                objSelected = objSelected.parent;
            }
            this.clickOutlinePass.selectedObjects = [objSelected];
            this.isOnAnimation = true;
            this.animate();
            this.dispatchEvent(new ObjectSelectionEvent(
                true,
                cameraObjectFormThreeCamera(this.context.camera),
                sceneObjectFromObject3D(objSelected)
            ));
        } else {
            this.isOnAnimation = false;
            const objects: SceneObject[] = [];
            this.clickOutlinePass.selectedObjects.forEach(o => {
                if(o) {
                    objects.push(sceneObjectFromObject3D(o));
                }
            })
            this.dispatchEvent(new ObjectSelectionEvent(
                false,
                cameraObjectFormThreeCamera(this.context.camera),
                ...objects
            ));
            this.clickOutlinePass.selectedObjects = [];
        }
    }
}