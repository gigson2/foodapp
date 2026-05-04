import axios, { type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { clearAuthToken, getAuthToken } from '@/services/authTokenStorage';

type ApiErrorPayload = {
    message?: string;
    errors?: Record<string, string[] | string | null | undefined>;
};

function flattenValidationErrors(errors: ApiErrorPayload['errors']): string[] {
    if (!errors) {
        return [];
    }

    return Object.values(errors)
        .flatMap((value) => {
            if (Array.isArray(value)) {
                return value;
            }

            return value ? [value] : [];
        })
        .map((message) => message.trim())
        .filter(Boolean);
}

export function normalizeApiError(error: unknown): {
    title: string;
    description?: string;
    variant: 'error' | 'info' | 'warning';
} {
    if (!axios.isAxiosError<ApiErrorPayload>(error)) {
        return {
            title: 'Something went wrong.',
            description: error instanceof Error ? error.message : undefined,
            variant: 'error',
        };
    }

    if (!error.response) {
        return {
            title: 'Unable to reach the server.',
            description: 'Check your connection and try again.',
            variant: 'warning',
        };
    }

    const { data, status } = error.response;
    const validationMessages = flattenValidationErrors(data?.errors);
    const description = validationMessages.length > 0 ? validationMessages.join(' ') : undefined;

    if (status === 401) {
        return {
            title: data?.message ?? 'Authentication required.',
            description: description ?? 'Your session may have expired. Sign in and try again.',
            variant: 'warning',
        };
    }

    if (status === 403) {
        return {
            title: data?.message ?? 'You do not have permission to perform this action.',
            description,
            variant: 'warning',
        };
    }

    if (status === 404) {
        return {
            title: data?.message ?? 'The requested resource was not found.',
            description,
            variant: 'info',
        };
    }

    if (status === 409 || status === 429) {
        return {
            title: data?.message ?? 'This action cannot be completed right now.',
            description,
            variant: 'warning',
        };
    }

    if (status === 422) {
        return {
            title: data?.message ?? 'Please review the information and try again.',
            description,
            variant: 'error',
        };
    }

    return {
        title: data?.message ?? 'Request failed.',
        description,
        variant: status >= 500 ? 'error' : 'warning',
    };
}

export function notifyApiError(error: unknown): void {
    const { title, description, variant } = normalizeApiError(error);

    toast[variant](title, {
        description,
    });
}

function readCookie(name: string): string | null {
    if (typeof document === 'undefined') {
        return null;
    }

    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));

    return match ? decodeURIComponent(match[1]) : null;
}

let csrfCookiePromise: Promise<void> | null = null;

export async function ensureCsrfCookie(force = false): Promise<void> {
    if (!force && readCookie('XSRF-TOKEN')) {
        return;
    }

    if (!csrfCookiePromise || force) {
        csrfCookiePromise = axios
            .get('/sanctum/csrf-cookie', {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                withCredentials: true,
            })
            .then(() => undefined)
            .finally(() => {
                csrfCookiePromise = null;
            });
    }

    await csrfCookiePromise;
}

function isWriteMethod(method?: string): boolean {
    if (!method) {
        return false;
    }

    return ['post', 'put', 'patch', 'delete'].includes(method.toLowerCase());
}

type RetriableConfig = InternalAxiosRequestConfig & {
    _retriedWithFreshCsrf?: boolean;
};

export const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
    if (isWriteMethod(config.method)) {
        await ensureCsrfCookie();
    }

    const token = getAuthToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers.Authorization) {
        delete config.headers.Authorization;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const originalConfig = error.config as RetriableConfig | undefined;

        if (status === 419 && originalConfig && !originalConfig._retriedWithFreshCsrf) {
            originalConfig._retriedWithFreshCsrf = true;
            await ensureCsrfCookie(true);

            return apiClient(originalConfig);
        }

        if (status === 401 && getAuthToken() !== null) {
            clearAuthToken();
            window.dispatchEvent(new CustomEvent('restaurant:unauthorized'));
        }

        notifyApiError(error);

        return Promise.reject(error);
    },
);
