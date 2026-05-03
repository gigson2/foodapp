import axios from 'axios';
import { apiClient } from '@/services/apiClient';
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
    AdminVisitorSession,
} from '@/types/admin';

type ApiCollection<T> = {
    data: T[];
};

type DashboardResponse = {
    metrics: AdminDashboardMetrics;
    recent_orders: AdminOrder[];
};

export const adminService = {
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

        return response.data;
    },
    async logout() {
        await apiClient.post('/logout');
    },
    async getCurrentUser() {
        const response = await apiClient.get('/me');

        return response.data.data;
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
    async getCategories() {
        const response = await apiClient.get<ApiCollection<AdminCategory>>('/admin/categories');

        return response.data.data;
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
    async getSeoSettings() {
        const response = await apiClient.get<ApiCollection<AdminSeoSetting>>('/admin/seo-settings');

        return response.data.data;
    },
    async getNotifications() {
        const response = await apiClient.get<ApiCollection<AdminNotification>>('/admin/notifications');

        return response.data.data;
    },
};
