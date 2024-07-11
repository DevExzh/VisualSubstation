import {ModelRenderer} from "./ModelRenderer.ts";
import {CanvasWorker} from "../CanvasWorker.ts";

new CanvasWorker((canvas, element) => new ModelRenderer(canvas, element));