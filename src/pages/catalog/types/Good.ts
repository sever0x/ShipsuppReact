export interface Good {
    id: string;
    categoryId: string;
    ownerId: string;
    article?: string;
    title: string;
    brand: string;
    price: number;
    currency: string;
    color?: string;
    description: string;
    images?: { [key: string]: string };
}