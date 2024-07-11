import {CameraObject, SceneObject, sceneObjectFromObject3D} from "../common/Types.ts";
import {Object3D} from "three";

export class CameraChangeEvent extends Event {
    public readonly camera: CameraObject;
    constructor(camera: CameraObject) {
        super('camera-change');
        this.camera = camera;
    }
}

export class ObjectSelectionEvent extends Event {
    public readonly selected: boolean;
    public readonly camera: CameraObject;
    public readonly objects: SceneObject[] = [];
    constructor(selected: boolean, camera: CameraObject, ...objects: SceneObject[]) {
        super('object-selection');
        this.selected = selected;
        this.camera = camera;
        this.objects = objects;
    }
}

export enum SceneChangeEventType {
    ObjectsAdded,
    ObjectsRemoved
}

export class SceneRawObjectChangeEvent extends Event {
    public readonly objects: Object3D[];
    public readonly eventType: SceneChangeEventType;
    constructor(eventType: SceneChangeEventType, ...objects: Object3D[]) {
        super('scene-raw-object');
        this.objects = objects;
        this.eventType = eventType;
    }
}

export class SceneObjectChangeEvent extends Event {
    public readonly objects: SceneObject[];
    public readonly eventType: SceneChangeEventType;
    constructor(eventType: SceneChangeEventType, ...objects: Object3D[] | SceneObject[]) {
        super('scene-object-change');
        if("isObject3D" in objects[0]) {
            this.objects = objects.map<SceneObject>(
                o => sceneObjectFromObject3D(o as Object3D)
            );
        } else {
            this.objects = objects as SceneObject[];
        }
        this.eventType = eventType;
    }
}

export interface SceneObjectBoundingBox {
    min: [number, number, number];
    max: [number, number, number];
    name: string;
    uuid: string;
    userData?: Record<string, any>;
}

export class SceneObjectBoundingBoxEvent extends Event {
    public readonly boundingBox: SceneObjectBoundingBox;
    constructor(aabb: SceneObjectBoundingBox) {
        super('bounding-box');
        this.boundingBox = aabb;
    }
}

export enum LoadState {
    Loading,
    Completed,
    Failed
}

export class LoadEvent extends Event {
    public readonly state: LoadState;
    constructor(state: LoadState) {
        super('load');
        this.state = state;
    }
}