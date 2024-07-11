import {Mesh, Vector3} from "three";
import {MeshLineMaterial, MeshLineMaterialParameters} from "./MeshLineMaterial.ts";
import {MeshLineGeometry} from "./MeshLineGeometry.ts";

export class MeshLine extends Mesh {
    type: string = 'MeshLine';

    constructor(points: Vector3[] | Float32Array, params?: Partial<MeshLineMaterialParameters>) {
        const geometry = new MeshLineGeometry();
        geometry.setPoints(points)
        super(
            geometry,
            new MeshLineMaterial(params)
        );
    }
}