import {CanvasScene} from "../CanvasScene.ts";
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {MapRenderer} from "./MapRenderer.ts";

export class MapScene extends CanvasScene {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }
    protected initRenderer(): CanvasRenderer {
        return new MapRenderer(
            this.canvas,
            document.body,
            true
        );
    }
    protected initWorker(): Worker {
        return new Worker(
            new URL('./MapRenderWorker.ts', import.meta.url),
            {type: 'module'}
        );
    }
}