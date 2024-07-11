import * as THREE from 'three';
import {SceneObject, sceneObjectFromObject3D} from "../common/Types.ts";

interface BVHNode {
    boundingBox: THREE.Box3;
    children: BVHNode[];
    meshes: THREE.Mesh[];
}

/**
 * 碰撞检测
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 * @since 17th June, 2024
 * @deprecated 已弃用，请换用 `three-mesh-bvh` 实现以替代
 */
export abstract class CollisionDetector {
    public abstract addMesh(mesh: THREE.Mesh): void;
    public abstract intersect(camera: THREE.Camera): SceneObject[];
}

/**
 * @deprecated
 */
export class BVHTree implements CollisionDetector {
    private readonly root: BVHNode;

    constructor(meshes?: THREE.Mesh[]) {
        this.root = { boundingBox: new THREE.Box3(), children: [], meshes: [] };
        if (meshes) {
            meshes.forEach(mesh => this.addMesh(mesh));
        }
    }

    private buildBVH(meshes: THREE.Mesh[]): BVHNode {
        if (meshes.length === 0) {
            return { boundingBox: new THREE.Box3(), children: [], meshes: [] };
        }

        const boundingBox = new THREE.Box3();
        meshes.forEach(mesh => {
            mesh.geometry.computeBoundingBox();
            boundingBox.expandByObject(mesh);
        });

        if (meshes.length <= 2) {
            return { boundingBox, children: [], meshes };
        }

        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        const axis = size.x > size.y ? (size.x > size.z ? 'x' : 'z') : (size.y > size.z ? 'y' : 'z');
        meshes.sort((a, b) => a.position[axis] - b.position[axis]);

        const mid = Math.floor(meshes.length / 2);
        const left = meshes.slice(0, mid);
        const right = meshes.slice(mid);

        return {
            boundingBox,
            children: [this.buildBVH(left), this.buildBVH(right)],
            meshes: []
        };
    }

    public addMesh(mesh: THREE.Mesh): void {
        mesh.geometry.computeBoundingBox();
        this.insertMesh(this.root, mesh);
    }

    private insertMesh(node: BVHNode, mesh: THREE.Mesh): void {
        node.boundingBox.expandByObject(mesh);

        if (node.children.length === 0 && node.meshes.length < 2) {
            node.meshes.push(mesh);
        } else {
            if (node.children.length === 0) {
                node.children = this.splitNode(node);
            }

            const size = new THREE.Vector3();
            node.boundingBox.getSize(size);

            const axis = size.x > size.y ? (size.x > size.z ? 'x' : 'z') : (size.y > size.z ? 'y' : 'z');
            const value = mesh.position[axis];

            if (value < (node.children[0].boundingBox.max[axis] + node.children[0].boundingBox.min[axis]) / 2) {
                this.insertMesh(node.children[0], mesh);
            } else {
                this.insertMesh(node.children[1], mesh);
            }
        }
    }

    private splitNode(node: BVHNode): BVHNode[] {
        const size = new THREE.Vector3();
        node.boundingBox.getSize(size);

        const axis = size.x > size.y ? (size.x > size.z ? 'x' : 'z') : (size.y > size.z ? 'y' : 'z');
        node.meshes.sort((a, b) => a.position[axis] - b.position[axis]);

        const mid = Math.floor(node.meshes.length / 2);
        const leftMeshes = node.meshes.slice(0, mid);
        const rightMeshes = node.meshes.slice(mid);

        const leftNode = this.buildBVH(leftMeshes);
        const rightNode = this.buildBVH(rightMeshes);

        return [leftNode, rightNode];
    }

    public intersect(camera: THREE.Camera): SceneObject[] {
        const frustum = new THREE.Frustum();
        const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(matrix);

        const nodes =  this.intersectNode(this.root, frustum, camera.position);
        const results: SceneObject[] = [];
        nodes.forEach(node => {
            const obj = sceneObjectFromObject3D(node);
            if(obj) results.push(obj);
        })
        return results;
    }

    private intersectNode(
        node: BVHNode, frustum: THREE.Frustum,
        cameraPosition: THREE.Vector3
    ): THREE.Mesh[] {
        if (!frustum.intersectsBox(node.boundingBox)) {
            return [];
        }

        let intersectedMeshes: THREE.Mesh[] = [];

        for (const mesh of node.meshes) {
            if (frustum.intersectsBox(mesh.geometry.boundingBox!)) {
                intersectedMeshes.push(mesh);
            }
        }

        for (const child of node.children) {
            intersectedMeshes = intersectedMeshes.concat(
                this.intersectNode(child, frustum, cameraPosition)
            );
        }

        return intersectedMeshes;
    }
}