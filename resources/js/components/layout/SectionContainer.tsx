import type { PropsWithChildren } from 'react';
import { cn } from '@/utils/classNames';

type SectionContainerProps = PropsWithChildren<{
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    className?: string;
}>;

export function SectionContainer({ children, className, description, eyebrow, id, title }: SectionContainerProps) {
    return (
        <section className={cn('section-shell scroll-mt-28 py-12 lg:py-16', className)} id={id}>
            <div className="mb-8 max-w-3xl">
                <p className="section-eyebrow">{eyebrow}</p>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">{title}</h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">{description}</p>
            </div>
            {children}
        </section>
    );
}
