import { apiClient } from '@/services/apiClient';
import type { Category, CompanySettings, Food, Review } from '@/types';

export const PUBLIC_FOODS_QUERY_KEY = ['public-foods'] as const;
export const PUBLIC_CATEGORIES_QUERY_KEY = ['public-categories'] as const;
export const PUBLIC_COMPANY_SETTINGS_QUERY_KEY = ['public-company-settings'] as const;
export const PUBLIC_REVIEWS_QUERY_KEY = ['public-reviews'] as const;

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
    updated_at?: string | null;
};

type PublicCategoryResponse = {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    updated_at?: string | null;
};

type PublicCompanySettingsResponse = CompanySettings & {
    updated_at?: string | null;
};

type PublicReviewResponse = {
    id: number;
    customer_name: string;
    customer_phone: string;
    rating: number;
    message: string;
    food_name?: string | null;
    status: Review['status'];
    created_at: string;
};

const DEFAULT_FOOD_IMAGE = '/assets/images/image5.jpeg';

function appendAssetVersion(path: string | null | undefined, version: string | null | undefined): string | null {
    if (!path) {
        return null;
    }

    if (!version) {
        return path;
    }

    const separator = path.includes('?') ? '&' : '?';

    return `${path}${separator}v=${encodeURIComponent(version)}`;
}

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
        description: food.description || food.short_description || 'Pickup-ready grill pack prepared for cash-at-pickup service.',
        image: appendAssetVersion(food.image, food.updated_at) || DEFAULT_FOOD_IMAGE,
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
        image: appendAssetVersion(category.image, category.updated_at) ?? undefined,
    };
}

function mapReview(review: PublicReviewResponse): Review {
    return {
        id: String(review.id),
        customerName: review.customer_name,
        customerPhone: review.customer_phone,
        rating: review.rating,
        message: review.message,
        foodName: review.food_name ?? undefined,
        status: review.status,
        createdAt: review.created_at,
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
        const response = await apiClient.get<{ data: PublicCompanySettingsResponse }>('/company-settings');

        return {
            ...response.data.data,
            logo: appendAssetVersion(response.data.data.logo, response.data.data.updated_at),
            favicon: appendAssetVersion(response.data.data.favicon, response.data.data.updated_at),
        };
    },
    async getApprovedReviews(): Promise<Review[]> {
        const response = await apiClient.get<{ data: PublicReviewResponse[] }>('/reviews');

        return response.data.data.map(mapReview);
    },
};
