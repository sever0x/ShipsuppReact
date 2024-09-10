import {User} from "./User";

export interface Chat {
    id: string;
    title: string;
    lastMessage?: {
        text: string;
        date: string;
    };
    membersData: { [userId: string]: User };
    unreadCount: { [userId: string]: number };
}