export enum WorkerEventType {
    INIT,
    PROJ,
    FUNCTION_CALL
}

export enum ProjectionMethod {
    Mercator
}

export interface WorkerMessage {
    type: WorkerEventType;
}

export interface WorkerInitMessage extends WorkerMessage {
    type: WorkerEventType.INIT;
    projMethod: ProjectionMethod;
}

export interface WorkerProjMessage extends WorkerMessage {
    type: WorkerEventType.PROJ;
    point: [number, number];
}

export interface WorkerFunctionCallMessage extends WorkerMessage {
    type: WorkerEventType.FUNCTION_CALL;
    name: string;
    params: any[]
}