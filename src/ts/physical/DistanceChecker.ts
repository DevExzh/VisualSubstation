import * as THREE from 'three';
import {ThreeContext} from "../common/Types.ts";
import {Box3} from "three";

/**
 * 空间距离检测
 * @description 空间分拣算法（spatial binning algorithm）, 能够在 O(1) 的时间复杂度下寻找到对应半径内的物体
 * @since 18th Jun, 2024
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 * @deprecated 已弃用，请换用 `three-mesh-bvh` 实现以替代
 */
export class DistanceChecker {
    private _binSize: number = 1;
    private readonly _context: ThreeContext;
    private readonly _limitBox: THREE.Box3 = new THREE.Box3();
    private readonly _resultMap: Map<THREE.Object3D, boolean> = new Map();
    private readonly _bin: Map<number, Map<number, Map<number, Map<THREE.Object3D, boolean>>>> = new Map();
    // private readonly _binInfo: Map<string, Map<number, Map<number, Map<number, boolean>>>> = new Map();

    public constructor(context: ThreeContext) {
        this._context = context;
        this._limitBox.setFromObject(this._context.scene);
    }

    /**
     * 距离检测的半径
     * @description 注意！应当先设定半径值，再调用 add() 方法添加物体
     * @prop
     */
    public set radius(value: number) {
        this._binSize = Math.round(2 * value / 3);
    }
    public get radius(): number {
        return this._binSize * 3 / 2;
    }

    public add(...objects: THREE.Object3D[]): void {
        Promise.all(objects.map<Promise<void>>(
            (object: THREE.Object3D): Promise<void> => new Promise((resolve, _) => {
                const box = new Box3().setFromObject(object);
                if(box || !this._limitBox.containsBox(box!)) resolve();
                const binSize: number = this._binSize;
                let minX: number = box!.min.x,
                    minY: number = box!.min.y,
                    minZ: number = box!.min.z,
                    maxX: number = box!.max.x,
                    maxY: number = box!.max.y,
                    maxZ: number = box!.max.z,
                    round: number = Math.round(minX / binSize) * binSize,
                    minXLower: number, maxXLower: number,
                    minYLower: number, maxYLower: number,
                    minZLower: number, maxZLower: number
                ;
                if(round <= minX) {
                    minXLower = round;
                } else {
                    minXLower = round - binSize;
                }
                round = Math.round(maxX / binSize) * binSize;
                if(round < maxX) {
                    maxXLower = round;
                } else {
                    maxXLower = round - binSize;
                }
                if(minXLower > maxXLower) {
                    maxXLower = minXLower;
                }
                round = Math.round(minY / binSize) * binSize;
                if(round <= minY) {
                    minYLower = round;
                } else {
                    minYLower = round - binSize;
                }
                round = Math.round(maxY / binSize) * binSize;
                if(round < maxY) {
                    maxYLower = round;
                } else {
                    maxYLower = round - binSize;
                }
                if(minYLower > maxYLower) {
                    maxYLower = minYLower;
                }
                round = Math.round(minZ / binSize) * binSize;
                if(round <= minZ) {
                    minZLower = round;
                } else {
                    minZLower = round - binSize;
                }
                round = Math.round(maxZ / binSize) * binSize;
                if(round < maxZ) {
                    maxZLower = round;
                } else {
                    maxZLower = round - binSize;
                }
                if(minZLower > maxZLower) {
                    maxZLower = minZLower;
                }
                for(let x: number = minXLower; x <= maxXLower; x += binSize) {
                    if(!this._bin.has(x)) {
                        this._bin.set(x ,new Map);
                    }
                    // const objBinInfo = this._binInfo.get(object.uuid)!;
                    // if(!objBinInfo.has(x)) {
                    //     objBinInfo.set(x, new Map);
                    // }
                    for(let y: number = minYLower; y <= maxYLower; y += binSize) {
                        const xMap = this._bin.get(x)!;
                        if(!xMap.has(y)) {
                            xMap.set(y, new Map);
                        }
                        // const objBinInfoX = objBinInfo.get(x)!;
                        // if(!objBinInfoX.has(y)) {
                        //     objBinInfoX.set(y, new Map);
                        // }
                        for(let z: number = minZLower; z <= maxZLower; z += binSize) {
                            const xyMap = xMap.get(y)!;
                            if(!xyMap.has(z)) {
                                xyMap.set(z, new Map);
                            }
                            const xyzMap = xyMap.get(z)!;
                            xyzMap.set(object, true);
                            // objBinInfoX.get(y)!.set(z, true);
                        }
                    }
                }
                resolve();
            })
        ));
    }

    public objectsNearby(vector: THREE.Vector3 = this._context.camera.position): THREE.Object3D[] {
        const binSize = this._binSize;
        let rX: number = Math.round(vector.x / binSize) * binSize,
            rY: number = Math.round(vector.y / binSize) * binSize,
            rZ: number = Math.round(vector.z / binSize) * binSize,
            minX: number, minY: number, minZ: number;
        if(rX <= vector.x) {
            minX = rX;
        } else {
            minX = rX - binSize;
        }
        if(rY <= vector.y) {
            minY = rY;
        } else {
            minY = rY - binSize;
        }
        if(rZ <= vector.z) {
            minZ = rZ;
        } else {
            minZ = rZ - binSize;
        }
        const result: Map<THREE.Object3D, boolean> = this._resultMap;
        result.clear();
        for(let xDiff: number = -binSize; xDiff <= binSize; xDiff += binSize) {
            const keyX: number = minX + xDiff;
            for(let yDiff: number = -binSize; yDiff <= binSize; yDiff += binSize) {
                const keyY: number = minY + yDiff;
                for(let zDiff: number = -binSize; zDiff <= binSize; zDiff += binSize) {
                    const keyZ: number = minZ + zDiff;
                    if(this._bin.has(keyX) && this._bin.get(keyX)!.has(keyY)) {
                        const res = this._bin.get(keyX)!.get(keyY)!.get(keyZ);
                        if(!res) continue;
                        for(const o of res.keys()) {
                            result.set(o, true);
                        }
                    }
                }
            }
        }
        const returnVal: THREE.Object3D[] = [];
        for(const obj of result.keys()) {
            let o: THREE.Object3D | null = obj;
            while(o?.parent?.parent !== null) {
                o = o?.parent!;
            }
            returnVal.push(o);
        }
        return returnVal;
    }
}