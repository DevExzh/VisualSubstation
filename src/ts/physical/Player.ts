import * as THREE from "three";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

const loader: GLTFLoader = new GLTFLoader();

const defaultAnimationMap = {
    walk: 0,
    walkLeft: 11,
    walkRight: 13,
    strideLeft: 9,
    strideRight: 10,
    run: 7,
    idle: 4,
    sit: 16,
    sitToStand: 17,
    jump: 5,
    fall: 3,
};

export type AnimationName = keyof typeof defaultAnimationMap;

export class Player extends THREE.Object3D {
    public type: string = "Player";
    public speed: number = 10;
    public step: number = 5;
    public gravity: number = -30;
    public readonly velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    protected _radius: number = 0;
    public get radius(): number {
        return this._radius;
    }

    protected _segment: THREE.Line3 = new THREE.Line3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
    );
    public get segment(): THREE.Line3 {
        return this._segment;
    }

    // @ts-ignore
    protected _animationMap: Record<AnimationName, THREE.AnimationAction> = {};
    protected _mixer?: THREE.AnimationMixer;
    protected _action?: THREE.AnimationAction;
    protected _name: AnimationName = 'walk';
    protected _skeleton?: THREE.Object3D;

    constructor(modelPath: string) {
        super();
        loader.loadAsync(modelPath).then((gltf: GLTF) => {
            gltf.scene.castShadow = true;
            gltf.scene.traverse(o => {
                if(o.type === 'Mesh') {
                    o.castShadow = true;
                }
            });
            gltf.scene.scale.set(1.75, 1.75, 1.75);
            this.animations = gltf.animations;
            this._skeleton = gltf.scene;
            this.add(gltf.scene);
            this._mixer = new THREE.AnimationMixer(gltf.scene);
            for(const key in defaultAnimationMap) {
                this._animationMap[key as AnimationName] = this._mixer.clipAction(
                    this.animations[defaultAnimationMap[key as AnimationName]]
                );
            }
            this.playAnimation('idle');
            // 计算包围盒
            const boundingBox: THREE.Box3 = new THREE.Box3().setFromObject(this, true);
            // 计算长宽高的大小
            const delta: THREE.Vector3 = boundingBox.max.clone().sub(boundingBox.min);
            // 计算包围胶囊体的半径
            this._radius = Math.min(Math.abs(delta.x) / 2, Math.abs(delta.z) / 2);
            this._segment.start.y = (boundingBox.max.y - this._radius) / 1.75;
            this._segment.end.y = (boundingBox.min.y + this._radius) / 1.75;
            this._radius /= 1.75;
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    public playAnimation(name: AnimationName): void {
        if(name in this._animationMap && name != this._name) {
            this._name = name;
            this._action?.fadeOut(0.2);
            const action: THREE.AnimationAction = this._animationMap[name];
            action.reset();
            action.fadeIn(0.2);
            action.play();
            this._action = action;
        }
    }

    public update(deltaTime: number): void {
        this._mixer?.update(deltaTime);
    }
}