export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
}

export interface Food {
    id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
    image: string;
    price: number;
    preparationTimeMinutes: number;
    isAvailable: boolean;
    isPopular: boolean;
    tags: string[];
}
