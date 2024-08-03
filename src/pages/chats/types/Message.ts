export interface Message {
    id: string;
    createTimestampGMT: string | null;
    localTimestamp: string;
    groupId: string;
    senderId: string;
    status: string;
    text: string;
    title: string;
}