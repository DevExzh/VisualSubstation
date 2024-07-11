import * as THREE from 'three';
import {memcpy} from "../common/Utils.ts";

/**
 * 线条
 * @description Fork 自 three.meshline
 * @see https://github.com/spite/THREE.MeshLine
 */
export class MeshLineGeometry extends THREE.BufferGeometry {
    readonly isMeshLine: boolean = true;
    readonly type: string = 'MeshLine';
    positions: number[] = [];
    previous: number[] = [];
    next: number[] = [];
    side: number[] = [];
    width: number[] = [];
    indices_array: number[] = [];
    uvs: number[] = [];
    counters: number[] = [];
    private _points: THREE.Vector3[] | Float32Array = [];
    private _geom: THREE.BufferGeometry = new THREE.BufferGeometry();
    private widthCallback?: (index: number) => number;
    private _attributes?: {
        position: THREE.BufferAttribute,
        previous: THREE.BufferAttribute,
        next: THREE.BufferAttribute,
        side: THREE.BufferAttribute,
        width: THREE.BufferAttribute,
        uv: THREE.BufferAttribute,
        index: THREE.BufferAttribute,
        counters: THREE.BufferAttribute,
    };
    matrixWorld: THREE.Matrix4 = new THREE.Matrix4();

    constructor() {
        super();
    }

    get geometry(): THREE.BufferGeometry {
        return this;
    }

    get geom(): THREE.BufferGeometry {
        return this._geom;
    }

    set geom(value: THREE.BufferGeometry) {
        this.setGeometry(value, this.widthCallback);
    }

    get points(): THREE.Vector3[] | Float32Array {
        return this._points;
    }

    set points(value: THREE.Vector3[] | Float32Array) {
        this.setPoints(value, this.widthCallback);
    }

    setMatrixWorld(matrixWorld: THREE.Matrix4) {
        this.matrixWorld = matrixWorld;
    }

    setGeometry(g: THREE.BufferGeometry, c?: (index: number) => number) {
        this._geom = g;
        this.setPoints(g.getAttribute('position').array as Float32Array, c);
    }

    setPoints(points: Float32Array | THREE.Vector3[], wcb?: (index: number) => number) {
        if (!(points instanceof Array) && !(points instanceof Float32Array)) {
            console.error('ERROR: The BufferArray of points is not instanced correctly.');
            return;
        }
        this.widthCallback = wcb ?? (_ => 1);
        this.positions = [];
        this.counters = [];
        if (points.length && points[0] instanceof THREE.Vector3) {
            this._points = points as THREE.Vector3[];
            for (let j = 0; j < this._points.length; j++) {
                const p = this._points[j] as THREE.Vector3;
                const c = j / this._points.length;
                this.positions.push(p.x, p.y, p.z);
                this.positions.push(p.x, p.y, p.z);
                this.counters.push(c);
                this.counters.push(c);
            }
        } else {
            this._points = points as unknown as Float32Array;
            for (let j = 0; j < this._points.length; j += 3) {
                const c = j / this._points.length;
                this.positions.push(this._points[j], this._points[j + 1], this._points[j + 2]);
                this.positions.push(this._points[j], this._points[j + 1], this._points[j + 2]);
                this.counters.push(c);
                this.counters.push(c);
            }
        }
        this.process();
    }

