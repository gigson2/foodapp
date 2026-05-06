import { MapPin, WalletCards } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { getCompanyAddress, getCompanyName, getCompanyTagline, getCompanyLocationLabel } from '@/utils/company';
import { openDirectionsPrompt } from '@/utils/location';
import type { CompanySettings } from '@/types';

type ContactSectionProps = {
    companySettings: CompanySettings | null;
    onOrderNow: () => void;
};

export function ContactSection({ companySettings, onOrderNow }: ContactSectionProps) {
    const companyName = getCompanyName(companySettings);
    const locationLabel = getCompanyAddress(companySettings);
    const locationShortLabel = getCompanyLocationLabel(companySettings);
    const fridayHours = companySettings?.opening_hours?.friday ?? 'Pre-orders open';
    const saturdayHours = companySettings?.opening_hours?.saturday ?? '11:00 AM - 10:00 PM';
    const orderingCutoff = companySettings?.opening_hours?.ordering_cutoff ?? 'Saturday 9:00 PM';
    const phoneLabel = companySettings?.phone ?? 'Phone number coming soon';
    const tagline = getCompanyTagline(companySettings);

    return (
        <div className="relative">
            <SectionContainer className="pt-4 lg:pt-8" id="contact">
                <div className="theme-panel theme-dark-block relative overflow-hidden rounded-[2rem] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
                    <img alt="" className="absolute bottom-0 right-0 hidden max-w-[42%] opacity-35 lg:block" src="/assets/theme/reservation_bg.png" />
                    <img alt="" className="absolute bottom-[-5.5rem] left-0 hidden max-w-[34%] opacity-90 lg:block" src="/assets/theme/reservation_imgs.png" />

                    <div className="relative z-10 mx-auto max-w-4xl text-center">
                        <h2 className="text-5xl sm:text-6xl lg:text-[5rem]">Pickup From Our Grill Location</h2>
                        <p className="mt-5 text-base leading-8 text-muted">
                            {companyName} serves pickup-only grilled chicken and lamb from {locationLabel}.
                        </p>
                        {tagline ? <p className="mt-3 text-sm leading-7 text-muted">{tagline}</p> : null}

                        <div className="mt-10 grid gap-4 md:grid-cols-3">
                            <div className="ui-surface-solid ui-outline-accent rounded-2xl p-5">
                                <MapPin className="mx-auto h-5 w-5 text-[color:var(--primary-500)]" />
                                <h3 className="mt-4 text-2xl">Pickup Only</h3>
                                <p className="mt-3 text-sm leading-7 text-muted">Customers place orders online, then collect them at the restaurant premises on pickup day.</p>
                            </div>
                            <div className="ui-surface-solid ui-outline-accent rounded-2xl p-5">
                                <WalletCards className="mx-auto h-5 w-5 text-[color:var(--primary-500)]" />
                                <h3 className="mt-4 text-2xl">Cash Payment</h3>
                                <p className="mt-3 text-sm leading-7 text-muted">No online checkout. Payment is completed when the customer arrives for pickup.</p>
                            </div>
                            <div className="ui-surface-solid ui-outline-gold rounded-2xl p-5">
                                <MapPin className="mx-auto h-5 w-5 text-[color:var(--primary-500)]" />
                                <h3 className="mt-4 text-2xl">Ordering Schedule</h3>
                                <p className="mt-3 text-sm leading-7 text-muted">Friday: {fridayHours}. Saturday preparation and pickup run {saturdayHours}, with final ordering at {orderingCutoff}.</p>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button onClick={onOrderNow} size="lg">
                                Order Now
                            </Button>
                            <Button onClick={() => openDirectionsPrompt(locationLabel)} size="lg" variant="secondary">
                                Get Directions
                            </Button>
                        </div>
                        <p className="mt-4 text-sm text-muted">{locationShortLabel} - {phoneLabel}</p>
                    </div>
                </div>
            </SectionContainer>
        </div>
    );
}
