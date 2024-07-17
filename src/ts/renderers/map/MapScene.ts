import {CanvasScene} from "../CanvasScene.ts";
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {MapRenderer} from "./MapRenderer.ts";
import {EventObject} from "../../events/AnyEvent.ts";
import {RegionClickEvent} from "../../events/MapEvents.ts";

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

    protected override async eventHandler(event: EventObject): Promise<boolean> {
        if(await super.eventHandler(event)) return true;
        switch (event.type) {
            case 'region-click': {
                const converted = event as RegionClickEvent;
                this.dispatchEvent(new RegionClickEvent(converted.region));
                return true;
            }
            default: return false;
        }
    }
}