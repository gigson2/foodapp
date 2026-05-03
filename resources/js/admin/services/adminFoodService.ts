import type { AdminFoodSummary } from '@/admin/types/adminFood';
import { adminApiClient, buildAdminQuery, mapPaginatedResponse, toFormData, type AdminPaginatedResult, type AdminTableParams } from '@/admin/services/adminApiClient';

type ApiFood = {
    id: number;
    category_id: number;
    category?: { id: number; name: string; slug: string };
    name: string;
    slug: string;
    description: string;
    short_description?: string | null;
    image?: string | null;
    price: number;
    preparation_time_minutes: number;
    ingredients: string[];
    allergens: string[];
    dietary_labels: string[];
    is_available: boolean;
    is_featured: boolean;
    is_popular: boolean;
    sort_order: number;
    seo_title?: string | null;
    seo_description?: string | null;
    deleted_at?: string | null;
};

export type AdminFoodFormInput = {
    categoryId: number;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: number;
    preparationTimeMinutes: number;
    ingredients: string[];
    allergens: string[];
    dietaryLabels: string[];
    isAvailable: boolean;
    isFeatured: boolean;
    isPopular: boolean;
    sortOrder: number;
    seoTitle?: string;
    seoDescription?: string;
    image?: File | null;
};

export type AdminFoodRecord = AdminFoodSummary & {
    categoryId: number;
    slug: string;
    description: string;
    shortDescription?: string | null;
    image?: string | null;
    preparationTimeMinutes: number;
    ingredients: string[];
    allergens: string[];
    dietaryLabels: string[];
    sortOrder: number;
    seoTitle?: string | null;
    seoDescription?: string | null;
    deletedAt?: string | null;
};

function mapFood(food: ApiFood): AdminFoodRecord {
    return {
        id: String(food.id),
        name: food.name,
        price: food.price,
        category: food.category?.name ?? 'Unassigned',
        isAvailable: food.is_available,
        isPopular: food.is_popular,
        isFeatured: food.is_featured,
        categoryId: food.category_id,
        slug: food.slug,
        description: food.description,
        shortDescription: food.short_description,
        image: food.image,
        preparationTimeMinutes: food.preparation_time_minutes,
        ingredients: food.ingredients,
        allergens: food.allergens,
        dietaryLabels: food.dietary_labels,
        sortOrder: food.sort_order,
        seoTitle: food.seo_title,
        seoDescription: food.seo_description,
        deletedAt: food.deleted_at,
    };
}

function toPayload(input: AdminFoodFormInput) {
    return toFormData({
        category_id: input.categoryId,
        name: input.name,
        slug: input.slug,
        description: input.description,
        short_description: input.shortDescription ?? '',
        price: input.price,
        preparation_time_minutes: input.preparationTimeMinutes,
        ingredients: input.ingredients,
        allergens: input.allergens,
        dietary_labels: input.dietaryLabels,
        is_available: input.isAvailable,
        is_featured: input.isFeatured,
        is_popular: input.isPopular,
        sort_order: input.sortOrder,
        seo_title: input.seoTitle ?? '',
        seo_description: input.seoDescription ?? '',
        image: input.image ?? undefined,
    });
}

export const adminFoodService = {
    async getFoods(params: AdminTableParams): Promise<AdminPaginatedResult<AdminFoodRecord>> {
        const response = await adminApiClient.get('/admin/foods', {
            params: buildAdminQuery({
                page: params.page,
                per_page: params.perPage,
                search: params.search,
                category_id: params.categoryId,
                is_available: params.isAvailable,
            }),
        });

        return mapPaginatedResponse(response.data, mapFood);
    },
    async createFood(input: AdminFoodFormInput) {
        const response = await adminApiClient.post('/admin/foods', toPayload(input), {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return mapFood(response.data.data as ApiFood);
    },
    async updateFood(foodId: string | number, input: AdminFoodFormInput) {
        const payload = toPayload(input);
        payload.append('_method', 'PUT');

        const response = await adminApiClient.post(`/admin/foods/${foodId}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return mapFood(response.data.data as ApiFood);
    },
    async archiveFood(foodId: string | number) {
        await adminApiClient.delete(`/admin/foods/${foodId}`);
    },
};
