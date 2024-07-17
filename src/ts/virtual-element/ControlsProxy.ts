import {WorkerMessageType, WorkerProxy, WorkerResizeEventMessage} from "./WorkerProxy.ts";

namespace PropertyConstraints {
    export const MouseEventProperties: string[] = [
        'type', 'isPrimary', 'pointerType', 'button', 'clientX', 'clientY', 'ctrlKey', 'metaKey', 'shiftKey'
    ];
    export const WheelEventProperties: string[] = [
        'type', 'deltaX', 'deltaY', 'clientX', 'clientY'
    ];
    export const KeyboardEventProperties: string[] = [
        'type', 'code', 'ctrlKey', 'metaKey', 'shiftKey', 'altKey'
    ];
    export const TouchEventProperties: string[] = ['type'];
    export const TouchProperties: string[] = ['pageX', 'pageY'];
}

/**
 * 拦截发送给页面元素的事件，并发送给 Worker 线程
 * @class
 */
export class ControlsProxy extends WorkerProxy {
    constructor(
        worker: Worker,
        canvas: OffscreenCanvas,
        htmlElement: HTMLElement,
        elementId: string = 'root'
    ) {
        super(worker, canvas, htmlElement, elementId);
    }

    protected static copyProperties<T>(fromObj: T, properties: string[]): { [key: string]: any } {
        let result: { [key: string]: any } = {};
        properties.forEach(key => {
            result[key] = (fromObj as { [key: string]: any })[key];
        });
        return result;
    }

    resizeEvent() {
        const rect = <DOMRect>this.htmlElement.getBoundingClientRect();
        this.worker.postMessage({
            type: WorkerMessageType.EVENT,
            params: {
                id: this.elementId,
                event: {
                    type: 'resize',
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom,
                    width: rect.width,
                    height: rect.height,
                }
            }
        } as WorkerResizeEventMessage);
    }

    pointerDownEvent(event: PointerEvent): void {
        event.preventDefault();
        switch (event.pointerType) {
            case 'mouse': case 'pen': {
                this.mouseDownEvent(event);
                break;
            }
            default: break;
        }
    }

    mouseDownEvent(event: MouseEvent): void {
        event.preventDefault();
        this.postEvent(ControlsProxy.copyProperties(event, PropertyConstraints.MouseEventProperties));
    }

    pointerMoveEvent(event: PointerEvent): void {
        event.preventDefault();
        switch (event.pointerType) {
            case 'mouse': case 'pen': {
                this.mouseMoveEvent(event);
                break;
            }
            default: break;
        }
    }

    mouseMoveEvent(event: MouseEvent): void {
        event.preventDefault();
        this.postEvent(ControlsProxy.copyProperties(event, PropertyConstraints.MouseEventProperties));
    }

    pointerUpEvent(event: PointerEvent): void {
        event.preventDefault();
        switch (event.pointerType) {
            case 'mouse': case 'pen': case 'touch': {
                this.mouseUpEvent(event);
                break;
            }
            default: break;
        }
    }

    mouseLeaveEvent(event: MouseEvent): void {
        event.preventDefault();
        this.postEvent(ControlsProxy.copyProperties(event, PropertyConstraints.MouseEventProperties));
    }

    pointerLeaveEvent(event: PointerEvent): void {
        event.preventDefault();
        switch (event.pointerType) {
            case 'mouse': case 'pen': case 'touch': {
                this.mouseLeaveEvent(event);
                break;
            }
            default: break;
        }
    }

    mouseUpEvent(event: MouseEvent): void {
        event.preventDefault();
        this.postEvent(ControlsProxy.copyProperties(event, PropertyConstraints.MouseEventProperties));
    }

    wheelEvent(event: WheelEvent): void {
        event.preventDefault();
        this.postEvent(ControlsProxy.copyProperties(event, PropertyConstraints.WheelEventProperties));
    }

    keyboardEvent(event: KeyboardEvent): void {
        event.preventDefault();
        this.postEvent(ControlsProxy.copyProperties(event, PropertyConstraints.KeyboardEventProperties));
    }

    touchEvent(event: TouchEvent): void {
        event.preventDefault();
        const virtualEvent = ControlsProxy.copyProperties(event, PropertyConstraints.TouchEventProperties);
        let touches = [];
        for(const touch of event.touches) {
            touches.push(ControlsProxy.copyProperties(touch, PropertyConstraints.TouchProperties));
        }
        virtualEvent.touches = touches;
        this.postEvent(virtualEvent);
    }

    gotPointerCaptureEvent(event: PointerEvent): void {
        this.setPointerCapture(event.pointerId);
        this.postEvent(ControlsProxy.copyProperties(event, PropertyConstraints.MouseEventProperties));
    }

    setPointerCapture(pointerId: number): void {
        this.htmlElement?.setPointerCapture(pointerId);
    }

    lostPointerCaptureEvent(event: PointerEvent): void {
        this.releasePointerCaptureEvent(event.pointerId);
        this.postEvent(ControlsProxy.copyProperties(event, PropertyConstraints.MouseEventProperties));
    }

    releasePointerCaptureEvent(pointerId: number): void {
        this.htmlElement?.releasePointerCapture(pointerId);
    }

    contextMenuEvent(event: MouseEvent): void {
        event.preventDefault();
        this.mouseDownEvent(event);
    }

    setupEventListeners() {
        this.resizeEvent();
        const listenerOptions = {capture: true, passive: false};
        new ResizeObserver(this.resizeEvent.bind(this)).observe(this.htmlElement);
        window.addEventListener('keydown', this.keyboardEvent.bind(this), listenerOptions);
        window.addEventListener('keyup', this.keyboardEvent.bind(this), listenerOptions);
        window.addEventListener('pointerup', this.pointerUpEvent.bind(this));
        this.htmlElement.addEventListener('contextmenu', this.contextMenuEvent.bind(this));
        this.htmlElement.addEventListener('pointerdown', this.pointerDownEvent.bind(this), listenerOptions);
        this.htmlElement.addEventListener('pointermove', this.pointerMoveEvent.bind(this), listenerOptions);
        this.htmlElement.addEventListener('pointerleave', this.pointerLeaveEvent.bind(this), listenerOptions);
        this.htmlElement.addEventListener('wheel', this.wheelEvent.bind(this), listenerOptions);
        this.htmlElement.addEventListener('touchstart', this.touchEvent.bind(this), listenerOptions);
        this.htmlElement.addEventListener('touchend', this.touchEvent.bind(this), listenerOptions);
        this.htmlElement.addEventListener('touchmove', this.touchEvent.bind(this), listenerOptions);
        this.htmlElement.addEventListener('gotpointercapture', this.gotPointerCaptureEvent.bind(this), listenerOptions);
        this.htmlElement.addEventListener('lostpointercapture', this.lostPointerCaptureEvent.bind(this), listenerOptions);
    }
}