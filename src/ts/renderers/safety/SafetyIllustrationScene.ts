import {CanvasScene} from "../CanvasScene.ts";
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {SafetyIllustrationRenderer} from "./SafetyIllustrationRenderer.ts";

export class SafetyIllustrationScene extends CanvasScene {
    protected initRenderer(): CanvasRenderer {
        return new SafetyIllustrationRenderer(this.canvas, document.body);
    }

    protected initWorker(): Worker {
        return new Worker(
            new URL('./SafetyIllustrationWorker.ts', import.meta.url),
            {type: 'module'}
        );
    }
}