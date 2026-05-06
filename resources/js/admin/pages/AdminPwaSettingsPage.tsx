import { useState } from 'react';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { Button } from '@/components/common/Button';
import { apiClient } from '@/services/apiClient';
import { getExistingPushSubscription, requestNotificationAccess, subscribeToPush } from '@/services/pwaService';

export function AdminPwaSettingsPage() {
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() => ('Notification' in window ? Notification.permission : 'unsupported'));

    const requestNotifications = async () => {
        const result = await requestNotificationAccess();
        setPermission(result);

        if (result !== 'granted') {
            if (result === 'denied') {
                toast.error('Browser notifications were denied for this admin device.');
            } else {
                toast.message(`Notification permission is now ${result}.`);
            }
            return;
        }

        const existing = await getExistingPushSubscription();
        const subscription = existing ?? await subscribeToPush();

        if (!subscription) {
            toast.error('Notification permission was granted, but push registration could not be completed.');
            return;
        }

        const subJson = subscription.toJSON();
        await apiClient.post('/push-subscriptions', {
            endpoint: subscription.endpoint,
            public_key: subJson.keys?.p256dh ?? null,
            auth_token: subJson.keys?.auth ?? null,
            content_encoding: 'aes128gcm',
            user_agent: navigator.userAgent,
        });

        toast.success('Admin notifications are enabled on this device.');
    };

    const sendTestNotification = async () => {
        await apiClient.post('/push-notifications/test');
        toast.success('A real push test was sent to this device.');
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                description="Manage notification access for this device."
                title="PWA settings"
            />

            <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
                <AdminSectionCard className="p-5 sm:p-6">
                    <h2 className="text-2xl">Notifications</h2>
                    <p className="mt-3 text-sm leading-7 text-muted">
                        Current browser permission: <span className="font-semibold text-[color:var(--primary-500)]">{permission}</span>
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Button onClick={requestNotifications} size="sm">Enable notifications</Button>
                        <Button onClick={sendTestNotification} size="sm" variant="secondary">Send test notification</Button>
                    </div>
                </AdminSectionCard>

                <AdminSectionCard className="p-5 sm:p-6">
                    <h2 className="text-2xl">About this page</h2>
                    <p className="mt-3 text-sm leading-7 text-muted">
                        Use this page to enable notifications on the current device and send a quick test alert when needed.
                    </p>
                    <p className="mt-4 text-sm leading-7 text-muted">
                        If notifications are blocked in the browser, update the browser settings for this site and try again.
                    </p>
                </AdminSectionCard>
            </div>
        </div>
    );
}
