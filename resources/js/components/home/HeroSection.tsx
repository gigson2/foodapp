import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';

type HeroSectionProps = {
    notificationPermission: NotificationPermission | 'unsupported';
    onBrowseMenu: () => void;
    onOpenAccount: () => void;
};

const heroSlides = [
    {
        image: '/assets/images/image6.jpeg',
        title: 'Tender Grilled Chicken & Goat',
        description:
            'Dri Africain Traditional Grill LLC prepares large-scale grilled chicken and goat with professional seasoning, neat packaging, and pickup-ready service.',
    },
    {
        image: '/assets/images/image5.jpeg',
        title: 'Traditional African Grill Made Fresh',
        description:
            'Our grill packs are prepared for customers who want real smoky flavor, soft meat texture, and a straightforward pickup experience.',
    },
    {
        image: '/assets/images/image4.jpeg',
        title: 'Pickup Orders With Cash At Collection',
        description:
            'Order online, come to 701 Golden Gate Circle, Papillion, NE 68046, and pay when your food is ready for pickup.',
    },
];

export function HeroSection({ onBrowseMenu, onOpenAccount }: HeroSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % heroSlides.length);
        }, 5200);

        return () => window.clearInterval(interval);
    }, []);

    const activeSlide = heroSlides[activeIndex];

    return (
        <section className="scroll-mt-28" id="home">
            <div className="relative min-h-[78vh] overflow-hidden border-b border-white/10 md:min-h-[86vh]">
                <img
                    alt={`${activeSlide.title} at Dri Africain Traditional Grill LLC`}
                    className="animate-hero-fade absolute inset-0 h-full w-full object-cover"
                    key={activeSlide.image}
                    src={activeSlide.image}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,16,15,0.42),rgba(17,16,15,0.72),rgba(17,16,15,0.94))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(203,69,56,0.16),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(211,145,50,0.1),transparent_18%)]" />

                <div className="section-shell relative flex min-h-[78vh] flex-col items-center justify-center py-24 text-center md:min-h-[86vh]">
                    <div className="animate-rise-in max-w-5xl">
                        <p className="section-eyebrow justify-center text-center text-[color:var(--accent-300)]">
                            Traditional African Grill
                        </p>
                        <h1 className="mt-6 text-5xl leading-[0.92] text-white sm:text-7xl lg:text-[6.6rem]">
                            {activeSlide.title}
                        </h1>
                        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
                            {activeSlide.description}
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button onClick={onBrowseMenu} size="lg">
                                Order Now
                            </Button>
                            <Button
                                className="bg-white/10 text-white hover:bg-white/16"
                                onClick={onBrowseMenu}
                                size="lg"
                                variant="secondary"
                            >
                                Food Menu
                            </Button>
                            <Button className="text-white hover:bg-white/12" onClick={onOpenAccount} size="lg" variant="ghost">
                                Account
                            </Button>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-sm">
                            <span className="rounded-full border border-white/14 bg-[rgba(255,255,255,0.06)] px-4 py-2">Cash at Pickup</span>
                            <span className="rounded-full border border-white/14 bg-[rgba(255,255,255,0.06)] px-4 py-2">Freshly Grilled</span>
                            <span className="rounded-full border border-white/14 bg-[rgba(255,255,255,0.06)] px-4 py-2">Pickup Only</span>
                            <span className="rounded-full border border-white/14 bg-[rgba(255,255,255,0.06)] px-4 py-2">Papillion, Nebraska</span>
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
                        <button
                            aria-label="Previous hero slide"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-[rgba(255,255,255,0.06)] text-white transition hover:bg-[rgba(255,255,255,0.12)]"
                            onClick={() => setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
                            type="button"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-2">
                            {heroSlides.map((slide, index) => (
                                <button
                                    aria-label={`Show slide ${index + 1}`}
                                    className={index === activeIndex ? 'h-2.5 w-10 rounded-full bg-[color:var(--primary-500)]' : 'h-2.5 w-2.5 rounded-full bg-white/30'}
                                    key={slide.title}
                                    onClick={() => setActiveIndex(index)}
                                    type="button"
                                />
                            ))}
                        </div>

                        <button
                            aria-label="Next hero slide"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-[rgba(255,255,255,0.06)] text-white transition hover:bg-[rgba(255,255,255,0.12)]"
                            onClick={() => setActiveIndex((current) => (current + 1) % heroSlides.length)}
                            type="button"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
