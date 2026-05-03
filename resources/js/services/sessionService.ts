import { apiClient, ensureCsrfCookie } from '@/services/apiClient';
import { clearAuthToken, setAuthToken } from '@/services/authTokenStorage';
import { getExistingPushSubscription, getNotificationPermission, subscribeToPush } from '@/services/pwaService';
import type { AuthenticatedUser } from '@/types';

type ApiItem<T> = {
    data: T | null;
};

async function wait(durationMs: number) {
    await new Promise((resolve) => window.setTimeout(resolve, durationMs));
}

async function syncCurrentDevicePushSubscription(): Promise<void> {
    if (typeof window === 'undefined' || getNotificationPermission() !== 'granted') {
        return;
    }

    const existing = await getExistingPushSubscription();
    const subscription = existing ?? await subscribeToPush();

    if (!subscription) {
        return;
    }

    const subJson = subscription.toJSON();

    await apiClient.post('/push-subscriptions', {
        endpoint: subscription.endpoint,
        public_key: subJson.keys?.p256dh ?? null,
        auth_token: subJson.keys?.auth ?? null,
        content_encoding: 'aes128gcm',
        user_agent: navigator.userAgent,
    });
}

async function getCurrentUser() {
    const response = await apiClient.get<ApiItem<AuthenticatedUser>>('/me');

    return response.data.data ?? null;
}

export const sessionService = {
    async ensureCsrfCookie() {
        await ensureCsrfCookie();
    },
    async login(credentials: { login: string; password: string }) {
        await ensureCsrfCookie();
        const response = await apiClient.post('/login', credentials);
        const payload = response.data as { message: string; token: string; user: AuthenticatedUser };
        setAuthToken(payload.token);
        const retryDelays = [0, 120, 260, 420];

        try {
            for (const delay of retryDelays) {
                if (delay > 0) {
                    await wait(delay);
                }

                const currentUser = await getCurrentUser();

                if (currentUser) {
                    await syncCurrentDevicePushSubscription().catch(() => undefined);

                    return {
                        ...payload,
                        user: currentUser,
                    };
                }
            }
        } catch (error) {
            clearAuthToken();
            throw error;
        }

        clearAuthToken();

        throw new Error('The session was not established after login.');
    },
    async register(input: { name: string; phone: string; password: string; passwordConfirmation: string }) {
        await ensureCsrfCookie();
        const response = await apiClient.post('/register', {
            name: input.name,
            phone: input.phone,
            password: input.password,
            password_confirmation: input.passwordConfirmation,
        });
        const payload = response.data as { message: string; token: string; user: AuthenticatedUser };
        setAuthToken(payload.token);
        await syncCurrentDevicePushSubscription().catch(() => undefined);

        return payload;
    },
    async logout() {
        await ensureCsrfCookie();
        try {
            await apiClient.post('/logout');
        } finally {
            clearAuthToken();
        }

        const retryDelays = [0, 120, 260, 420];

        for (const delay of retryDelays) {
            if (delay > 0) {
                await wait(delay);
            }

            const currentUser = await getCurrentUser();

            if (!currentUser) {
                return;
            }
        }

        throw new Error('The session was not cleared after logout.');
    },
    getCurrentUser,
};
