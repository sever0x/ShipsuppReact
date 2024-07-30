export interface Order {
    id: string;
    orderNumber: string;
    status: string;
    createTimestampGMT: string;
    good: {
        article: string;
        title: string;
    };
    quantity: number;
    priceInOrder: number;
    currencyInOrder: string;
    buyer: {
        firstName: string;
        lastName: string;
    };
    port: {
        title: string;
    };
    datesOfStatusChange: Record<string, string>;
}