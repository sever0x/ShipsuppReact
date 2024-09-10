import {Chat} from "../Chat";
import {Message} from "../Message";

export interface ChatState {
    chats: Chat[];
    messages: { [groupId: string]: Message[] };
    loading: boolean;
    error: string | null;
    selectedChatId: string | null;
}