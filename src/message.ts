export interface Message {
    kind: DataType;
    content: string;
    user_id?: string;
}

export enum DataType {
    Connect = 'Connect',
    Message = 'Message',
    Disconnect = 'Disconnect'
}