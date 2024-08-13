import {ProjectionMethod, WorkerEventType, WorkerProjMessage} from "./ProjectionWorkerTypes.ts";

export class Projector {
    protected _worker: Worker;
    public constructor() {
        this._worker = new Worker(new URL('./ProjectionWorker.ts', import.meta.url), {type: 'module'});
        this._worker.postMessage({
            type: WorkerEventType.INIT,
            projMethod: ProjectionMethod.Mercator
        });
    }
    public clipAngle(angle: number): this {
        this._worker.postMessage({
            type: WorkerEventType.FUNCTION_CALL,
            name: 'clipAngle',
            params: [angle]
        });
        return this;
    }
    public clipExtent(extent: [[number, number], [number, number]]): this {
        this._worker.postMessage({
            type: WorkerEventType.FUNCTION_CALL,
            name: 'clipExtent',
            params: [extent]
        });
        return this;
    }
    public scale(scale: number): this {
        this._worker.postMessage({
            type: WorkerEventType.FUNCTION_CALL,
            name: 'scale',
            params: [scale]
        });
        return this;
    }
    public translate(point: [number, number]): this {
        this._worker.postMessage({
            type: WorkerEventType.FUNCTION_CALL,
            name: 'translate',
            params: [point]
        });
        return this;
    }
    public center(point: [number, number]): this {
        this._worker.postMessage({
            type: WorkerEventType.FUNCTION_CALL,
            name: 'center',
            params: [point]
        });
        return this;
    }
    public angle(angle: number): this {
        this._worker.postMessage({
            type: WorkerEventType.FUNCTION_CALL,
            name: 'angle',
            params: [angle]
        });
        return this;
    }
    public reflectX(reflect: boolean): this {
        this._worker.postMessage({
            type: WorkerEventType.FUNCTION_CALL,
            name: 'reflectX',
            params: [reflect]
        });
        return this;
    }
    public reflectY(reflect: boolean): this {
        this._worker.postMessage({
            type: WorkerEventType.FUNCTION_CALL,
            name: 'reflectY',
            params: [reflect]
        });
        return this;
    }
    public rotate(angles: [number, number] | [number, number, number]): this {
        this._worker.postMessage({
            type: WorkerEventType.FUNCTION_CALL,
            name: 'rotate',
            params: [angles]
        });
        return this;
    }
    public project(point: [number, number]): Promise<[number, number]> {
        return new Promise((resolve, reject) => {
            const eventListener = (e: MessageEvent) => {
                const data = e.data as Record<string, any>;
                this._worker.removeEventListener('message', eventListener);
                if(data.ok) {
                    resolve(data.result);
                } else {
                    reject(data.reason);
                }
            };
            this._worker.addEventListener('message', eventListener);
            this._worker.postMessage({type: WorkerEventType.PROJ, point} as WorkerProjMessage);
        });
    }
}