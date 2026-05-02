import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { RecentOrdersList } from '@/components/account/RecentOrdersList';
import { EnableNotificationsButton } from '@/components/notifications/EnableNotificationsButton';
import { IOSInstallHint } from '@/components/pwa/IOSInstallHint';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Customer, Order, Review } from '@/types';

type AccountModalProps = {
    customer: Customer;
    customerReviews: Review[];
    isOpen: boolean;
    notificationPermission: NotificationPermission | 'unsupported';
    onClose: () => void;
    onLogout: () => void;
    orders: Order[];
};

export function AccountModal({
    customer,
    customerReviews,
    isOpen,
    notificationPermission,
    onClose,
    onLogout,
    orders,
}: AccountModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');

    const content = (
        <div className="space-y-5">
            <Card className="p-5">
                <p className="text-sm text-muted">Pickup identity</p>
                <h3 className="mt-2 text-2xl font-semibold">{customer.name}</h3>
                <p className="mt-1 text-sm text-muted">{customer.phone}</p>
                <p className="mt-4 text-sm leading-7 text-muted">
                    This local profile keeps your recent pickup orders and review submissions available on this device.
                </p>
            </Card>

            <div className="flex flex-wrap gap-3">
                <EnableNotificationsButton permission={notificationPermission} />
                <PWAInstallButton />
                <Button onClick={onLogout} variant="ghost">
                    Logout
                </Button>
            </div>

            <IOSInstallHint />

            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold">Recent orders</h3>
                    <span className="text-sm text-muted">Pickup + cash only</span>
                </div>
                <RecentOrdersList orders={orders} />
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold">Submitted reviews</h3>
                    <span className="text-sm text-muted">{customerReviews.length} total</span>
                </div>
                {customerReviews.length === 0 ? (
                    <Card className="p-5 text-sm leading-7 text-muted">
                        Reviews you submit from this device will appear here with their approval status.
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {customerReviews.slice(0, 3).map((review) => (
                            <ReviewCard key={review.id} review={review} showStatus />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <BottomSheet description="Your pickup profile, orders, and submitted reviews." isOpen={isOpen} onClose={onClose} title="Account">
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal description="Your pickup profile, orders, and submitted reviews." isOpen={isOpen} onClose={onClose} title="Account">
            {content}
        </Modal>
    );
}
