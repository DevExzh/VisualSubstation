export enum WorkerMessageType {
    DISPOSE,
    INIT,
    FACTORY,
    EVENT,
    FUNCTION_CALL,
    PROPERTY_GET_SET
}

export interface WorkerMessage {
    type: WorkerMessageType | number;
    params: any;
}

export interface WorkerInitMessage extends WorkerMessage {
    type: WorkerMessageType.INIT;
    params: {
        id: string;
        canvas: OffscreenCanvas;
        pixelRatio: number;
        width: number;
        height: number;
    }
}

export interface WorkerEventMessage extends WorkerMessage {
    type: WorkerMessageType.EVENT;
    params: {
        id: string;
        event: {
            type: string,
            [key: string]: any
        }
    }
}

export interface WorkerResizeEventMessage extends WorkerEventMessage {
    type: WorkerMessageType.EVENT;
    params: {
        id: string;
        event: {
            type: 'resize',
            top: number,
            left: number,
            right: number,
            bottom: number,
            width: number,
            height: number,
        }
    }
}

export interface WorkerDisposalMessage extends WorkerMessage {
    type: WorkerMessageType.DISPOSE;
}

export interface WorkerFactoryMessage extends WorkerMessage {
    type: WorkerMessageType.FACTORY;
    params: {
        id: string;
    }
}

export interface WorkerPropertyOperationMessage extends WorkerMessage {
    type: WorkerMessageType.PROPERTY_GET_SET;
    params: {
        propertyName: string,
        uuid: string,
        operation: 'get' | 'set',
        value?: any
    }
}

export interface WorkerFunctionCallMessage extends WorkerMessage {
    type: WorkerMessageType.FUNCTION_CALL;
    params: {
        functionName: string,
        isAsync: boolean,
        parameters: any[],
        uuid: string
    }
}

export type WorkerCommonMessages =
    WorkerDisposalMessage | WorkerInitMessage | WorkerEventMessage | WorkerFactoryMessage
    | WorkerFunctionCallMessage | WorkerPropertyOperationMessage;

/**
 * Web Worker 代理
 * @class
 */
export class WorkerProxy implements Disposable {
    public readonly worker: Worker;
    protected readonly htmlElement: HTMLElement;
    protected readonly elementId: string;
    protected readonly offscreen: OffscreenCanvas;

    /**
     * Web Worker 代理构造函数
     * @param worker Web Worker 实例，以供移交控制给当前代理
     * @param canvas 离屏渲染画布
     * @param htmlElement
     * @param elementId
     */
    constructor(
        worker: Worker,
        canvas: OffscreenCanvas,
        htmlElement: HTMLElement,
        elementId: string = 'root'
    ) {
        this.worker = worker;
        this.offscreen = canvas;
        this.htmlElement = htmlElement;
        this.elementId = elementId;
        if(!this.htmlElement) {
            this.worker.postMessage({
                type: WorkerMessageType.FACTORY,
                params: { id: this.elementId }
            });
        }
        this.worker.postMessage(
            {
                type: WorkerMessageType.INIT,
                params: {
                    canvas: this.offscreen,
                    id: this.elementId,
                    pixelRatio: window.devicePixelRatio,
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            },
            [this.offscreen]
        );
        this.setupEventListeners();
    }

    /**
     * 设置事件监听器
     * @abstract
     * @function
     */
    setupEventListeners(): void {
        // Do nothing
    }

    postEvent(event: any) {
        this.worker.postMessage({
            type: WorkerMessageType.EVENT,
            params: {
                id: this.elementId,
                event
            }
        });
    }

    postCustomEvent(type: number, params: {[key: string]: any}): void {
        this.worker.postMessage({
            type,
            params
        });
    }

    [Symbol.dispose]() {
        this.worker.postMessage({
            type: WorkerMessageType.DISPOSE
        });
    }
}