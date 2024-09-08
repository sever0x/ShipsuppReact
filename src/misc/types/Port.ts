export interface Port {
    id: string;
    title: string;
    city: {
        country: {
            id: string;
            title: string;
        };
        title: string;
    };
}