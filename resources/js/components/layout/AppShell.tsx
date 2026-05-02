import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { AccountModal } from '@/components/account/AccountModal';
import { AboutSection } from '@/components/home/AboutSection';
import { ContactPickupSection } from '@/components/home/ContactPickupSection';
import { FeaturedFoodSection } from '@/components/home/FeaturedFoodSection';
import { HeroSection } from '@/components/home/HeroSection';
import { DesktopHeader } from '@/components/layout/DesktopHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { TabletHeader } from '@/components/layout/TabletHeader';
import { FoodMenuSection } from '@/components/menu/FoodMenuSection';
import { FoodOrderModal } from '@/components/menu/FoodOrderModal';
import { CustomerDetailsModal } from '@/components/ordering/CustomerDetailsModal';
import { OrderSuccessModal } from '@/components/ordering/OrderSuccessModal';
import { mockCategories } from '@/data/mockCategories';
import { mockFoods } from '@/data/mockFoods';
import { useLocalCustomer } from '@/hooks/useLocalCustomer';
import { useNotifications } from '@/hooks/useNotifications';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { orderService } from '@/services/orderService';
import type { Food, Order } from '@/types';

function subscribeOrders(listener: () => void) {
    return orderService.subscribe(listener);
}

export function AppShell() {
    const { customer, isLoggedIn, logout, preparePhoneIdentity, saveCustomer } = useLocalCustomer();
    const { markAllRead, markRead, notifications, permission, unreadCount } = useNotifications('customer');
    const scrollToSection = useScrollToSection();
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeSection, setActiveSection] = useState('home');
    const [accountOpen, setAccountOpen] = useState(false);
    const [customerModalMode, setCustomerModalMode] = useState<'order' | 'account'>('order');
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [loadingCustomer, setLoadingCustomer] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [pendingOrder, setPendingOrder] = useState<{ food: Food; quantity: number } | null>(null);

    const orders = useSyncExternalStore(
        subscribeOrders,
        () => (customer ? orderService.getOrdersByCustomer(customer.phone) : []),
        () => [],
    );

    const categoryNames = useMemo(() => ['All', ...mockCategories.map((category) => category.name)], []);
    const featuredFoods = useMemo(() => mockFoods.filter((food) => food.isFeatured).slice(0, 3), []);

    const filteredFoods = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return mockFoods.filter((food) => {
            const categoryMatch = activeCategory === 'All' || food.category === activeCategory;
            const searchMatch =
                term.length === 0 ||
                food.name.toLowerCase().includes(term) ||
                food.description.toLowerCase().includes(term) ||
                food.category.toLowerCase().includes(term);

            return categoryMatch && searchMatch && food.isAvailable;
        });
    }, [activeCategory, searchTerm]);

    useEffect(() => {
        const sectionIds = ['home', 'menu', 'about', 'contact', 'account'];
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visible?.target.id) {
                    setActiveSection(visible.target.id);
                }
            },
            {
                threshold: [0.25, 0.45, 0.65],
                rootMargin: '-20% 0px -45% 0px',
            },
        );

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, []);

    const openAccountFlow = () => {
        if (isLoggedIn) {
            setAccountOpen(true);
            return;
        }

        setCustomerModalMode('account');
        setDetailsOpen(true);
    };

    const handlePlaceOrder = (food: Food, quantity: number) => {
        if (customer) {
            const order = orderService.createPickupCashOrder({
                customer,
                food,
                quantity,
            });

            setSelectedFood(null);
            setOrderSuccess(order);
            toast.success('Pickup order received', {
                description: `${order.orderNumber} was sent to the restaurant.`,
            });

            return;
        }

        setPendingOrder({ food, quantity });
        setCustomerModalMode('order');
        setDetailsOpen(true);
    };

    const handleCustomerSubmit = async (values: { name: string; phone: string }) => {
        setLoadingCustomer(true);

        try {
            await preparePhoneIdentity(values.phone);
            const savedCustomer = saveCustomer(values);

            if (pendingOrder) {
                const order = orderService.createPickupCashOrder({
                    customer: savedCustomer,
                    food: pendingOrder.food,
                    quantity: pendingOrder.quantity,
                });

                setPendingOrder(null);
                setSelectedFood(null);
                setDetailsOpen(false);
                setOrderSuccess(order);
                toast.success('Pickup order received', {
                    description: `${order.orderNumber} was sent to the restaurant.`,
                });
            } else {
                setDetailsOpen(false);
                setAccountOpen(true);
                toast.success('You are signed in', {
                    description: 'Your phone number will identify your orders on this device.',
                });
            }
        } finally {
            setLoadingCustomer(false);
        }
    };

    return (
        <div className="app-surface min-h-screen pb-28 md:pb-10">
            <div className="sticky top-0 z-40 bg-[linear-gradient(180deg,rgba(6,1,24,0.82),rgba(6,1,24,0.18))] backdrop-blur-xl">
                <DesktopHeader
                    customerName={customer?.name}
                    isLoggedIn={isLoggedIn}
                    notifications={notifications}
                    onAccount={openAccountFlow}
                    onGoHome={() => scrollToSection('home')}
                    onGoMenu={() => scrollToSection('menu')}
                    onMarkAllRead={markAllRead}
                    onMarkRead={markRead}
                    unreadCount={unreadCount}
                />
                <TabletHeader
                    customerName={customer?.name}
                    isLoggedIn={isLoggedIn}
                    notifications={notifications}
                    onAccount={openAccountFlow}
                    onGoHome={() => scrollToSection('home')}
                    onGoMenu={() => scrollToSection('menu')}
                    onMarkAllRead={markAllRead}
                    onMarkRead={markRead}
                    unreadCount={unreadCount}
                />
                <div className="section-shell flex items-center justify-between py-4 md:hidden">
                    <button className="flex items-center gap-3" onClick={() => scrollToSection('home')} type="button">
                        <div className="rounded-2xl bg-[color:var(--primary-500)]/18 px-3 py-2 text-sm font-semibold text-[color:var(--primary-900)]">
                            ET
                        </div>
                        <div className="text-left">
                            <p className="font-display text-lg font-semibold">Ember Table</p>
                            <p className="text-xs text-muted">Pickup ordering</p>
                        </div>
                    </button>
                    <Button onClick={openAccountFlow} size="sm" variant="ghost">
                        {isLoggedIn ? customer?.name ?? 'Account' : 'Login'}
                    </Button>
                </div>
            </div>

            <main>
                <HeroSection
                    notificationPermission={permission}
                    onBrowseMenu={() => scrollToSection('menu')}
                    onOpenAccount={openAccountFlow}
                />
                <FeaturedFoodSection foods={featuredFoods} onSelectFood={setSelectedFood} />
                <FoodMenuSection
                    activeCategory={activeCategory}
                    categories={categoryNames}
                    foods={filteredFoods}
                    onCategoryChange={setActiveCategory}
                    onSearchChange={setSearchTerm}
                    onSelectFood={setSelectedFood}
                    searchTerm={searchTerm}
                />
                <AboutSection />
                <ContactPickupSection />

                <section className="section-shell scroll-mt-28 py-12 lg:py-16" id="account">
                    <Card className="p-6 sm:p-8 lg:p-10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="section-eyebrow">Account entry</p>
                                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Keep your pickup identity handy</h2>
                                <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
                                    Use your name and phone number to track recent orders on this device. The current flow is intentionally simple
                                    and can later be upgraded to OTP without redesigning the interface.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button onClick={openAccountFlow} size="lg">
                                    {isLoggedIn ? 'Open account' : 'Sign in with phone'}
                                </Button>
                                <Button onClick={() => scrollToSection('menu')} size="lg" variant="secondary">
                                    Order now
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>
            </main>

            <MobileBottomNav
                activeSection={activeSection}
                onAccount={openAccountFlow}
                onHome={() => scrollToSection('home')}
                onMenu={() => scrollToSection('menu')}
            />

            <FoodOrderModal
                food={selectedFood}
                isOpen={Boolean(selectedFood)}
                onClose={() => setSelectedFood(null)}
                onPlaceOrder={handlePlaceOrder}
            />

            <CustomerDetailsModal
                isOpen={detailsOpen}
                loading={loadingCustomer}
                mode={customerModalMode}
                onClose={() => {
                    setDetailsOpen(false);
                    setPendingOrder(null);
                }}
                onSubmit={handleCustomerSubmit}
            />

            <OrderSuccessModal
                isOpen={Boolean(orderSuccess)}
                onClose={() => setOrderSuccess(null)}
                onOpenAccount={() => {
                    setOrderSuccess(null);
                    setAccountOpen(true);
                }}
                order={orderSuccess}
            />

            {customer ? (
                <AccountModal
                    customer={customer}
                    isOpen={accountOpen}
                    notificationPermission={permission}
                    onClose={() => setAccountOpen(false)}
                    onLogout={() => {
                        logout();
                        setAccountOpen(false);
                        toast.success('Logged out');
                    }}
                    orders={orders}
                />
            ) : null}
        </div>
    );
}
