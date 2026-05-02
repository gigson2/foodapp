import { MapPinned, PhoneCall } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { SectionContainer } from '@/components/layout/SectionContainer';

export function ContactPickupSection() {
    return (
        <SectionContainer
            description="Everything a pickup-first customer needs before placing the order."
            eyebrow="Contact + pickup"
            id="contact"
            title="Know where to go, when to arrive, and how pickup works"
        >
            <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
                <Card className="p-6">
                    <h3 className="text-2xl font-semibold">Pickup location</h3>
                    <p className="mt-4 text-base leading-8 text-muted">
                        145 Ember Avenue, River District, Chicago. Orders are prepared for pickup at the restaurant premises only.
                    </p>
                    <div className="mt-6 rounded-[1.75rem] border border-dashed border-white/10 bg-white/6 p-6">
                        <div className="flex items-center gap-3">
                            <MapPinned className="h-5 w-5 text-[color:var(--accent-700)]" />
                            <p className="font-semibold">Map-ready area</p>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-muted">
                            This section is intentionally prepared for a real embedded map once the backend company settings become live.
                        </p>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-2xl font-semibold">Call ahead</h3>
                    <div className="mt-4 flex items-start gap-3">
                        <PhoneCall className="mt-1 h-5 w-5 text-[color:var(--secondary-700)]" />
                        <div>
                            <p className="font-semibold">+1 (555) 010-3344</p>
                            <p className="mt-2 text-sm leading-7 text-muted">Use your phone number in the app so the team can identify your order quickly.</p>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3 text-sm text-muted">
                        <p>Monday - Thursday: 11:00 AM - 10:00 PM</p>
                        <p>Friday - Saturday: 11:00 AM - 11:30 PM</p>
                        <p>Sunday: 12:00 PM - 9:00 PM</p>
                    </div>
                </Card>
            </div>
        </SectionContainer>
    );
}
