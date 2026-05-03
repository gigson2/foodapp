import { BellRing } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { subscribeToPush, requestNotificationAccess } from '@/services/pwaService';

type EnableNotificationsButtonProps = {
    permission: NotificationPermission | 'unsupported';
};

export function EnableNotificationsButton({ permission }: EnableNotificationsButtonProps) {
    const handleEnable = async () => {
        const result = await requestNotificationAccess();

        if (result === 'granted') {
            await subscribeToPush();
            toast.success('Notifications enabled', {
                description: 'You will receive real-time pickup alerts for your orders.',
            });
        } else if (result === 'denied') {
            toast.error('Notifications blocked', {
                description: 'Enable notifications in your browser settings when you want pickup alerts.',
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
