import { User } from "./User";

export interface Chat {
    id: string;
    title: string;
    lastMessage: string;
    membersData: { [userId: string]: User };
    unreadCount: { [userId: string]: number };
}