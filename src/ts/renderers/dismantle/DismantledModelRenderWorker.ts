import {CanvasWorker} from "../CanvasWorker.ts";
import {DismantledModelRenderer} from "./DismantledModelRenderer.ts";

new CanvasWorker((canvas, element) => new DismantledModelRenderer(canvas, element));