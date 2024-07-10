export interface Good {
    id: string;
    article: string;
    title: string;
    price: number;
    brand: string;
    color: string;
    description: string;
    categoryId: string;
    currency: string;
    ownerId: string;
    portId: string;
    createTimestampGMT: string;
    available: boolean;
    images?: { [key: string]: string };
}