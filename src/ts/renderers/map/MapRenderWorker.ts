import {CanvasWorker} from "../CanvasWorker.ts";
import {MapRenderer} from "./MapRenderer.ts";

new CanvasWorker((canvas, element) => new MapRenderer(canvas, element));