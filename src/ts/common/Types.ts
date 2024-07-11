import * as THREE from "three";
import {PerspectiveCamera, Vector4} from "three";
import Color4 from "three/examples/jsm/renderers/common/Color4.js";
import {deepClone} from "./Utils.ts";

/**
 * Three.js 渲染上下文
 * @interface
 */
export interface ThreeContext {
    renderer: THREE.Renderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
}

/**
 * 实现该接口的类有 GLTF、FBX 等
 * @description 使用 as 关键字将加载的模型强制转换成该接口，即可避免 TypeScript 报错
 * @interface
 */
export interface LoadedModel {
    scene: THREE.Scene;
}

/**
 * 渲染画布大小
 * @type
 */
export type CanvasSize = {
    width: number;
    height: number;
};

/**
 * 在场景中的物体
 * @description 由于 Web Worker 与主渲染线程之间不能直接传递对象，故需要将 Three.js 中的 Object3D 转换成可序列化和反序列化的对象
 * @see ModelScene
 * @interface
 */
export interface SceneObject {
    uuid: string;
    id: number;
    name: string;
    position: [number, number, number];
    scale: [number, number, number];
    up: [number, number, number];
    receiveShadow: boolean;
    castShadow: boolean;
    userData: Record<string, any>;
}

/**
 * 将 Three.js 中的 Object3D 对象转换成 SceneObject
 * @param fromObject 需要被转换的 Three.js Object3D 对象
 * @function
 */
export function sceneObjectFromObject3D(fromObject: THREE.Object3D): SceneObject {
    return {
        uuid: fromObject.uuid,
        id: fromObject.id,
        name: fromObject.name,
        position: [fromObject.position.x, fromObject.position.y, fromObject.position.z],
        scale: [fromObject.scale.x, fromObject.scale.y, fromObject.scale.z],
        up: [fromObject.up.x, fromObject.up.y, fromObject.up.z],
        receiveShadow: fromObject.receiveShadow,
        castShadow: fromObject.castShadow,
        userData: deepClone(fromObject.userData)
    };
}

/**
 * 四维方阵
 * @type
 */
export type Matrix4D = [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
];

/**
 * 相机对象
 * @description 由于 Web Worker 与主渲染线程之间不能直接传递对象，故需要将 Three.js 中的 Camera 转换成可序列化和反序列化的对象
 * @see THREE.Camera
 * @see THREE.Matrix4
 * @interface
 */
export interface CameraObject {
    aspect: number,
    far: number,
    near: number,
    zoom: number,
    fov: number,
    focus: number,
    filmGauge: number,
    filmOffset: number,
    position: [number, number, number],
    rotation: [number, number, number],
}

export function cameraObjectFormThreeCamera(camera: PerspectiveCamera): CameraObject {
    return {
        aspect: camera.aspect,
        far: camera.far,
        filmGauge: camera.filmGauge,
        filmOffset: camera.filmOffset,
        focus: camera.focus,
        fov: camera.fov,
        near: camera.near,
        zoom: camera.zoom,
        position: [camera.position.x, camera.position.y, camera.position.z],
        rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
    };
}

export function vector4FromColor4(color: Color4): Vector4 {
    return new Vector4(color.r, color.g, color.b, color.a);
}

export function mergeOptions<T>(options: T, patch?: Partial<T>): T {
    return {...options, ...patch} as T;
}