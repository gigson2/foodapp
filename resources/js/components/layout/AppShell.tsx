import { Bell, BellRing, Download } from 'lucide-react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FrontendLoginModal } from '@/components/auth/FrontendLoginModal';
import { AboutSection } from '@/components/home/AboutSection';
import { ContactSection } from '@/components/home/ContactSection';
import { GallerySection } from '@/components/home/GallerySection';
import { HeroSection } from '@/components/home/HeroSection';
import { PickupHowItWorksSection } from '@/components/home/PickupHowItWorksSection';
import { PopularGrillsSection } from '@/components/home/PopularGrillsSection';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { IconButton } from '@/components/common/IconButton';
import { DesktopHeader } from '@/components/layout/DesktopHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { TabletHeader } from '@/components/layout/TabletHeader';
import { FoodMenuSection } from '@/components/menu/FoodMenuSection';
import { FoodOrderModal } from '@/components/menu/FoodOrderModal';
import { CustomerDetailsModal } from '@/components/ordering/CustomerDetailsModal';
import { OrderSuccessModal } from '@/components/ordering/OrderSuccessModal';
import { FirstVisitPromptModal } from '@/components/pwa/FirstVisitPromptModal';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { LeaveReviewModal } from '@/components/reviews/LeaveReviewModal';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { AUTH_SESSION_QUERY_KEY, useAuthSession } from '@/hooks/useAuthSession';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { useLocalCustomer } from '@/hooks/useLocalCustomer';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { customerPortalService } from '@/customer/services/customerPortalService';
import { markAllCustomerNotificationsReadInCache, markCustomerNotificationReadInCache } from '@/admin/utils/notificationCache';
import { apiClient } from '@/services/apiClient';
import { orderService } from '@/services/orderService';
import { getNotificationPermission, subscribeToPush, requestNotificationAccess } from '@/services/pwaService';
import {
    publicService,
    PUBLIC_CATEGORIES_QUERY_KEY,
    PUBLIC_COMPANY_SETTINGS_QUERY_KEY,
    PUBLIC_FOODS_QUERY_KEY,
    PUBLIC_REVIEWS_QUERY_KEY,
} from '@/services/publicService';
import { subscribeToPublicContentUpdates } from '@/services/publicContentSync';
import { reviewService } from '@/services/reviewService';
import { adminService } from '@/services/adminService';
import { sessionService } from '@/services/sessionService';
import { normalizeUsPhone } from '@/utils/phone';
import { readStorage, writeStorage } from '@/utils/storage';
import { getCompanyLocationLabel, getCompanyName } from '@/utils/company';
import type { Food, Order } from '@/types';

const NOTIFICATION_PROMPT_KEY = 'restaurant.prompts.notifications.dismissed';
const INSTALL_PROMPT_KEY = 'restaurant.prompts.install.dismissed';

function getDesktopActiveSection(section: string): 'home' | 'menu' | 'reviews' | 'contact' | 'account' {
    if (section === 'account') {
        return 'account';
    }

    if (section === 'contact') {
        return 'contact';
    }

    if (section === 'reviews') {
        return 'reviews';
    }

    if (section === 'menu' || section === 'about' || section === 'pickup' || section === 'gallery') {
        return 'menu';
    }

    return 'home';
}

function getMobileActiveSection(section: string): 'home' | 'menu' | 'reviews' | 'account' {
    if (section === 'account') {
        return 'account';
    }

    if (section === 'reviews' || section === 'contact') {
        return 'reviews';
    }

    if (section === 'menu' || section === 'about' || section === 'pickup' || section === 'gallery') {
        return 'menu';
    }

    return 'home';
}

