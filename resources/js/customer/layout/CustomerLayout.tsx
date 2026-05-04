import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { AuthenticatedUser } from '@/types';
import { AUTH_SESSION_QUERY_KEY } from '@/hooks/useAuthSession';
import { publicService, PUBLIC_COMPANY_SETTINGS_QUERY_KEY } from '@/services/publicService';
import { authService } from '@/services/authService';
import { sessionService } from '@/services/sessionService';
import { markAllCustomerNotificationsReadInCache, markCustomerNotificationReadInCache } from '@/admin/utils/notificationCache';
import { customerPortalService } from '@/customer/services/customerPortalService';
import { CustomerContentShell } from '@/customer/layout/CustomerContentShell';
import { CustomerHeader } from '@/customer/layout/CustomerHeader';
import { CustomerMobileBottomNav } from '@/customer/layout/CustomerMobileBottomNav';
import { CustomerMobileDrawer } from '@/customer/layout/CustomerMobileDrawer';
import { CustomerSidebar } from '@/customer/layout/CustomerSidebar';
import { getCompanyName } from '@/utils/company';

type CustomerLayoutProps = {
    currentUser: AuthenticatedUser;
};

export function CustomerLayout({ currentUser }: CustomerLayoutProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { data: companySettings = null } = useQuery({
        queryKey: PUBLIC_COMPANY_SETTINGS_QUERY_KEY,
        queryFn: publicService.getCompanySettings,
    });
    const notificationsQuery = useQuery({
        queryKey: ['customer-portal', 'notifications'],
        queryFn: customerPortalService.getNotifications,
        refetchInterval: 15_000,
        refetchOnWindowFocus: true,
    });
    const markReadMutation = useMutation({
        mutationFn: customerPortalService.markNotificationRead,
        onMutate: (notificationId) => {
            markCustomerNotificationReadInCache(queryClient, notificationId);
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ['customer-portal', 'notifications'] });
        },
    });
    const markAllMutation = useMutation({
        mutationFn: customerPortalService.markAllNotificationsRead,
        onSuccess: () => {
            toast.success('Notifications marked as read');
            markAllCustomerNotificationsReadInCache(queryClient);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: sessionService.logout,
        onSuccess: async () => {
            authService.logout();
            toast.success('Logged out successfully');
            queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
            await queryClient.clear();
            navigate('/', { replace: true });
        },
    });

    const brandName = useMemo(() => getCompanyName(companySettings), [companySettings]);
    const notifications = (notificationsQuery.data ?? []).filter(Boolean);
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    return (
        <div className="app-surface min-h-screen">
            <CustomerHeader
                brandName={brandName}
                currentUserName={currentUser.name}
                notifications={notifications}
                onMarkAllRead={() => markAllMutation.mutate()}
                onMarkRead={(notificationId) => markReadMutation.mutate(notificationId)}
                onOpenDrawer={() => setDrawerOpen(true)}
                onVisitStore={() => navigate('/')}
                unreadCount={unreadCount}
            />

            <div className="mx-auto flex max-w-[1700px] gap-6 px-0 md:px-6 lg:px-8">
                <CustomerSidebar
                    brandLogoUrl={companySettings?.logo ?? null}
                    brandName={brandName}
                    onLogout={() => logoutMutation.mutate()}
                />
                <CustomerContentShell>
                    <Outlet />
                </CustomerContentShell>
            </div>

            <CustomerMobileBottomNav />
            <CustomerMobileDrawer
                brandName={brandName}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onLogout={() => logoutMutation.mutate()}
            />
        </div>
    );
}
