import {CanvasScene} from "../CanvasScene.ts";
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {SkyRenderer} from "./SkyRenderer.ts";

/**
 * 天空场景
 * @class
 * @author Ryker Zhu
 * @since 9th June, 2024
 */
export class SkyScene extends CanvasScene {
    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }
    protected initWorker(): Worker {
        return new Worker(
            new URL('./SkyRenderWorker.ts', import.meta.url),
            {type: 'module'}
        );
    }
    protected initRenderer(): CanvasRenderer {
        return new SkyRenderer(
            this._canvas,
            document.body
        );
    }
}