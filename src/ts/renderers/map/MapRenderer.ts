import * as THREE from "three";
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {MapControls} from "three/examples/jsm/controls/MapControls.js";
import {chinaProjection, LineType, object3DFromGeoJson} from "../../map/MapUtils.ts";
import * as TWEEN from "@tweenjs/tween.js";
import {TextureLoader} from "../../loaders/TextureLoader.ts";
import {RouteSwitchEvent} from "../../events/RouterEvents.ts";
import {Animations} from "../../common/Animations.ts";
import {Anchor} from "../../meshes/Anchor.ts";

const textureLoader = new TextureLoader();

export class MapRenderer extends CanvasRenderer {
    protected _controls: MapControls;
    protected _mainLight: THREE.PointLight;
    protected _ambientLight: THREE.AmbientLight;
    protected _rayCaster: THREE.Raycaster;
    protected _plane?: THREE.Mesh;
    protected _animations: Animations = new Animations(this);
    protected _mappings: Record<string, string> = {};
    protected _regions: THREE.Object3D[] = [];
    protected _subregions: THREE.Object3D[] = [];
    protected _anchors: Anchor[] = [];
    protected _regionHeight: number = 3;
    protected _areaColor: THREE.Color = new THREE.Color('#887908');
    protected _borderColor: THREE.Color = new THREE.Color('#FFF9C4')
    protected _areaColorOnPopUp: THREE.Color = new THREE.Color('#064f71');
    protected _borderColorOnPopUp: THREE.Color = new THREE.Color('#1da8f1');

