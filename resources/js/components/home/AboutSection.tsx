import { Button } from '@/components/common/Button';
import { SectionContainer } from '@/components/layout/SectionContainer';

export function AboutSection() {
    return (
        <div className="relative overflow-hidden">
            <SectionContainer className="relative" contentClassName="relative" id="about">
                <div className="absolute left-0 top-10 hidden w-full opacity-18 lg:block">
                    <img alt="" className="w-full object-contain" src="/assets/theme/about_shapes.png" />
                </div>

                <div className="relative mb-14 max-w-5xl lg:ml-[14%]">
                    <h2 className="text-5xl sm:text-6xl lg:text-[5rem]">
                        Traditional African Grill, Prepared with Care
                    </h2>
                </div>

                <div className="relative grid gap-8 lg:grid-cols-[0.35fr_0.32fr_0.23fr] lg:items-start">
                    <div className="overflow-hidden rounded-[1.75rem]">
                        <img
                            alt="Grilled chicken served with onions from Dri Africain Traditional Grill LLC"
                            className="h-[22rem] w-full object-cover lg:h-[34rem]"
                            src="/assets/images/image3.jpeg"
                        />
                    </div>

                    <div className="lg:pt-10">
                        <p className="text-base leading-8 text-muted">
                            Dri Africain Traditional Grill LLC focuses on professionally grilled chicken and goat prepared in large scale without losing tenderness, flavor, or quality. Every pack is neatly arranged in takeaway containers, making pickup simple, clean, and satisfying.
                        </p>
                        <p className="mt-5 text-base leading-8 text-muted">
                            The brand is built around trust, professional preparation, smoky flavor, and clean packaging that customers can rely on.
                        </p>
                        <Button className="mt-10" size="lg">
                            More About
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-[1.75rem] lg:-mt-32">
                        <img
                            alt="Packaged grilled goat ready for pickup from Dri Africain Traditional Grill LLC"
                            className="h-[18rem] w-full object-cover lg:h-[26rem]"
                            src="/assets/images/image4.jpeg"
                        />
                    </div>
                </div>
            </SectionContainer>
        </div>
    );
}
