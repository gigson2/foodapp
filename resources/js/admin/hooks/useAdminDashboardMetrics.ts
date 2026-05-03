import { useQuery } from '@tanstack/react-query';
import { adminDashboardService } from '@/admin/services/adminDashboardService';

export function useAdminDashboardMetrics() {
    return useQuery({
        queryKey: ['admin-app', 'dashboard'],
        queryFn: adminDashboardService.getDashboardSnapshot,
        staleTime: 30_000,
        refetchInterval: 30_000,
    });
}
