import { SectionContainer } from '@/components/layout/SectionContainer';

const galleryItems = [
    {
        src: '/assets/images/image1.jpeg',
        alt: 'Mixed grilled meat on an outdoor grill at Dri Africain Traditional Grill LLC',
        frameClassName: 'md:col-span-2 xl:col-span-2',
        imageClassName: 'aspect-[16/11] object-[center_42%]',
    },
    {
        src: '/assets/images/image2.jpeg',
        alt: 'Close-up of grilled goat pieces cooking over open flame',
        imageClassName: 'aspect-[4/5] object-[center_48%] md:aspect-[5/6]',
    },
    {
        src: '/assets/images/image3.jpeg',
        alt: 'Grilled chicken plated with sliced onions from Dri Africain Traditional Grill LLC',
        imageClassName: 'aspect-[4/5] object-center md:aspect-[5/6]',
    },
    {
        src: '/assets/images/image4.jpeg',
        alt: 'Packaged grilled goat in a takeaway container with onions and tomatoes',
        imageClassName: 'aspect-[4/5] object-[center_36%] md:aspect-[5/6]',
    },
    {
        src: '/assets/images/image5.jpeg',
        alt: 'Grilled goat with onions and tomatoes over the grill',
        imageClassName: 'aspect-[4/5] object-[center_44%] md:aspect-[5/6]',
    },
    {
        src: '/assets/images/image6.jpeg',
        alt: 'Several whole grilled chickens cooking on a large grill',
        frameClassName: 'md:col-span-2 xl:col-span-2',
        imageClassName: 'aspect-[16/11] object-[center_36%]',
    },
];

export function GallerySection() {
    return (
        <SectionContainer
            align="center"
            className="pb-12 lg:pb-16"
            description="Real grill moments from the Dri Africain cooking process and packaged pickup presentation."
            eyebrow="Gallery"
            id="gallery"
            title="Real Images From The Grill And Pickup Packs"
        >
            <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
                {galleryItems.map((item) => (
                    <div
                        className={`group ui-surface ui-card-hover relative overflow-hidden rounded-[1.5rem] ${item.frameClassName ?? ''}`}
                        key={item.src}
                    >
                        <img
                            alt={item.alt}
                            className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${item.imageClassName ?? 'aspect-[4/5] object-center'}`}
                            src={item.src}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,16,15,0.7)] to-transparent opacity-70" />
                    </div>
                ))}
            </div>
        </SectionContainer>
    );
}
