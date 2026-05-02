import type { PropsWithChildren } from 'react';
import { cn } from '@/utils/classNames';

type SectionContainerProps = PropsWithChildren<{
    id: string;
    eyebrow?: string;
    title?: string;
    description?: string;
    className?: string;
    contentClassName?: string;
    align?: 'left' | 'center';
    tone?: 'default' | 'inverse';
}>;

export function SectionContainer({
    children,
    className,
    contentClassName,
    description,
    eyebrow,
    id,
    title,
    align = 'left',
    tone = 'default',
}: SectionContainerProps) {
    return (
        <section className={cn('section-shell scroll-mt-28 py-20 lg:py-[9.5rem]', className)} id={id}>
            {(eyebrow || title || description) ? (
                <div className={cn('mb-12', align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl')}>
                    {eyebrow ? (
                        <p className={cn('section-eyebrow', tone === 'inverse' && 'text-[color:var(--accent-300)]')}>
                            {eyebrow}
                        </p>
                    ) : null}
                    {title ? (
                        <h2 className={cn('mt-4 text-4xl sm:text-5xl lg:text-[3.5rem]', tone === 'inverse' && 'text-white')}>
                            {title}
                        </h2>
                    ) : null}
                    {description ? (
                        <p
                            className={cn(
                                'mt-4 text-base leading-8 text-muted',
                                tone === 'inverse' && 'text-white/80',
                            )}
                        >
                            {description}
                        </p>
                    ) : null}
                </div>
            ) : null}
            <div className={contentClassName}>{children}</div>
        </section>
    );
}
