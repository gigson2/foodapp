import { ArrowRight, Flame } from 'lucide-react';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import type { Food } from '@/types';

type PopularGrillsSectionProps = {
    foods: Food[];
    onSelectFood: (food: Food) => void;
};

export function PopularGrillsSection({ foods, onSelectFood }: PopularGrillsSectionProps) {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0">
                <img alt="" className="h-full w-full object-cover opacity-20" src="/assets/images/image1.jpeg" />
                <div className="absolute inset-0 bg-[rgba(17,16,15,0.78)]" />
            </div>

            <SectionContainer
                align="center"
                className="relative pt-14 pb-20 lg:pt-16 lg:pb-[8.5rem]"
                description="Our most requested grill packs are prepared with tender chicken and lamb, neat takeaway presentation, dependable availability, and hospitality that keeps customer service first."
                eyebrow="Popular Grills"
                id="popular"
                tone="inverse"
                title="Discover Our Most Requested Grill Packs"
            >
                <div className="grid gap-0 overflow-hidden rounded-[2rem] border border-white/10 lg:grid-cols-4">
                    {foods.map((food, index) => (
                        <button
                            className="group theme-divider relative block min-h-[25rem] overflow-hidden border-b border-white/10 text-left transition last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
                            key={food.id}
                            onClick={() => onSelectFood(food)}
                            type="button"
                        >
                            <img
                                alt={`${food.name} prepared for pickup ordering`}
                                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                src={food.image}
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,16,15,0.42),rgba(17,16,15,0.84))]" />
                            <div className="relative flex h-full flex-col justify-end p-7">
                                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-[rgba(255,255,255,0.06)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/90">
                                    <Flame className="h-3.5 w-3.5 text-[color:var(--primary-500)]" />
                                    {food.tags[0] ?? 'Popular'}
                                </div>
                                <h3 className={index === 0 ? 'text-4xl text-white' : 'text-3xl text-white'}>{food.name}</h3>
                                <p className="mt-4 text-sm leading-7 text-white/78">{food.description}</p>
                                <div className="mt-6 flex items-center justify-between gap-3">
                                    <MoneyDisplay amount={food.price} className="text-2xl font-semibold text-white" />
                                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-500)]">
                                        Order
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </SectionContainer>
        </div>
    );
}
