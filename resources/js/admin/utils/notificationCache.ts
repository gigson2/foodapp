import type { QueryClient } from '@tanstack/react-query';
import type { AdminPaginatedResult } from '@/admin/services/adminApiClient';
import type { AdminDashboardSnapshot } from '@/admin/types/adminDashboard';
import type { AdminNotificationItem } from '@/admin/types/adminNotification';
import type { CustomerDashboardSummary, CustomerPaginatedResult, CustomerPortalNotification } from '@/customer/types/customerPortal';

function isAdminNotificationsQueryKey(queryKey: readonly unknown[]): boolean {
    return queryKey[0] === 'admin-app' && queryKey[1] === 'notifications';
}

function isAdminUnreadNotificationsQueryKey(queryKey: readonly unknown[]): boolean {
    if (!isAdminNotificationsQueryKey(queryKey)) {
        return false;
    }

    const scope = queryKey[2];

    if (scope === 'unread-count') {
        return true;
    }

    if (scope && typeof scope === 'object' && 'unreadOnly' in scope) {
        return scope.unreadOnly === true || scope.unreadOnly === 'true';
    }

    return false;
}

function decrementUnreadMetric(count: number, amount = 1): number {
    return Math.max(0, count - amount);
}

export function markAdminNotificationReadInCache(queryClient: QueryClient, notificationId: string): void {
    let unreadDelta = 0;

    queryClient
        .getQueriesData<AdminPaginatedResult<AdminNotificationItem>>({ queryKey: ['admin-app', 'notifications'] })
        .forEach(([queryKey, data]) => {
            if (!data || !Array.isArray(queryKey)) {
                return;
            }

            const target = data.items.find((notification) => notification.id === notificationId);

            if (!target || target.read) {
                return;
            }

            unreadDelta += 1;

            if (isAdminUnreadNotificationsQueryKey(queryKey)) {
                queryClient.setQueryData<AdminPaginatedResult<AdminNotificationItem>>(queryKey, {
                    ...data,
                    items: data.items.filter((notification) => notification.id !== notificationId),
                    meta: {
                        ...data.meta,
                        total: decrementUnreadMetric(data.meta.total),
                    },
                });

                return;
            }

            queryClient.setQueryData<AdminPaginatedResult<AdminNotificationItem>>(queryKey, {
                ...data,
                items: data.items.map((notification) => (
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )),
            });
        });

    if (unreadDelta > 0) {
        queryClient.setQueryData<AdminDashboardSnapshot>(['admin-app', 'dashboard'], (current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                metrics: {
                    ...current.metrics,
                    unreadNotifications: decrementUnreadMetric(current.metrics.unreadNotifications, unreadDelta),
                },
            };
        });
    }
}

export function markAllAdminNotificationsReadInCache(queryClient: QueryClient): void {
    let unreadTotal = 0;

    queryClient
        .getQueriesData<AdminPaginatedResult<AdminNotificationItem>>({ queryKey: ['admin-app', 'notifications'] })
        .forEach(([queryKey, data]) => {
            if (!data || !Array.isArray(queryKey)) {
                return;
            }

            const unreadOnQuery = data.items.filter((notification) => !notification.read).length;

            unreadTotal = Math.max(unreadTotal, isAdminUnreadNotificationsQueryKey(queryKey) ? data.meta.total : unreadOnQuery);

            if (isAdminUnreadNotificationsQueryKey(queryKey)) {
                queryClient.setQueryData<AdminPaginatedResult<AdminNotificationItem>>(queryKey, {
                    ...data,
                    items: [],
                    meta: {
                        ...data.meta,
                        total: 0,
                    },
                });

                return;
            }

            queryClient.setQueryData<AdminPaginatedResult<AdminNotificationItem>>(queryKey, {
                ...data,
                items: data.items.map((notification) => ({ ...notification, read: true })),
            });
        });

    queryClient.setQueryData<AdminDashboardSnapshot>(['admin-app', 'dashboard'], (current) => {
        if (!current) {
            return current;
        }

        return {
            ...current,
            metrics: {
                ...current.metrics,
                unreadNotifications: 0,
            },
        };
    });

    if (unreadTotal === 0) {
        return;
    }
}

export function markCustomerNotificationReadInCache(queryClient: QueryClient, notificationId: string): void {
    let unreadDelta = 0;

    queryClient.setQueryData<CustomerPortalNotification[]>(['customer-portal', 'notifications'], (current) => {
        if (!current) {
            return current;
        }

        return current.map((notification) => {
            if (notification.id === notificationId && !notification.read) {
                unreadDelta += 1;

                return { ...notification, read: true };
            }

            return notification;
        });
    });

    queryClient
        .getQueriesData<CustomerPaginatedResult<CustomerPortalNotification>>({ queryKey: ['customer-portal', 'notifications-page'] })
        .forEach(([queryKey, data]) => {
            if (!data || !Array.isArray(queryKey)) {
                return;
            }

            queryClient.setQueryData<CustomerPaginatedResult<CustomerPortalNotification>>(queryKey, {
                ...data,
                items: data.items.map((notification) => (
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )),
            });
        });

    if (unreadDelta > 0) {
        queryClient.setQueryData<CustomerDashboardSummary>(['customer-portal', 'dashboard'], (current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                metrics: {
                    ...current.metrics,
                    unreadNotifications: decrementUnreadMetric(current.metrics.unreadNotifications, unreadDelta),
                },
            };
        });
    }
}

export function markAllCustomerNotificationsReadInCache(queryClient: QueryClient): void {
    queryClient.setQueryData<CustomerPortalNotification[]>(['customer-portal', 'notifications'], (current) => {
        if (!current) {
            return current;
        }

        return current.map((notification) => ({ ...notification, read: true }));
    });

    queryClient
        .getQueriesData<CustomerPaginatedResult<CustomerPortalNotification>>({ queryKey: ['customer-portal', 'notifications-page'] })
        .forEach(([queryKey, data]) => {
            if (!data || !Array.isArray(queryKey)) {
                return;
            }

            queryClient.setQueryData<CustomerPaginatedResult<CustomerPortalNotification>>(queryKey, {
                ...data,
                items: data.items.map((notification) => ({ ...notification, read: true })),
            });
        });

    queryClient.setQueryData<CustomerDashboardSummary>(['customer-portal', 'dashboard'], (current) => {
        if (!current) {
            return current;
        }

        return {
            ...current,
            metrics: {
                ...current.metrics,
                unreadNotifications: 0,
            },
        };
    });
}
