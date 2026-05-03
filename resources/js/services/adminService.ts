import { apiClient } from '@/services/apiClient';
import { sessionService } from '@/services/sessionService';
import type {
    AdminCategory,
    AdminCompanySetting,
    AdminCustomer,
    AdminDashboardMetrics,
    AdminFood,
    AdminNotification,
    AdminOrder,
    AdminOrderStatus,
    AdminSeoSetting,
    AdminUser,
    AdminVisitorSession,
} from '@/types/admin';

type ApiCollection<T> = {
    data: T[];
};

type DashboardResponse = {
    metrics: AdminDashboardMetrics;
    recent_orders: AdminOrder[];
};

type ApiItem<T> = {
    data: T | null;
};

export const adminService = {
    async login(credentials: { login: string; password: string }) {
        return sessionService.login(credentials);
    },
    async logout() {
        await sessionService.logout();
    },
    async getCurrentUser() {
        return (await sessionService.getCurrentUser()) as AdminUser | null;
    },
    async getDashboard() {
        const response = await apiClient.get<DashboardResponse>('/admin/dashboard');

        return {
            metrics: response.data.metrics,
            recentOrders: response.data.recent_orders,
        };
    },
    async getOrders() {
        const response = await apiClient.get<ApiCollection<AdminOrder>>('/admin/orders');

        return response.data.data;
    },
    async getOrder(orderId: number) {
        const response = await apiClient.get<ApiItem<AdminOrder>>(`/admin/orders/${orderId}`);

        return response.data.data;
    },
    async updateOrderStatus(orderId: number, status: AdminOrderStatus) {
        const response = await apiClient.patch<{ data: AdminOrder }>(`/admin/orders/${orderId}/status`, {
            status,
        });

        return response.data.data;
    },
    async getFoods() {
        const response = await apiClient.get<ApiCollection<AdminFood>>('/admin/foods');

        return response.data.data;
    },
    async getFood(foodId: number) {
        const response = await apiClient.get<ApiItem<AdminFood>>(`/admin/foods/${foodId}`);

        return response.data.data;
    },
    async createFood(payload: Omit<AdminFood, 'id' | 'category'> & { category_id: number }) {
        const response = await apiClient.post<ApiItem<AdminFood>>('/admin/foods', payload);

        return response.data.data;
    },
    async updateFood(foodId: number, payload: Omit<AdminFood, 'id' | 'category'> & { category_id: number }) {
        const response = await apiClient.put<ApiItem<AdminFood>>(`/admin/foods/${foodId}`, payload);

        return response.data.data;
    },
    async deleteFood(foodId: number) {
        const response = await apiClient.delete<{ message: string }>(`/admin/foods/${foodId}`);

        return response.data.message;
    },
    async getCategories() {
        const response = await apiClient.get<ApiCollection<AdminCategory>>('/admin/categories');

        return response.data.data;
    },
    async getCategory(categoryId: number) {
        const response = await apiClient.get<ApiItem<AdminCategory>>(`/admin/categories/${categoryId}`);

        return response.data.data;
    },
    async createCategory(payload: Omit<AdminCategory, 'id' | 'foods_count'>) {
        const response = await apiClient.post<ApiItem<AdminCategory>>('/admin/categories', payload);

        return response.data.data;
    },
    async updateCategory(categoryId: number, payload: Omit<AdminCategory, 'id' | 'foods_count'>) {
        const response = await apiClient.put<ApiItem<AdminCategory>>(`/admin/categories/${categoryId}`, payload);

        return response.data.data;
    },
    async deleteCategory(categoryId: number) {
        const response = await apiClient.delete<{ message: string }>(`/admin/categories/${categoryId}`);

        return response.data.message;
    },
    async getCustomers() {
        const response = await apiClient.get<ApiCollection<AdminCustomer>>('/admin/customers');

        return response.data.data;
    },
    async getVisitors() {
        const response = await apiClient.get<ApiCollection<AdminVisitorSession>>('/admin/visitors');

        return response.data.data;
    },
    async getCompanySettings() {
        const response = await apiClient.get<{ data: AdminCompanySetting }>('/admin/company-settings');

        return response.data.data;
    },
    async updateCompanySettings(payload: AdminCompanySetting) {
        const response = await apiClient.put<ApiItem<AdminCompanySetting>>('/admin/company-settings', payload);

        return response.data.data;
    },
    async getSeoSettings() {
        const response = await apiClient.get<ApiCollection<AdminSeoSetting>>('/admin/seo-settings');

        return response.data.data;
    },
    async getSeoSetting(seoSettingId: number) {
        const response = await apiClient.get<ApiItem<AdminSeoSetting>>(`/admin/seo-settings/${seoSettingId}`);

        return response.data.data;
    },
    async createSeoSetting(payload: Omit<AdminSeoSetting, 'id'>) {
        const response = await apiClient.post<ApiItem<AdminSeoSetting>>('/admin/seo-settings', payload);

        return response.data.data;
    },
    async updateSeoSetting(seoSettingId: number, payload: Omit<AdminSeoSetting, 'id'>) {
        const response = await apiClient.put<ApiItem<AdminSeoSetting>>(`/admin/seo-settings/${seoSettingId}`, payload);

        return response.data.data;
    },
    async deleteSeoSetting(seoSettingId: number) {
        const response = await apiClient.delete<{ message: string }>(`/admin/seo-settings/${seoSettingId}`);

        return response.data.message;
    },
    async getNotifications() {
        const response = await apiClient.get<ApiCollection<AdminNotification>>('/admin/notifications');

        return response.data.data;
    },
    async markNotificationRead(notificationId: string) {
        const response = await apiClient.patch<ApiItem<AdminNotification>>(`/admin/notifications/${notificationId}/read`);

        return response.data.data;
    },
    async markAllNotificationsRead() {
        const response = await apiClient.patch<{ message: string }>('/admin/notifications/read-all');

        return response.data.message;
    },
};