    public constructor(
        canvas: HTMLCanvasElement | OffscreenCanvas,
        bodyElement: unknown,
        shadows: boolean = true,
    ) {
        super(canvas, bodyElement, shadows, {
            renderer: new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
            }),
            camera: new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.01, 512),
            scene: new THREE.Scene(),
        });
        this._context.scene.fog = new THREE.Fog(0x252525, 100, 150);
        this._context.scene.receiveShadow = shadows;
        this._context.scene.background = new THREE.Color(0x252525);
        this._rayCaster = new THREE.Raycaster();
        this.setCameraPosition(100, Math.PI / 4, Math.PI / 5);
        this._controls = new MapControls(this._context.camera, this._bodyElement as HTMLElement);
        this._controls.listenToKeyEvents(this._bodyElement as HTMLElement);
        this._controls.addEventListener('change', this.cameraChangeEvent.bind(this));
        this._controls.minDistance = 1;
        this._controls.maxDistance = 128;
        this._controls.update();
        this._mainLight = new THREE.PointLight(0xffffff, 1000);
        CanvasRenderer.setObjectPositionFromSphericalAngles(this._mainLight, 50, 65, 20);
        this._ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
        object3DFromGeoJson('/map/china.json', {
            areaColor: this._areaColor,
            borderColor: this._borderColor,
        }).then((objects: THREE.Object3D[]): void => {
            this.add(...objects, this._mainLight, this._ambientLight);
            this.compile().then(_ => this.render());
        });
        fetch('/map/china_mappings.json', {
            cache: 'force-cache'
        }).then(async resp => {
            return await resp.json() as Record<string, string>;
        }).then(mappings => {
            this._mappings = mappings;
        });
        textureLoader.loadAsync('/textures/ground-plane.jpg').then((texture: THREE.Texture) => {
            texture.wrapT = texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.set(64, 64);
            this._plane = new THREE.Mesh(
                new THREE.CircleGeometry(512, 64),
                new THREE.MeshStandardMaterial({
                    map: texture,
                })
            );
            this._plane.rotateX(-Math.PI / 2);
            this.add(this._plane);
            this.compile().then(_ => this.render());
        });
    }

    protected intersects(e: PointerEvent, objects?: THREE.Object3D[]): (THREE.Object3D | undefined) {
        this._rayCaster.setFromCamera(CanvasRenderer.getNormalizedPointerPosition(e), this._context.camera);
        const intersections: THREE.Intersection[] = this._rayCaster
            .intersectObjects(objects ?? this._context.scene.children);
        if(intersections.length > 0) {
            let o: THREE.Object3D = intersections[0].object;
            if(o === this._plane) return undefined;
            while (!o.userData.name) {
                o = o.parent!;
            }
            return o;
        }
        return undefined;
    }

    protected override async pointerMoveEvent(event: PointerEvent): Promise<void> {
        await super.pointerMoveEvent(event);
    }

    public override async cameraChangeEvent(): Promise<void> {
        await super.cameraChangeEvent();
    }

    protected resumeAllSubregions(): void {
        if(this._regions.length === 0) return;
        this.remove(...this._subregions, ...this._anchors);
        this._subregions.length = 0;
        this._anchors.length = 0;
        const region = this._regions.pop()!;
        region.traverse(o => {
            if(o.type === 'Mesh') {
                o.visible = true;
                this._animations.start({
                    animation: new TWEEN.Tween({
                        height: this._regionHeight,
                        color: {
                            r: this._areaColorOnPopUp.r,
                            g: this._areaColorOnPopUp.g,
                            b: this._areaColorOnPopUp.b
                        }
                    })
                        .to({
                            height: 1,
                            color: {
                                r: this._areaColor.r,
                                g: this._areaColor.g,
                                b: this._areaColor.b
                            }
                        })
                        .duration(500)
                        .interpolation(TWEEN.Interpolation.Bezier)
                        .onUpdate(v => {
                            o.scale.set(1, 1, v.height);
                            ((o as THREE.Mesh).material as THREE.MeshStandardMaterial)
                                .color.set(v.color.r, v.color.g, v.color.b);
                        })
                        .start(),
                    id: o.uuid
                });
            }
        });
        this.compile().then(_ => this.render());
    }

    protected animateCameraTo(object: THREE.Object3D) {
        this.resumeAllSubregions();
        this._mainLight.rotation.set(0, 0, 0);
        const cameraPosFrom =  this._context.camera.position;
        const targetPosFrom = this._controls.target;
        const mainLightFrom = this._mainLight.position;
        const centerPos: [number, number] = object.userData.centerMap;
        // 完成动画后，切换到子区域
        if(!!object.userData.name) {
            object3DFromGeoJson(
                '/map/' + this._mappings[object.userData.name], {
                    areaColor: this._areaColorOnPopUp,
                    borderColor: this._borderColorOnPopUp,
                    lineType: LineType.NormalLine,
                    lineHeight: this._regionHeight + 0.001
                }
            )
                .then((subregions: THREE.Object3D[]) => {
                    this._regions.push(object);
                    this._subregions = subregions;
                    subregions.forEach((region: THREE.Object3D) => {
                        const center = chinaProjection(region.userData.center as [number, number])!;
                        const anchor = new Anchor(region.userData.name);
                        anchor.position.set(center[0], this._regionHeight + 0.01, center[1]);
                        this._anchors.push(anchor);
                        region.traverse(o => {
                            if(o.type === 'Mesh') {
                                o.scale.set(1, 1, this._regionHeight);
                            }
                        });
                    });
                    const gl = (this._context.renderer as THREE.WebGLRenderer);
                    const scene = new THREE.Object3D;
                    scene.add(...subregions);
                    return gl.compileAsync(scene, this._context.camera, this._context.scene);
                });
        }
        this._animations.start({
            animation: new TWEEN.Tween({
                camera: {
                    pos: { x: cameraPosFrom.x, y: cameraPosFrom.y, z: cameraPosFrom.z },
                    target: { x: targetPosFrom.x, y: targetPosFrom.y, z: targetPosFrom.z }
                },
                mainLight: { x: mainLightFrom.x, y: mainLightFrom.y, z: mainLightFrom.z },
            })
                .to({
                    camera: {
                        pos: { x: centerPos[0] + 5, y: 15, z: centerPos[1] + 20 },
                        target: { x: centerPos[0], y: 0, z: centerPos[1] },
                    },
                    mainLight: { x: centerPos[0], y: 20, z: centerPos[1] },
                })
                .duration(500)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onUpdate(o => {
                    this._mainLight.position.set(o.mainLight.x, o.mainLight.y, o.mainLight.z);
                    this._controls.target.set(o.camera.target.x, o.camera.target.y, o.camera.target.z);
                    this._context.camera.position.set(o.camera.pos.x, o.camera.pos.y, o.camera.pos.z);
                    this._controls.update();
                })
                .onComplete(() => {
                    // 隐藏掉当前运动的区域
                    object.traverse(o => {
                        if(o.type === 'Mesh') {
                            o.visible = false;
                        }
                    });
                    this.add(...this._subregions, ...this._anchors);
                })
                .start(),
            id: object.uuid
        });
        object.traverse(obj => {
            // 只对实心板块进行补间动画
            if(obj.type === 'Mesh') {
                this._animations.start({
                    animation:  new TWEEN.Tween({
                        height: 1,
                        color: {
                            r: this._areaColor.r,
                            g: this._areaColor.g,
                            b: this._areaColor.b,
                        }
                    })
                        .to({
                            height: this._regionHeight,
                            color: {
                                r: this._areaColorOnPopUp.r,
                                g: this._areaColorOnPopUp.g,
                                b: this._areaColorOnPopUp.b,
                            }
                        })
                        .duration(500)
                        .interpolation(TWEEN.Interpolation.Bezier)
                        .onUpdate(o => {
                            // 拉长板块的大小
                            obj.scale.set(1, 1, o.height);
                            // 颜色过渡
                            ((obj as THREE.Mesh).material as THREE.MeshStandardMaterial)
                                .color.set(o.color.r, o.color.g, o.color.b);
                        })
                        .start(),
                    id: obj.uuid
                });
            }
        });
    }

    protected override async pointerDownEvent(event: PointerEvent): Promise<void> {
        if(event.isPrimary && event.button === 0) {
            if(this._subregions.length !== 0) {
                const subregion: THREE.Object3D | undefined = this.intersects(event, this._subregions);
                if(subregion) {
                    // 通知路由器进行路由切换
                    this.dispatchEvent(new RouteSwitchEvent('substation-scene', {
                        region: subregion.userData.name
                    }));
                    return;
                } else {
                    // 单击了空白处，取消选中所有区域
                    this._rayCaster.setFromCamera(
                        CanvasRenderer.getNormalizedPointerPosition(event),
                        this._context.camera
                    );
                    if(this._plane && !!this._rayCaster.intersectObject(this._plane)) {
                        this.resumeAllSubregions();
                    }
                }
            }
            const region: THREE.Object3D | undefined = this.intersects(event);
            // 点击了某个区域
            if(region) {
                this.animateCameraTo(region);
            }
        }
        return super.pointerDownEvent(event);
    }
}