import { Clock3, Download, HandCoins, MapPin } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { IOSInstallHint } from '@/components/pwa/IOSInstallHint';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';
import { EnableNotificationsButton } from '@/components/notifications/EnableNotificationsButton';

type HeroSectionProps = {
    notificationPermission: NotificationPermission | 'unsupported';
    onBrowseMenu: () => void;
    onOpenAccount: () => void;
};

export function HeroSection({
    notificationPermission,
    onBrowseMenu,
    onOpenAccount,
}: HeroSectionProps) {
    return (
        <section className="section-shell scroll-mt-28 pt-6 lg:pt-10" id="home">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="glass-card overflow-hidden p-6 sm:p-8 lg:p-10">
                    <p className="section-eyebrow">Pickup ordering PWA</p>
                    <h1 className="mt-6 text-5xl font-semibold leading-none sm:text-6xl xl:text-7xl">
                        Premium food ordering, without payment friction.
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                        Browse the menu, choose quantity, send your pickup order, and pay cash when you arrive at the
                        restaurant. The current frontend is built to upgrade cleanly into push notifications and OTP
                        login later.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button onClick={onBrowseMenu} size="lg">
                            Browse menu
                        </Button>
                        <Button onClick={onOpenAccount} size="lg" variant="secondary">
                            Account / Login
                        </Button>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <PWAInstallButton />
                        <EnableNotificationsButton permission={notificationPermission} />
                    </div>

                    <div className="mt-4">
                        <IOSInstallHint />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <Card className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-[color:var(--primary-500)]/14 p-3 text-[color:var(--primary-900)]">
                                <HandCoins className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold">Cash only</p>
                                <p className="mt-1 text-sm leading-7 text-muted">Pay at the restaurant when you pick up your food.</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-[color:var(--secondary-500)]/14 p-3 text-[color:var(--secondary-900)]">
                                <Clock3 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold">Fast pickup rhythm</p>
                                <p className="mt-1 text-sm leading-7 text-muted">Each dish carries a clear preparation estimate.</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-[color:var(--accent-500)]/14 p-3 text-[color:var(--accent-900)]">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold">Pickup at the premises</p>
                                <p className="mt-1 text-sm leading-7 text-muted">Simple flow focused on ordering, pickup, and customer updates.</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-[color:var(--background-500)]/16 p-3 text-[color:var(--background-900)]">
                                <Download className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold">Installable experience</p>
                                <p className="mt-1 text-sm leading-7 text-muted">Prepared for Android, iOS, and desktop install prompts.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
