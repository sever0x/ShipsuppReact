import { Port } from "misc/types/Port";

export enum EPortSubscriptionStatus {
    ACTIVE = 'ACTIVE',
    DISABLED_BY_USER = 'DISABLED_BY_USER',
    DISABLE_BY_GOD = 'DISABLE_BY_GOD'
}

export enum EPortSubscriptionType {
    TRIAL = 'TRIAL',
    COMMERCIAL = 'COMMERCIAL',
    INFINITY = 'INFINITY'
}

export interface PortSubscription {
    id: string;
    createTimestampGMT: string;
    expiredIn: string;
    port: Port;
    portId: string;
    status: EPortSubscriptionStatus;
    isExpired: boolean;
    type: EPortSubscriptionType;
}

export const getStatusStr = (subscription: PortSubscription): string => {
    if (subscription.status === EPortSubscriptionStatus.DISABLED_BY_USER ||
        subscription.status === EPortSubscriptionStatus.DISABLE_BY_GOD) {
        return 'disable';
    }
    if (subscription.type === EPortSubscriptionType.INFINITY) {
        return 'active';
    }
    if (subscription.isExpired) {
        return 'expired';
    }
    if (subscription.type === EPortSubscriptionType.TRIAL &&
        subscription.status === EPortSubscriptionStatus.ACTIVE) {
        return 'trial';
    }
    if (subscription.status === EPortSubscriptionStatus.ACTIVE) {
        return 'active';
    }
    return 'unknown';
};

export const isStatusActive = (subscription: PortSubscription): boolean => {
    if (subscription.status === EPortSubscriptionStatus.DISABLED_BY_USER ||
        subscription.status === EPortSubscriptionStatus.DISABLE_BY_GOD) {
        return false;
    }
    if (subscription.type === EPortSubscriptionType.INFINITY) {
        return true;
    }
    if (subscription.isExpired) {
        return false;
    }
    if (subscription.type === EPortSubscriptionType.TRIAL &&
        subscription.status === EPortSubscriptionStatus.ACTIVE) {
        return true;
    }
    if (subscription.status === EPortSubscriptionStatus.ACTIVE) {
        return true;
    }
    return false;
};