import {CanvasWorker} from "../CanvasWorker.ts";
import {SafetyIllustrationRenderer} from "./SafetyIllustrationRenderer.ts";

new CanvasWorker(
    (canvas, element) => new SafetyIllustrationRenderer(canvas, element)
);