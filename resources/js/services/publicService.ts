import { apiClient } from '@/services/apiClient';
import type { Category, CompanySettings, Food } from '@/types';

type PublicFoodResponse = {
    id: number;
    category?: {
        id: number | null;
        name: string | null;
        slug: string | null;
    };
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    image: string | null;
    price: number;
    preparation_time_minutes: number;
    dietary_labels: string[];
    is_available: boolean;
    is_featured: boolean;
    is_popular: boolean;
};

type PublicCategoryResponse = {
    id: number;
    name: string;
    slug: string;
    image: string | null;
};

const DEFAULT_FOOD_IMAGE = '/assets/images/image5.jpeg';

function mapFood(food: PublicFoodResponse): Food {
    const tags = [
        ...(food.is_popular ? ['Popular'] : []),
        ...(food.is_featured ? ['Featured'] : []),
        ...food.dietary_labels,
    ];

    return {
        id: String(food.id),
        name: food.name,
        slug: food.slug,
        category: food.category?.name ?? 'Uncategorized',
        description: food.description || food.short_description || 'Pickup-ready grill pack from Dri Africain Traditional Grill LLC.',
        image: food.image || DEFAULT_FOOD_IMAGE,
        price: Number(food.price),
        preparationTimeMinutes: food.preparation_time_minutes,
        isAvailable: food.is_available,
        isPopular: food.is_popular,
        tags: tags.length > 0 ? tags : ['Fresh Grill'],
    };
}

function mapCategory(category: PublicCategoryResponse): Category {
    return {
        id: String(category.id),
        name: category.name,
        slug: category.slug,
        image: category.image ?? undefined,
    };
}

export const publicService = {
    async getFoods(): Promise<Food[]> {
        const response = await apiClient.get<{ data: PublicFoodResponse[] }>('/foods');

        return response.data.data.map(mapFood);
    },

    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get<{ data: PublicCategoryResponse[] }>('/categories');

        return response.data.data.map(mapCategory);
    },

    async getCompanySettings(): Promise<CompanySettings> {
        const response = await apiClient.get<{ data: CompanySettings }>('/company-settings');

        return response.data.data;
    },
};
