import {
    ProjectionMethod,
    WorkerEventType, WorkerFunctionCallMessage,
    WorkerInitMessage,
    WorkerMessage,
    WorkerProjMessage
} from "./ProjectionWorkerTypes";
import {geoMercator, GeoProjection} from "d3-geo";

let proj: GeoProjection;

self.onmessage = (e: MessageEvent) => {
    const data = e.data as WorkerMessage;
    switch (data.type) {
    case WorkerEventType.INIT: {
        switch ((data as WorkerInitMessage).projMethod) {
            case ProjectionMethod.Mercator: {
                proj = geoMercator();
                break;
            }
        }
        break;
    }
    case WorkerEventType.PROJ: {
        if(!proj) {
            self.postMessage({
                ok: false,
                reason: 'Not ready'
            });
            break;
        }
        const projected = proj((data as WorkerProjMessage).point);
        if(projected) {
            self.postMessage({
                ok: true,
                result: projected
            });
        } else {
            self.postMessage({
                ok: false,
                reason: 'Projection failed'
            });
        }
        break;
    }
    case WorkerEventType.FUNCTION_CALL: {
        if(!proj) {
            self.postMessage({
                ok: false,
                reason: 'Not ready'
            });
            break;
        }
        const msg = data as WorkerFunctionCallMessage;
        // @ts-ignore
        proj[msg.name](...msg.params);
        break;
    }
    default: return;
    }
};