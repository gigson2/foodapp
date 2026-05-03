import { apiClient } from '@/services/apiClient';

export { apiClient as adminApiClient };

export type AdminPaginationMeta = {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number | null;
    to: number | null;
};

export type AdminPaginatedResult<T> = {
    items: T[];
    meta: AdminPaginationMeta;
};

type ApiPaginatedResponse<T> = {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
};

export type AdminTableParams = {
    page?: number;
    perPage?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    categoryId?: number;
    isAvailable?: boolean | '';
    isActive?: boolean | '';
    unreadOnly?: boolean;
    dateFrom?: string;
    dateTo?: string;
};

export function buildAdminQuery(params: Record<string, unknown>) {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
    );
}

export function mapPaginatedResponse<TSource, TResult>(
    payload: ApiPaginatedResponse<TSource>,
    mapItem: (item: TSource) => TResult,
): AdminPaginatedResult<TResult> {
    return {
        items: payload.data.map(mapItem),
        meta: {
            currentPage: payload.meta.current_page,
            lastPage: payload.meta.last_page,
            perPage: payload.meta.per_page,
            total: payload.meta.total,
            from: payload.meta.from,
            to: payload.meta.to,
        },
    };
}

type FormValue =
    | string
    | number
    | boolean
    | File
    | null
    | undefined
    | Array<string>
    | Record<string, unknown>;

export function toFormData(payload: Record<string, FormValue>) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }

        if (value instanceof File) {
            formData.append(key, value);
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item) => {
                formData.append(`${key}[]`, item);
            });
            return;
        }

        if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
            return;
        }

        if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0');
            return;
        }

        formData.append(key, String(value));
    });

    return formData;
}
