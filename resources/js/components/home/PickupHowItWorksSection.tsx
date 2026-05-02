import { PackageSearch, UserRoundPen, Wallet } from 'lucide-react';
import { SectionContainer } from '@/components/layout/SectionContainer';

const steps = [
    {
        title: 'Choose Your Grill',
        description: 'Browse grilled goat, grilled chicken, or mixed packs.',
        icon: PackageSearch,
    },
    {
        title: 'Place Pickup Order',
        description: 'Enter your name and USA phone number if it is your first order, or pre-order on Friday for Saturday pickup.',
        icon: UserRoundPen,
    },
    {
        title: 'Pay Cash at Pickup',
        description: 'Come to 701 Golden Gate Circle, Papillion, NE 68046 on Saturday between 11:00 AM and 10:00 PM and pay when you collect your food.',
        icon: Wallet,
    },
];

export function PickupHowItWorksSection() {
    return (
        <SectionContainer
            align="center"
            className="pb-12 lg:pb-16"
            description="Pre-orders open on Friday, and Saturday grill preparation plus pickup run from 11:00 AM to 10:00 PM with a 9:00 PM ordering cutoff."
            eyebrow="How Pickup Works"
            id="pickup"
            title="Three Clear Steps From Grill Selection To Collection"
        >
            <div className="grid gap-0 overflow-hidden rounded-[2rem] border border-white/10 lg:grid-cols-3">
                {steps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                        <div className="theme-divider theme-dark-block p-7 text-left lg:p-10" key={step.title}>
                            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[color:var(--primary-500)] text-white">
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-700)]">
                                Step {index + 1}
                            </p>
                            <h3 className="mt-4 text-3xl">{step.title}</h3>
                            <p className="mt-4 text-sm leading-7 text-muted">{step.description}</p>
                        </div>
                    );
                })}
            </div>
        </SectionContainer>
    );
}
