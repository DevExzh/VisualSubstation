import {EventObject} from "./AnyEvent.ts";

export interface WorkerEvent {
    type: 'worker-event';
    event: EventObject;
}