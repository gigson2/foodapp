import { useQuery } from '@tanstack/react-query';
import { adminDashboardService } from '@/admin/services/adminDashboardService';

export function useAdminDashboardMetrics(params?: { dateFrom?: string; dateTo?: string }) {
    return useQuery({
        queryKey: ['admin-app', 'dashboard', params],
        queryFn: () => adminDashboardService.getDashboardSnapshot(params),
        staleTime: 30_000,
        refetchInterval: 30_000,
    });
}
