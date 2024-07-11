import {CanvasWorker} from "../CanvasWorker.ts";
import {SkyRenderer} from "./SkyRenderer.ts";

new CanvasWorker((canvas, element) => new SkyRenderer(canvas, element));