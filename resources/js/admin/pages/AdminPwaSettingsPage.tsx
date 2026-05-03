import { useState } from 'react';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { Button } from '@/components/common/Button';

export function AdminPwaSettingsPage() {
    const [permission, setPermission] = useState<NotificationPermission>(() => ('Notification' in window ? Notification.permission : 'default'));

    const requestNotifications = async () => {
        if (!('Notification' in window)) {
            toast.error('Browser notifications are not available in this browser.');
            return;
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        toast.success(`Notification permission is now ${result}.`);
    };

    const sendTestNotification = async () => {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            toast.error('Grant notification permission before sending a test.');
            return;
        }

        new Notification('Dri Africain Admin', {
            body: 'Test notification from the admin PWA settings page.',
        });
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                description="Manage browser notification readiness and verify the admin install experience without breaking the existing PWA structure."
                title="PWA settings"
            />

            <div className="grid gap-6 xl:grid-cols-2">
                <AdminSectionCard className="p-5 sm:p-6">
                    <h2 className="text-2xl">Notification permission</h2>
                    <p className="mt-3 text-sm leading-7 text-muted">
                        Current browser permission: <span className="font-semibold text-[color:var(--primary-500)]">{permission}</span>
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Button onClick={requestNotifications} size="sm">Enable notifications</Button>
                        <Button onClick={sendTestNotification} size="sm" variant="secondary">Send test notification</Button>
                    </div>
                </AdminSectionCard>

                <AdminSectionCard className="p-5 sm:p-6">
                    <h2 className="text-2xl">Install readiness</h2>
                    <p className="mt-3 text-sm leading-7 text-muted">
                        The storefront keeps the manifest, service worker, and offline fallback in place. This page is for admin-side verification of installability and alert readiness.
                    </p>
                    <ul className="mt-5 space-y-3 text-sm text-muted">
                        <li>Manifest is available at <code>/manifest.webmanifest</code>.</li>
                        <li>Offline fallback is available at <code>/offline.html</code>.</li>
                        <li>Admin notifications rely on browser permission plus backend push delivery when configured.</li>
                    </ul>
                </AdminSectionCard>
            </div>
        </div>
    );
}
