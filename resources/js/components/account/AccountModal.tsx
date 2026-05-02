import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { EnableNotificationsButton } from '@/components/notifications/EnableNotificationsButton';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';
import { IOSInstallHint } from '@/components/pwa/IOSInstallHint';
import { RecentOrdersList } from '@/components/account/RecentOrdersList';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Customer, Order } from '@/types';

type AccountModalProps = {
    customer: Customer;
    isOpen: boolean;
    orders: Order[];
    notificationPermission: NotificationPermission | 'unsupported';
    onClose: () => void;
    onLogout: () => void;
};

export function AccountModal({
    customer,
    isOpen,
    notificationPermission,
    onClose,
    onLogout,
    orders,
}: AccountModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');

    const content = (
        <div className="space-y-4">
            <Card className="p-5">
                <p className="text-sm text-muted">Signed in as</p>
                <h3 className="mt-2 text-2xl font-semibold">{customer.name}</h3>
                <p className="mt-1 text-sm text-muted">{customer.phone}</p>
            </Card>

            <div className="flex flex-wrap gap-3">
                <EnableNotificationsButton permission={notificationPermission} />
                <PWAInstallButton />
            </div>

            <IOSInstallHint />

            <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold">Recent orders</h3>
                    <Button onClick={onLogout} size="sm" variant="ghost">
                        Logout
                    </Button>
                </div>
                <RecentOrdersList orders={orders} />
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <BottomSheet description="Your saved pickup profile and recent orders." isOpen={isOpen} onClose={onClose} title="Account">
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal description="Your saved pickup profile and recent orders." isOpen={isOpen} onClose={onClose} title="Account">
            {content}
        </Modal>
    );
}
