import { adminApiClient, buildAdminQuery, mapPaginatedResponse, toFormData, type AdminPaginatedResult, type AdminTableParams } from '@/admin/services/adminApiClient';

export type AdminCategoryRecord = {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    sortOrder: number;
    isActive: boolean;
    foodsCount: number;
};

export type AdminCategoryFormInput = {
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
    image?: File | null;
};

type ApiCategory = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    sort_order: number;
    is_active: boolean;
    foods_count?: number;
};

function mapCategory(category: ApiCategory): AdminCategoryRecord {
    return {
        id: String(category.id),
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        sortOrder: category.sort_order,
        isActive: category.is_active,
        foodsCount: category.foods_count ?? 0,
    };
}

function toPayload(input: AdminCategoryFormInput) {
    return toFormData({
        name: input.name,
        slug: input.slug,
        description: input.description ?? '',
        sort_order: input.sortOrder,
        is_active: input.isActive,
        image: input.image ?? undefined,
    });
}

export const adminCategoryService = {
    async getCategories(params: AdminTableParams): Promise<AdminPaginatedResult<AdminCategoryRecord>> {
        const response = await adminApiClient.get('/admin/categories', {
            params: buildAdminQuery({
                page: params.page,
                per_page: params.perPage,
                search: params.search,
                is_active: params.isActive,
            }),
        });

        return mapPaginatedResponse(response.data, mapCategory);
    },
    async createCategory(input: AdminCategoryFormInput) {
        const response = await adminApiClient.post('/admin/categories', toPayload(input), {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return mapCategory(response.data.data as ApiCategory);
    },
    async updateCategory(categoryId: string | number, input: AdminCategoryFormInput) {
        const payload = toPayload(input);
        payload.append('_method', 'PUT');

        const response = await adminApiClient.post(`/admin/categories/${categoryId}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return mapCategory(response.data.data as ApiCategory);
    },
    async deleteCategory(categoryId: string | number) {
        await adminApiClient.delete(`/admin/categories/${categoryId}`);
    },
};
