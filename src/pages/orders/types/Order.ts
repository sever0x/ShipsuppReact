import {ShareableItem} from "../../../misc/types/ShareableItem";

export interface Order extends ShareableItem{
    orderNumber: string;
    status: string;
    createTimestampGMT: string;
    good: {
        article: string;
        title: string;
        images: Record<string, string>;
        available: boolean;
        brand: string;
        categoryId: string;
        color: string;
        createTimestampGMT: string;
        currency: string;
        description: string;
        id: string;
        ownerId: string;
        portId: string;
        price: number;
    };
    quantity: number;
    priceInOrder: number;
    currencyInOrder: string;
    buyer: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        profilePhoto: string;
        role: string;
        vesselIMO: string;
        vesselMMSI: string;
        ports: Record<string, {
            id: string;
            title: string;
            city: {
                id: string;
                title: string;
                country: {
                    id: string;
                    phoneCode: string;
                    title: string;
                };
            };
        }>;
        favorite: Record<string, string>;
    };
    seller: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        profilePhoto: string;
        role: string;
        vesselIMO: string;
        vesselMMSI: string;
    };
    port: {
        id: string;
        title: string;
        city: {
            id: string;
            title: string;
            country: {
                id: string;
                phoneCode: string;
                title: string;
            };
        };
    };
    datesOfStatusChange: Record<string, string>;
    pricePerOne: number;
    goodId: string;
    buyerId: string;
    sellerId: string;
    portId: string;
    cancellationReason?: string;
}
