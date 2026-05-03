import { Outlet, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { AdminUser } from '@/types/admin';
import { AUTH_SESSION_QUERY_KEY } from '@/hooks/useAuthSession';
import { adminService } from '@/services/adminService';
import { AdminContentShell } from '@/admin/layout/AdminContentShell';
import { AdminHeader } from '@/admin/layout/AdminHeader';
import { AdminMobileBottomNav } from '@/admin/layout/AdminMobileBottomNav';
import { AdminMobileDrawer } from '@/admin/layout/AdminMobileDrawer';
import { AdminSidebar } from '@/admin/layout/AdminSidebar';
import { useAdminNotifications } from '@/admin/hooks/useAdminNotifications';

type AdminLayoutProps = {
    currentUser: AdminUser;
};

export function AdminLayout({ currentUser }: AdminLayoutProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { notifications, unreadCount, markRead, markAllRead } = useAdminNotifications();
    const logoutMutation = useMutation({
        mutationFn: adminService.logout,
        onSuccess: async () => {
            queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
            await queryClient.clear();
            navigate('/admin/login', { replace: true });
        },
    });

    return (
        <div className="app-surface min-h-screen">
            <AdminHeader
                currentUserName={currentUser.name}
                notifications={notifications}
                onMarkAllRead={markAllRead}
                onMarkRead={markRead}
                onOpenDrawer={() => setDrawerOpen(true)}
                unreadCount={unreadCount}
            />

            <div className="mx-auto flex max-w-[1700px] gap-6 px-0 md:px-6 lg:px-8">
                <AdminSidebar onLogout={() => logoutMutation.mutate()} />
                <AdminContentShell>
                    <Outlet />
                </AdminContentShell>
            </div>

            <AdminMobileBottomNav onOpenMore={() => setDrawerOpen(true)} />
            <AdminMobileDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onLogout={() => logoutMutation.mutate()}
            />
        </div>
    );
}