    private process() {
        const l = this.positions.length / 6;

        this.previous = [];
        this.next = [];
        this.side = [];
        this.width = [];
        this.indices_array = [];
        this.uvs = [];

        let w: number;
        let v: number[];

        if (this.compareV3(0, l - 1)) {
            v = this.copyV3(l - 2);
        } else {
            v = this.copyV3(0);
        }
        this.previous.push(v[0], v[1], v[2]);
        this.previous.push(v[0], v[1], v[2]);

        for (let j = 0; j < l; j++) {
            this.side.push(1);
            this.side.push(-1);

            w = this.widthCallback ? this.widthCallback(j / (l - 1)) : 1;
            this.width.push(w);
            this.width.push(w);

            this.uvs.push(j / (l - 1), 0);
            this.uvs.push(j / (l - 1), 1);

            if (j < l - 1) {
                v = this.copyV3(j);
                this.previous.push(v[0], v[1], v[2]);
                this.previous.push(v[0], v[1], v[2]);

                const n = j * 2;
                this.indices_array.push(n, n + 1, n + 2);
                this.indices_array.push(n + 2, n + 1, n + 3);
            }
            if (j > 0) {
                v = this.copyV3(j);
                this.next.push(v[0], v[1], v[2]);
                this.next.push(v[0], v[1], v[2]);
            }
        }

        if (this.compareV3(l - 1, 0)) {
            v = this.copyV3(1);
        } else {
            v = this.copyV3(l - 1);
        }
        this.next.push(v[0], v[1], v[2]);
        this.next.push(v[0], v[1], v[2]);

        if (!this._attributes || this._attributes.position.count !== this.positions.length) {
            this._attributes = {
                position: new THREE.BufferAttribute(new Float32Array(this.positions), 3),
                previous: new THREE.BufferAttribute(new Float32Array(this.previous), 3),
                next: new THREE.BufferAttribute(new Float32Array(this.next), 3),
                side: new THREE.BufferAttribute(new Float32Array(this.side), 1),
                width: new THREE.BufferAttribute(new Float32Array(this.width), 1),
                uv: new THREE.BufferAttribute(new Float32Array(this.uvs), 2),
                index: new THREE.BufferAttribute(new Uint16Array(this.indices_array), 1),
                counters: new THREE.BufferAttribute(new Float32Array(this.counters), 1),
            };
        } else {
            this._attributes.position.copyArray(new Float32Array(this.positions));
            this._attributes.position.needsUpdate = true;
            this._attributes.previous.copyArray(new Float32Array(this.previous));
            this._attributes.previous.needsUpdate = true;
            this._attributes.next.copyArray(new Float32Array(this.next));
            this._attributes.next.needsUpdate = true;
            this._attributes.side.copyArray(new Float32Array(this.side));
            this._attributes.side.needsUpdate = true;
            this._attributes.width.copyArray(new Float32Array(this.width));
            this._attributes.width.needsUpdate = true;
            this._attributes.uv.copyArray(new Float32Array(this.uvs));
            this._attributes.uv.needsUpdate = true;
            this._attributes.index.copyArray(new Uint16Array(this.indices_array));
            this._attributes.index.needsUpdate = true;
        }

        this.setAttribute('position', this._attributes.position);
        this.setAttribute('previous', this._attributes.previous);
        this.setAttribute('next', this._attributes.next);
        this.setAttribute('side', this._attributes.side);
        this.setAttribute('width', this._attributes.width);
        this.setAttribute('uv', this._attributes.uv);
        this.setAttribute('counters', this._attributes.counters);

        this.setIndex(this._attributes.index);

        this.computeBoundingSphere();
        this.computeBoundingBox();
    }

    private compareV3(a: number, b: number): boolean {
        const aa = a * 6;
        const ab = b * 6;
        return (
            this.positions[aa] === this.positions[ab] &&
            this.positions[aa + 1] === this.positions[ab + 1] &&
            this.positions[aa + 2] === this.positions[ab + 2]
        );
    }

    private copyV3(a: number): [number, number, number] {
        const aa = a * 6;
        return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
    }

    advance(position: THREE.Vector3) {
        const positions = this._attributes!.position.array as Float32Array;
        const previous = this._attributes!.previous.array as Float32Array;
        const next = this._attributes!.next.array as Float32Array;
        const l = positions.length;

        memcpy(positions, 0, previous, 0, l);
        memcpy(positions, 6, positions, 0, l - 6);

        positions[l - 6] = position.x;
        positions[l - 5] = position.y;
        positions[l - 4] = position.z;
        positions[l - 3] = position.x;
        positions[l - 2] = position.y;
        positions[l - 1] = position.z;

        memcpy(positions, 6, next, 0, l - 6);

        next[l - 6] = position.x;
        next[l - 5] = position.y;
        next[l - 4] = position.z;
        next[l - 3] = position.x;
        next[l - 2] = position.y;
        next[l - 1] = position.z;

        this._attributes!.position.needsUpdate = true;
        this._attributes!.previous.needsUpdate = true;
        this._attributes!.next.needsUpdate = true;
    }
}