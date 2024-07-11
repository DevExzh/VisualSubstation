export enum ProxyMessageType {
    NEW,
    FUNCTION_CALL,
    VALUE_RETURNED,
    PROPERTY_SET,
    PROPERTY_GET,
    PROPERTY_DELETE,
    PROPERTY_QUERY,
}

export interface ProxyMessage {
    type: ProxyMessageType;
    uuid: string;
}

export interface ProxyFunctionCallMessage extends ProxyMessage {
    type: ProxyMessageType.FUNCTION_CALL;
    uuid: string;
    target: string | undefined;
    name: string;
    params: any[];
}

export interface ProxyValueReturnedMessage extends ProxyMessage {
    type: ProxyMessageType.VALUE_RETURNED;
    uuid: string;
    error: string | undefined;
    value: any;
}