export function AppShell() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { customer, preparePhoneIdentity, saveCustomer } = useLocalCustomer();
    const [permission, setPermission] = useState(() => getNotificationPermission());
    const scrollToSection = useScrollToSection();
    const { canInstall, isIos, isStandalone, promptInstall } = useInstallPrompt();
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeSection, setActiveSection] = useState('home');
    const [customerModalMode, setCustomerModalMode] = useState<'order' | 'account'>('order');
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [installPromptDismissed, setInstallPromptDismissed] = useState(() => readStorage(INSTALL_PROMPT_KEY, false));
    const [installPromptReady, setInstallPromptReady] = useState(false);
    const [loadingCustomer, setLoadingCustomer] = useState(false);
    const [loadingReview, setLoadingReview] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginOpen, setLoginOpen] = useState(false);
    const [notificationPromptDismissed, setNotificationPromptDismissed] = useState(() => readStorage(NOTIFICATION_PROMPT_KEY, false));
    const [notificationPromptReady, setNotificationPromptReady] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
    const [pendingOrder, setPendingOrder] = useState<{ food: Food; quantity: number } | null>(null);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);

    const { user: sessionUser = null } = useAuthSession();
    const { data: categories = [] } = useQuery({
        queryKey: PUBLIC_CATEGORIES_QUERY_KEY,
        queryFn: publicService.getCategories,
    });
    const { data: foods = [] } = useQuery({
        queryKey: PUBLIC_FOODS_QUERY_KEY,
        queryFn: publicService.getFoods,
    });
    const { data: companySettings = null } = useQuery({
        queryKey: PUBLIC_COMPANY_SETTINGS_QUERY_KEY,
        queryFn: publicService.getCompanySettings,
    });

    const effectiveCustomer = useMemo(() => {
        if (customer) {
            return customer;
        }

        if (sessionUser?.role === 'customer' && sessionUser.phone) {
            return {
                id: String(sessionUser.id),
                name: sessionUser.name,
                phone: sessionUser.phone,
                createdAt: sessionUser.last_login_at ?? new Date().toISOString(),
            };
        }

        return null;
    }, [customer, sessionUser]);

    const { data: approvedReviews = [] } = useQuery({
        queryKey: PUBLIC_REVIEWS_QUERY_KEY,
        queryFn: publicService.getApprovedReviews,
    });
    const customerNotificationsQuery = useQuery({
        enabled: sessionUser?.role === 'customer',
        queryKey: ['customer-portal', 'notifications'],
        queryFn: customerPortalService.getNotifications,
        refetchInterval: 15_000,
        refetchOnWindowFocus: true,
    });
    const customerNotifications = customerNotificationsQuery.data ?? [];
    const unreadCount = customerNotifications.filter((notification) => !notification.read).length;
    const markNotificationReadMutation = useMutation({
        mutationFn: customerPortalService.markNotificationRead,
        onSuccess: (notification) => {
            markCustomerNotificationReadInCache(queryClient, notification.id);
        },
    });
    const markAllNotificationsMutation = useMutation({
        mutationFn: customerPortalService.markAllNotificationsRead,
        onSuccess: () => {
            toast.success('Notifications marked as read');
            markAllCustomerNotificationsReadInCache(queryClient);
        },
    });

    const sessionLoginMutation = useMutation({
        mutationFn: adminService.login,
    });
    const sessionRegisterMutation = useMutation({
        mutationFn: (input: { name: string; phone: string; password: string; passwordConfirmation: string }) => sessionService.register(input),
    });

    const categoryNames = useMemo(() => ['All', ...categories.map((category) => category.name)], [categories]);
    const popularFoods = useMemo(() => foods.filter((food) => food.isPopular).slice(0, 4), [foods]);
    const filteredFoods = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return foods.filter((food) => {
            const categoryMatch = activeCategory === 'All' || food.category === activeCategory;
            const searchMatch =
                term.length === 0 ||
                food.name.toLowerCase().includes(term) ||
                food.description.toLowerCase().includes(term) ||
                food.category.toLowerCase().includes(term) ||
                food.tags.some((tag) => tag.toLowerCase().includes(term));

            return categoryMatch && searchMatch && food.isAvailable;
        });
    }, [activeCategory, foods, searchTerm]);

    const hasAccountIdentity = Boolean(sessionUser || effectiveCustomer);
    const accountName = sessionUser?.name ?? effectiveCustomer?.name;

    useEffect(() => {
        const updatePermission = () => setPermission(getNotificationPermission());

        updatePermission();
        window.addEventListener('focus', updatePermission);
        window.addEventListener('notification-permission-change', updatePermission as EventListener);

        return () => {
            window.removeEventListener('focus', updatePermission);
            window.removeEventListener('notification-permission-change', updatePermission as EventListener);
        };
    }, []);

    useEffect(() => {
        const sectionIds = ['home', 'popular', 'menu', 'about', 'pickup', 'gallery', 'reviews', 'contact', 'account'];
        let frame = 0;

        const updateActiveSection = () => {
            frame = 0;
            const probe = window.innerHeight * 0.38;
            const sections = sectionIds
                .map((id) => document.getElementById(id))
                .filter((element): element is HTMLElement => Boolean(element));

            if (sections.length === 0) {
                return;
            }

            const containingSection = sections.find((section) => {
                const rect = section.getBoundingClientRect();

                return rect.top <= probe && rect.bottom >= probe;
            });

            if (containingSection) {
                setActiveSection((current) => (current === containingSection.id ? current : containingSection.id));
                return;
            }

            const closestSection = sections
                .map((section) => ({
                    id: section.id,
                    distance: Math.abs(section.getBoundingClientRect().top - probe),
                }))
                .sort((first, second) => first.distance - second.distance)[0];

            if (closestSection) {
                setActiveSection((current) => (current === closestSection.id ? current : closestSection.id));
            }
        };

        const requestUpdate = () => {
            if (frame) {
                return;
            }

            frame = window.requestAnimationFrame(updateActiveSection);
        };

        updateActiveSection();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);

        return () => {
            if (frame) {
                window.cancelAnimationFrame(frame);
            }

            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
        };
    }, []);

    useEffect(() => {
        return subscribeToPublicContentUpdates((payload) => {
            if (payload.scope === 'foods') {
                void queryClient.invalidateQueries({ queryKey: PUBLIC_FOODS_QUERY_KEY });
                return;
            }

            if (payload.scope === 'categories') {
                void queryClient.invalidateQueries({ queryKey: PUBLIC_CATEGORIES_QUERY_KEY });
                return;
            }

            if (payload.scope === 'company-settings') {
                void queryClient.invalidateQueries({ queryKey: PUBLIC_COMPANY_SETTINGS_QUERY_KEY });
                return;
            }

            if (payload.scope === 'reviews') {
                void queryClient.invalidateQueries({ queryKey: PUBLIC_REVIEWS_QUERY_KEY });
            }
        });
    }, [queryClient]);

    useEffect(() => {
        if (permission !== 'default' || notificationPromptDismissed || notificationPromptReady) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setNotificationPromptReady(true);
        }, 900);

        return () => window.clearTimeout(timeoutId);
    }, [notificationPromptDismissed, notificationPromptReady, permission]);

    useEffect(() => {
        const installEligible = !isStandalone && (canInstall || isIos);
        const notificationPromptOpen = permission === 'default' && notificationPromptReady && !notificationPromptDismissed;

        if (
            !installEligible
            || notificationPromptOpen
            || installPromptDismissed
            || installPromptReady
        ) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setInstallPromptReady(true);
        }, 1200);

        return () => window.clearTimeout(timeoutId);
    }, [canInstall, installPromptDismissed, installPromptReady, isIos, isStandalone, notificationPromptDismissed, notificationPromptReady, permission]);

    const openAccountFlow = () => {
        if (sessionUser?.role === 'admin') {
            navigate('/admin');
            return;
        }

        if (sessionUser?.role === 'customer' || effectiveCustomer) {
            navigate('/customer/dashboard');
            return;
        }

        setLoginError(null);
        setLoginOpen(true);
    };

    const dismissNotificationPrompt = () => {
        writeStorage(NOTIFICATION_PROMPT_KEY, true);
        setNotificationPromptDismissed(true);
        setNotificationPromptReady(false);
    };

    const dismissInstallPrompt = () => {
        writeStorage(INSTALL_PROMPT_KEY, true);
        setInstallPromptDismissed(true);
        setInstallPromptReady(false);
    };

    const handleEnableNotifications = async () => {
        const result = await requestNotificationAccess();

        if (result === 'granted') {
            const subscription = await subscribeToPush();

            if (subscription && sessionUser) {
                await customerPortalService.savePushSubscription(subscription).catch(() => undefined);
            }

            toast.success('Notifications enabled', {
                description: 'You will receive real-time pickup alerts for your orders.',
            });
        } else if (result === 'denied') {
            toast.error('Notifications blocked', {
                description: 'You can enable grill alerts later from your browser settings or account area.',
            });
        } else if (result === 'default') {
            toast.message('Notification permission dismissed');
        } else {
            toast.error('Notifications unavailable', {
                description: 'This browser does not expose the Notifications API.',
            });
        }

        dismissNotificationPrompt();
    };

    const handleInstallPrompt = async () => {
        if (isIos) {
            dismissInstallPrompt();
            return;
        }

        const result = await promptInstall();

        if (result === 'accepted') {
            toast.success('Install started');
            dismissInstallPrompt();
            return;
        }

        if (result === 'dismissed') {
            toast.message('Install dismissed');
            dismissInstallPrompt();
        }
    };

    const handlePlaceOrder = async (food: Food, quantity: number) => {
        if (sessionUser?.role === 'customer') {
            try {
                const response = await apiClient.post<{ data: { id: number; order_number: string; customer_name: string; customer_phone: string; subtotal: number; total: number; payment_method: string; order_type: string; status: Order['status']; placed_at?: string | null; created_at: string; items: Array<{ id: number; food_id: number | null; food_name: string; unit_price: number; quantity: number; line_total: number }> } }>('/customer/orders', {
                    food_id: food.id,
                    quantity,
                });

                const apiOrder = response.data.data;
                const order: Order = {
                    id: String(apiOrder.id),
                    orderNumber: apiOrder.order_number,
                    customerName: apiOrder.customer_name,
                    customerPhone: apiOrder.customer_phone,
                    items: apiOrder.items.map((item) => ({
                        id: String(item.id),
                        foodId: String(item.food_id ?? ''),
                        foodName: item.food_name,
                        price: item.unit_price,
                        quantity: item.quantity,
                        total: item.line_total,
                    })),
                    subtotal: apiOrder.subtotal,
                    total: apiOrder.total,
                    paymentMethod: apiOrder.payment_method as Order['paymentMethod'],
                    orderType: apiOrder.order_type as Order['orderType'],
                    status: apiOrder.status,
                    createdAt: apiOrder.placed_at ?? apiOrder.created_at,
                };

                setSelectedFood(null);
                setOrderSuccess(order);
                void queryClient.invalidateQueries({ queryKey: ['customer-portal', 'orders'] });
                void queryClient.invalidateQueries({ queryKey: ['customer-portal', 'dashboard'] });
                toast.success('Pickup order received', {
                    description: `${order.orderNumber} was sent to the restaurant.`,
                });
            } catch {
                toast.error('Failed to place order', {
                    description: 'Please try again.',
                });
            }

            return;
        }

        if (effectiveCustomer) {
            const order = orderService.createPickupCashOrder({
                customer: effectiveCustomer,
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
                navigate('/customer/dashboard');
                toast.success('Account saved', {
                    description: 'Your phone number now identifies your orders on this device.',
                });
            }
        } finally {
            setLoadingCustomer(false);
        }
    };

    const handleSessionOrderSubmit = async (values: { name: string; phone: string }) => {
        setLoadingCustomer(true);

        try {
            if (pendingOrder && sessionUser?.role === 'customer') {
                const response = await apiClient.post<{ data: { id: number; order_number: string; customer_name: string; customer_phone: string; subtotal: number; total: number; payment_method: string; order_type: string; status: Order['status']; placed_at?: string | null; created_at: string; items: Array<{ id: number; food_id: number | null; food_name: string; unit_price: number; quantity: number; line_total: number }> } }>('/customer/orders', {
                    food_id: pendingOrder.food.id,
                    quantity: pendingOrder.quantity,
                });

                const apiOrder = response.data.data;
                const order: Order = {
                    id: String(apiOrder.id),
                    orderNumber: apiOrder.order_number,
                    customerName: apiOrder.customer_name,
                    customerPhone: apiOrder.customer_phone,
                    items: apiOrder.items.map((item) => ({
                        id: String(item.id),
                        foodId: String(item.food_id ?? ''),
                        foodName: item.food_name,
                        price: item.unit_price,
                        quantity: item.quantity,
                        total: item.line_total,
                    })),
                    subtotal: apiOrder.subtotal,
                    total: apiOrder.total,
                    paymentMethod: apiOrder.payment_method as Order['paymentMethod'],
                    orderType: apiOrder.order_type as Order['orderType'],
                    status: apiOrder.status,
                    createdAt: apiOrder.placed_at ?? apiOrder.created_at,
                };

                setPendingOrder(null);
                setSelectedFood(null);
                setDetailsOpen(false);
                setOrderSuccess(order);
                void queryClient.invalidateQueries({ queryKey: ['customer-portal', 'orders'] });
                void queryClient.invalidateQueries({ queryKey: ['customer-portal', 'dashboard'] });
                toast.success('Pickup order received', {
                    description: `${order.orderNumber} was sent to the restaurant.`,
                });

                return;
            }

            await handleCustomerSubmit(values);
        } catch {
            toast.error('Failed to place order', { description: 'Please try again.' });
        } finally {
            setLoadingCustomer(false);
        }
    };

    const handleReviewSubmit = async (values: {
        foodName?: string;
        message: string;
        name: string;
        phone: string;
        rating: number;
    }) => {
        setLoadingReview(true);

        try {
            if (sessionUser?.role === 'customer') {
                await customerPortalService.createReview({
                    rating: values.rating,
                    message: values.message,
                    foodName: values.foodName,
                });

                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['customer-portal', 'reviews'] }),
                    queryClient.invalidateQueries({ queryKey: ['customer-portal', 'dashboard'] }),
                    queryClient.invalidateQueries({ queryKey: ['customer-portal', 'notifications'] }),
                    queryClient.invalidateQueries({ queryKey: ['admin-app', 'reviews'] }),
                    queryClient.invalidateQueries({ queryKey: ['admin-app', 'dashboard'] }),
                    queryClient.invalidateQueries({ queryKey: ['admin-app', 'notifications'] }),
                ]);
            } else {
                if (! reviewService.canSubmitReview({ name: values.name, phone: values.phone })) {
                    return {
                        success: false,
                        error: 'Only customers who have ordered from this restaurant can leave a review.',
                    };
                }

                reviewService.addPendingReview({
                    customerName: values.name,
                    customerPhone: values.phone,
                    rating: values.rating,
                    message: values.message,
                    foodName: values.foodName,
                });
            }

            toast.success('Review submitted', {
                description: 'Thank you. Your review has been submitted and will appear after approval.',
            });
            setReviewOpen(false);

            return { success: true };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    success: false,
                    error: (error.response?.data?.message as string | undefined) ?? 'Unable to submit review.',
                };
            }

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unable to submit review.',
            };
        } finally {
            setLoadingReview(false);
        }
    };

    const desktopActiveSection = getDesktopActiveSection(activeSection === 'popular' ? 'home' : activeSection);
    const mobileActiveSection = getMobileActiveSection(activeSection === 'popular' ? 'home' : activeSection);
    const brandName = getCompanyName(companySettings);
    const brandLogoUrl = companySettings?.logo ?? null;
    const locationLabel = getCompanyLocationLabel(companySettings);
    const showNotificationPrompt = notificationPromptReady && permission === 'default' && !notificationPromptDismissed;
    const showInstallPrompt = installPromptReady && !showNotificationPrompt && !isStandalone && (canInstall || isIos) && !installPromptDismissed;

    return (
        <div className="app-surface min-h-screen pb-28 md:pb-10">
            <div className="sticky top-0 z-40 bg-[color:var(--background-50)]/92 backdrop-blur-xl">
                    <DesktopHeader
                        activeSection={desktopActiveSection}
                        brandLogoUrl={brandLogoUrl}
                        brandName={brandName}
                        customerName={accountName}
                        isLoggedIn={hasAccountIdentity}
                        notifications={customerNotifications}
                        onAccount={openAccountFlow}
                        onGoContact={() => scrollToSection('contact')}
                        onGoHome={() => scrollToSection('home')}
                        onGoMenu={() => scrollToSection('menu')}
                        onGoReviews={() => scrollToSection('reviews')}
                        onMarkAllRead={() => markAllNotificationsMutation.mutate()}
                        onMarkRead={(notificationId) => markNotificationReadMutation.mutate(notificationId)}
                        unreadCount={unreadCount}
                    />
                    <TabletHeader
                    activeSection={desktopActiveSection === 'account' ? 'contact' : desktopActiveSection}
                    brandLogoUrl={brandLogoUrl}
                    brandName={brandName}
                        customerName={accountName}
                        isLoggedIn={hasAccountIdentity}
                        locationLabel={locationLabel}
                        notifications={customerNotifications}
                        onAccount={openAccountFlow}
                    onGoContact={() => scrollToSection('contact')}
                    onGoHome={() => scrollToSection('home')}
                    onGoMenu={() => scrollToSection('menu')}
                    onGoReviews={() => scrollToSection('reviews')}
                        onMarkAllRead={() => markAllNotificationsMutation.mutate()}
                        onMarkRead={(notificationId) => markNotificationReadMutation.mutate(notificationId)}
                        unreadCount={unreadCount}
                    />
                <div className="top-utility relative z-20 md:hidden">
                    <div className="section-shell flex items-center justify-end gap-2 py-3">
                        {hasAccountIdentity ? (
                            <NotificationBell
                                notifications={customerNotifications}
                                onMarkAllRead={() => markAllNotificationsMutation.mutate()}
                                onMarkRead={(notificationId) => markNotificationReadMutation.mutate(notificationId)}
                                unreadCount={unreadCount}
                            />
                        ) : (
                            <IconButton aria-label="Notifications unavailable">
                                <Bell className="h-5 w-5" />
                            </IconButton>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
                <div className="top-utility relative z-10 md:hidden">
                    <div className="section-shell flex items-center justify-between gap-4 py-4">
                        <button className="flex items-center gap-3" onClick={() => scrollToSection('home')} type="button">
                            {brandLogoUrl ? <img alt={`${brandName} logo`} className="h-11 w-auto shrink-0 object-contain" src={brandLogoUrl} /> : <span className="shrink-0 text-sm font-semibold text-[color:var(--primary-500)]">DG</span>}
                            <div className="max-w-[11rem] text-left">
                                <p className="font-display text-2xl leading-none">{brandName}</p>
                            </div>
                        </button>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => scrollToSection('menu')} size="sm" variant="ghost">
                                Order
                            </Button>
                            <Button onClick={openAccountFlow} size="sm" variant="secondary">
                                {hasAccountIdentity ? 'Account' : 'Login'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main>
                <HeroSection companySettings={companySettings} onBrowseMenu={() => scrollToSection('menu')} onOpenAccount={openAccountFlow} />
                <PopularGrillsSection foods={popularFoods} onSelectFood={setSelectedFood} />
                <FoodMenuSection
                    activeCategory={activeCategory}
                    categories={categoryNames}
                    foods={filteredFoods}
                    onCategoryChange={setActiveCategory}
                    onSearchChange={setSearchTerm}
                    onSelectFood={setSelectedFood}
                    searchTerm={searchTerm}
                />
                <AboutSection companySettings={companySettings} />
                <PickupHowItWorksSection companySettings={companySettings} />
                <GallerySection />
                <ReviewsSection onLeaveReview={() => setReviewOpen(true)} reviews={approvedReviews} />
                <ContactSection companySettings={companySettings} onOrderNow={() => scrollToSection('menu')} />

                <section className="section-shell scroll-mt-28 py-20 lg:py-24" id="account">
                    <Card className="theme-panel theme-dark-block overflow-hidden p-6 sm:p-8 lg:p-10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="section-eyebrow">Account access</p>
                                <h2 className="mt-4 text-4xl sm:text-5xl">Sign in from the storefront</h2>
                                <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
                                    Admin users are sent directly to the operations dashboard. Customer users stay on the public app and can open their dashboard whenever they want.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button onClick={openAccountFlow} size="lg">
                                    {hasAccountIdentity ? 'Open dashboard' : 'Sign in with phone'}
                                </Button>
                                <Button onClick={() => setReviewOpen(true)} size="lg" variant="secondary">
                                    Leave a review
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>
            </main>

            <MobileBottomNav
                activeSection={mobileActiveSection}
                onAccount={openAccountFlow}
                onHome={() => scrollToSection('home')}
                onMenu={() => scrollToSection('menu')}
                onReviews={() => scrollToSection('reviews')}
            />

            <FoodOrderModal
                companySettings={companySettings}
                food={selectedFood}
                isOpen={Boolean(selectedFood)}
                key={selectedFood?.id ?? 'food-order-modal'}
                onClose={() => setSelectedFood(null)}
                onPlaceOrder={handlePlaceOrder}
            />

            <CustomerDetailsModal
                initialValues={{
                    name: effectiveCustomer?.name,
                    phone: effectiveCustomer?.phone,
                }}
                isOpen={detailsOpen}
                loading={loadingCustomer}
                mode={customerModalMode}
                onClose={() => {
                    setDetailsOpen(false);
                    setPendingOrder(null);
                }}
                onSubmit={sessionUser?.role === 'customer' ? handleSessionOrderSubmit : handleCustomerSubmit}
            />

            <OrderSuccessModal
                companySettings={companySettings}
                isOpen={Boolean(orderSuccess)}
                onClose={() => setOrderSuccess(null)}
                onOpenAccount={() => {
                    setOrderSuccess(null);
                    navigate('/customer/dashboard');
                }}
                order={orderSuccess}
            />

            <LeaveReviewModal
                foods={foods}
                initialValues={{
                    name: effectiveCustomer?.name,
                    phone: effectiveCustomer?.phone,
                }}
                isOpen={reviewOpen}
                key={`${effectiveCustomer?.phone ?? 'guest'}-${reviewOpen ? 'open' : 'closed'}`}
                loading={loadingReview}
                onClose={() => setReviewOpen(false)}
                onSubmit={handleReviewSubmit}
            />

            <FrontendLoginModal
                errorMessage={loginError}
                isOpen={loginOpen}
                loading={sessionLoginMutation.isPending || sessionRegisterMutation.isPending}
                onClose={() => {
                    setLoginOpen(false);
                    setLoginError(null);
                }}
                onLogin={async (values) => {
                    try {
                        setLoginError(null);
                        const payload = await sessionLoginMutation.mutateAsync({
                            login: normalizeUsPhone(values.phone),
                            password: values.password,
                        });
                        queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, payload.user);

                        if (payload.user.role === 'admin') {
                            navigate('/admin');
                            return;
                        }

                        if (payload.user.phone) {
                            saveCustomer({
                                name: payload.user.name,
                                phone: payload.user.phone,
                            });
                        }

                        setLoginOpen(false);
                        toast.success('Signed in successfully');
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            setLoginError((error.response?.data?.message as string | undefined) ?? 'Unable to sign in.');
                            return;
                        }

                        setLoginError(error instanceof Error ? error.message : 'Unable to sign in.');
                    }
                }}
                onRegister={async (values) => {
                    try {
                        setLoginError(null);
                        const payload = await sessionRegisterMutation.mutateAsync({
                            name: values.name,
                            phone: normalizeUsPhone(values.phone),
                            password: values.password,
                            passwordConfirmation: values.passwordConfirmation,
                        });
                        queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, payload.user);

                        if (payload.user.phone) {
                            saveCustomer({
                                name: payload.user.name,
                                phone: payload.user.phone,
                            });
                        }

                        setLoginOpen(false);
                        toast.success('Account created successfully');
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            setLoginError((error.response?.data?.message as string | undefined) ?? 'Unable to create account.');
                            return;
                        }

                        setLoginError(error instanceof Error ? error.message : 'Unable to create account.');
                    }
                }}
            />

            <FirstVisitPromptModal
                description={`Enable notifications so ${brandName} can send real-time pickup alerts when your grilled order is received, being prepared, or ready for collection.`}
                icon={<BellRing className="h-5 w-5" />}
                isOpen={showNotificationPrompt}
                onPrimary={handleEnableNotifications}
                onSecondary={dismissNotificationPrompt}
                primaryLabel="Enable notifications"
                title="Stay updated on your pickup order"
            />

            <FirstVisitPromptModal
                description={
                    isIos
                        ? `Install ${brandName} to your home screen. On iPhone or iPad, tap Share and choose Add to Home Screen.`
                        : `Install ${brandName} for faster access, a more app-like pickup experience, and future push updates.`
                }
                icon={<Download className="h-5 w-5" />}
                isOpen={showInstallPrompt}
                onPrimary={handleInstallPrompt}
                onSecondary={dismissInstallPrompt}
                primaryLabel={isIos ? 'Got it' : 'Install app'}
                title="Install the grill app"
            />
        </div>
    );
}
