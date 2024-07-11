/**
 * 基于 Web Socket 的事件管理器
 * @class
 * @since 24 June, 2024
 * @author Ryker Zhu
 */
export class EventManager implements Disposable {
    private socket: WebSocket;
    private listeners: Record<string, Function[]> = {};
    private actionsOnReady: Function[] = [];

    constructor(url: string | URL) {
        this.socket = new WebSocket(url);
        this.socket.addEventListener("message", this.eventOccurred.bind(this));
        this.socket.addEventListener("open", _ => {
            this.actionsOnReady.forEach(action => action.call(this));
        });
    }

    protected async eventOccurred(event: MessageEvent): Promise<void> {
        for(const name in this.listeners) {
            this.listeners[name].forEach(func => func.call(null, JSON.parse(event.data)));
        }
    }

    public listenTo(eventName: string, listener: (...args: any[]) => any): void {
        if(!this.listeners[eventName]) this.listeners[eventName] = [];
        this.listeners[eventName].push(listener);
    }

    public stopListenTo(eventName: string): void {
        delete this.listeners[eventName];
    }

    public postEvent(eventName: string, data: any): void {
        const func = () => this.socket.send(JSON.stringify({
            event: eventName,
            data: data
        }));
        switch (this.socket.readyState) {
            case WebSocket.OPEN: {
                func();
                break;
            }
            case WebSocket.CLOSING:
            case WebSocket.CLOSED: {
                throw new Error('Connection is not available');
            }
            case WebSocket.CONNECTING: {
                this.actionsOnReady.push(func);
                break;
            }
        }
    }

    public [Symbol.dispose](): void {
        this.listeners = {};
        this.socket.close(1000);
    }
}