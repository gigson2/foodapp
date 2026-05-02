import { Card } from '@/components/common/Card';
import { SectionContainer } from '@/components/layout/SectionContainer';

export function AboutSection() {
    return (
        <SectionContainer
            description="A dark-mode-first ordering experience shaped for fast pickup decisions and comfortable mobile use."
            eyebrow="About Ember Table"
            id="about"
            title="Built around speed, clarity, and warm hospitality"
        >
            <div className="grid gap-5 lg:grid-cols-3">
                <Card className="p-6">
                    <h3 className="text-2xl font-semibold">Chef-driven menu</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">
                        The menu mixes expressive rice plates, grill items, soups, and light drinks with strong repeat-order appeal.
                    </p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-2xl font-semibold">Pickup-first experience</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">
                        No online payment complexity. Customers order quickly, collect at the premises, and pay cash on arrival.
                    </p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-2xl font-semibold">Ready for growth</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">
                        The UI already isolates auth, orders, notifications, and PWA behavior so Laravel APIs can replace mocks cleanly.
                    </p>
                </Card>
            </div>
        </SectionContainer>
    );
}
