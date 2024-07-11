import {ProxyFunctionCallMessage, ProxyMessage, ProxyMessageType, ProxyValueReturnedMessage} from "./ProxyMessages.ts";
import {v4} from "uuid";

/**
 * 代理任意类型的对象，接管对其进行的所有操作
 * @author Ryker Zhu
 * @since 4 July 2024
 */
export class VirtualProxy<T> extends EventTarget implements Disposable {
    protected _object: T;
    protected _worker: Worker;

    public constructor(object: T) {
        super();
        this._object = object;
        this._worker = new Worker(new URL('./ProxiedWorker.ts', import.meta.url));
        this._worker.postMessage({
            type: ProxyMessageType.NEW,
            uuid: v4()
        } as ProxyMessage);
    }

    /**
     * 调用任意函数
     * @param name 函数名
     * @param params 函数参数，可以为空
     */
    public async call(
        name: keyof T,
        ...params: any[]
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if(typeof this._object[name] !== 'function') {
                reject(`${String(name)} is not a function`);
            }
            const uuid = v4();
            const eventHandler = (e: MessageEvent<ProxyValueReturnedMessage>) => {
                if(e.data.type !== ProxyMessageType.VALUE_RETURNED) return;
                if(e.data.uuid !== uuid) return;
                if(e.data.error) {
                    reject(e.data.error);
                } else {
                    resolve(e.data.value);
                }
            };
            this._worker.addEventListener('message', eventHandler);
            this._worker.postMessage({
                type: ProxyMessageType.FUNCTION_CALL,
                target: undefined,
                uuid, name, params,
            } as ProxyFunctionCallMessage);
        });
    }

    public [Symbol.dispose](): void {
    }
}