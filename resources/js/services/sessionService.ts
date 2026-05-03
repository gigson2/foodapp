import axios from 'axios';
import { apiClient } from '@/services/apiClient';
import { clearAuthToken, setAuthToken } from '@/services/authTokenStorage';
import type { AuthenticatedUser } from '@/types';

type ApiItem<T> = {
    data: T | null;
};

async function wait(durationMs: number) {
    await new Promise((resolve) => window.setTimeout(resolve, durationMs));
}

export const sessionService = {
    async ensureCsrfCookie() {
        await axios.get('/sanctum/csrf-cookie', {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
        });
    },
    async login(credentials: { login: string; password: string }) {
        await this.ensureCsrfCookie();
        const response = await apiClient.post('/login', credentials);
        const payload = response.data as { message: string; token: string; user: AuthenticatedUser };
        setAuthToken(payload.token);
        const retryDelays = [0, 120, 260, 420];

        try {
            for (const delay of retryDelays) {
                if (delay > 0) {
                    await wait(delay);
                }

                const currentUser = await this.getCurrentUser();

                if (currentUser) {
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
    async logout() {
        await this.ensureCsrfCookie();
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

            const currentUser = await this.getCurrentUser();

            if (!currentUser) {
                return;
            }
        }

        throw new Error('The session was not cleared after logout.');
    },
    async getCurrentUser() {
        const response = await apiClient.get<ApiItem<AuthenticatedUser>>('/me');

        return response.data.data ?? null;
    },
};
