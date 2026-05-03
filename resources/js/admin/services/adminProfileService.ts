import type { AdminUser } from '@/types/admin';
import { adminApiClient, toFormData } from '@/admin/services/adminApiClient';

type ApiUser = {
    data: AdminUser;
};

export type AdminProfileInput = {
    name: string;
    phone: string;
    email?: string;
    avatar?: File | null;
};

export const adminProfileService = {
    async getProfile() {
        const response = await adminApiClient.get<ApiUser>('/admin/profile');

        return response.data.data;
    },
    async updateProfile(input: AdminProfileInput) {
        const payload = toFormData({
            name: input.name,
            phone: input.phone,
            email: input.email ?? '',
            avatar: input.avatar ?? undefined,
        });
        payload.append('_method', 'PUT');

        const response = await adminApiClient.post<ApiUser>('/admin/profile', payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data.data;
    },
    async updatePassword(input: { currentPassword: string; password: string; passwordConfirmation: string }) {
        await adminApiClient.put('/admin/profile/password', {
            current_password: input.currentPassword,
            password: input.password,
            password_confirmation: input.passwordConfirmation,
        });
    },
};
