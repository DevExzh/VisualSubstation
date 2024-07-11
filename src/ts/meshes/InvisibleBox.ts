import * as THREE from 'three';
import {SceneObjectBoundingBox} from "../events/SceneEvents.ts";

const indices: Uint16Array = new Uint16Array( [ 0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7 ] );
const positions: number[] = [ 1, 1, 1, - 1, 1, 1, - 1, - 1, 1, 1, - 1, 1, 1, 1, - 1, - 1, 1, - 1, - 1, - 1, - 1, 1, - 1, - 1 ];
const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
geometry.setIndex(new THREE.BufferAttribute(indices, 1));
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.computeBoundingSphere();

export class InvisibleBox extends THREE.Mesh {
    public visible: boolean = false;
    public readonly boundingBox: THREE.Box3 = new THREE.Box3();
    constructor(aabb: SceneObjectBoundingBox) {
        super(geometry);
        this.boundingBox.max.set(...aabb.max);
        this.boundingBox.min.set(...aabb.min);
        this.uuid = aabb.uuid;
        this.name = aabb.name;
        if(aabb.userData) {
            this.userData = aabb.userData;
        }
    }
}