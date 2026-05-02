import { BellRing } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { createPushSubscriptionPlaceholder, requestNotificationAccess } from '@/services/pwaService';

type EnableNotificationsButtonProps = {
    permission: NotificationPermission | 'unsupported';
};

export function EnableNotificationsButton({ permission }: EnableNotificationsButtonProps) {
    const handleEnable = async () => {
        const result = await requestNotificationAccess();

        if (result === 'granted') {
            await createPushSubscriptionPlaceholder();
            toast.success('Notifications enabled', {
                description: 'You are ready for pickup updates once backend push delivery is connected.',
            });
        } else if (result === 'denied') {
            toast.error('Notifications blocked', {
                description: 'Enable notifications in your browser settings when you are ready.',
            });
        } else if (result === 'unsupported') {
            toast.error('Notifications unavailable', {
                description: 'This browser does not expose the Notifications API.',
            });
        } else {
            toast.message('Notification permission dismissed');
        }
    };

    return (
        <Button onClick={handleEnable} variant={permission === 'granted' ? 'secondary' : 'accent'}>
            <BellRing className="h-4 w-4" />
            {permission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
        </Button>
    );
}
