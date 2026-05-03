import { useQuery } from '@tanstack/react-query';
import { adminOrderService } from '@/admin/services/adminOrderService';
import type { AdminTableParams } from '@/admin/services/adminApiClient';

export function useAdminOrders(params: AdminTableParams) {
    return useQuery({
        queryKey: ['admin-app', 'orders', params],
        queryFn: () => adminOrderService.getOrders(params),
        staleTime: 60_000,
        refetchInterval: 30_000,
    });
}
