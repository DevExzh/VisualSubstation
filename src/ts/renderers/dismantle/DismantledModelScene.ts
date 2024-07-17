import {CanvasScene} from "../CanvasScene.ts";
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {DismantledModelRenderer} from "./DismantledModelRenderer.ts";
import {EventObject} from "../../events/AnyEvent.ts";
import {LoadEvent} from "../../events/SceneEvents.ts";

export class DismantledModelScene extends CanvasScene {
    protected initRenderer(): CanvasRenderer {
        return new DismantledModelRenderer(
            this.canvas,
            document.body
        );
    }

    protected initWorker(): Worker {
        return new Worker(
            new URL('./DismantledModelRenderWorker.ts', import.meta.url),
            {type: 'module'}
        );
    }

    protected async eventHandler(event: EventObject): Promise<boolean> {
        if(await super.eventHandler(event)) return true;
        switch (event.type) {
            case 'load': {
                const converted = event as LoadEvent;
                this.dispatchEvent(new LoadEvent(converted.state));
                return true;
            }
            default: return false;
        }
    }
}