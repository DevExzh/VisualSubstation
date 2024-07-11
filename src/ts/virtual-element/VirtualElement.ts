import {EventDispatcher} from "three";

export type VirtualElementRect = {
    left: number,
    right: number,
    top: number,
    bottom: number,
    width: number,
    height: number,
};

export interface ListenerEvent {
    target?: EventDispatcher;
    type: string;
    message: any;
}

interface Event extends ListenerEvent {
    preventDefault: () => void,
    stopPropagation: () => void,
}

interface ResizeEvent extends Event {
    left: number,
    right: number,
    top: number,
    bottom: number,
    width: number,
    height: number,
}

export class VirtualWindow extends EventDispatcher {
    constructor() {
        super();
    }
    public innerWidth: number = 0;
    public innerHeight: number = 0;
}

export class VirtualElement extends EventDispatcher {
    public ownerDocument: VirtualElement = this;
    // 模拟 DOM 元素的 style 属性
    public style: {[key: string]: any} = {}
    // 虚拟元素的大小信息
    private rect: VirtualElementRect = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
    };
    constructor() {
        super();
    }
    focus = () => {};
    get clientWidth(): number {
        return Math.round(this.rect.width);
    }
    get clientHeight(): number {
        return Math.round(this.rect.height);
    }
    getBoundingClientRect(): VirtualElementRect {
        return {
            top: this.rect.top,
            left: this.rect.left,
            right: this.rect.right,
            bottom: this.rect.bottom,
            width: this.rect.left + this.rect.width,
            height: this.rect.top + this.rect.height,
        } as VirtualElementRect;
    }

    getRootNode(): VirtualElement {
        return this;
    }

    setPointerCapture(_: number): void {}
    releasePointerCapture(_: number): void {}
    requestPointerLock(): void {}
    exitPointerLock(): void {}

    dispatchEvent(event: ListenerEvent) {
        switch (event.type) {
            case 'resize': {
                this.rect.left = (event as ResizeEvent).left;
                this.rect.top = (event as ResizeEvent).top;
                this.rect.right = (event as ResizeEvent).right;
                this.rect.bottom = (event as ResizeEvent).bottom;
                this.rect.width = (event as ResizeEvent).width;
                this.rect.height = (event as ResizeEvent).height;
                break;
            }
            default: break;
        }
        (event as Event).preventDefault = () => {};
        (event as Event).stopPropagation = () => {};
        // @ts-ignore
        super.dispatchEvent(event);
    }
}

export class VirtualElementFactory {
    private elements: Map<string, VirtualElement> = new Map();

    getElement(id: string): VirtualElement {
        if(this.elements.has(id)) return <VirtualElement>this.elements.get(id);
        const element = new VirtualElement();
        this.elements.set(id, element);
        return element;
    }

    removeElement(id: string): void {
        this.elements.delete(id);
    }

    clear(): void {
        this.elements.clear();
    }
}