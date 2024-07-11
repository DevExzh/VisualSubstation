import {deepClone} from "../common/Utils.ts";

export type EventObject = {
    type: string;
} & Record<string, any>;

export class AnyEvent extends Event {
    public readonly listenedEvent: EventObject;
    public constructor(event: Event | EventObject) {
        super('any');
        if(event instanceof Event) {
            this.listenedEvent = deepClone(event, [
                'currentTarget', 'target', 'srcElement'
            ], {
                type: event.type,
            });
        } else {
            this.listenedEvent = event;
        }
    }
}