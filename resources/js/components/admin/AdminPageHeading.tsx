import type { ReactNode } from 'react';
import { Card } from '@/components/common/Card';

type AdminPageHeadingProps = {
    actions?: ReactNode;
    description: string;
    eyebrow?: string;
    title: string;
};

export function AdminPageHeading({ actions, description, eyebrow = 'Admin workspace', title }: AdminPageHeadingProps) {
    return (
        <Card className="theme-panel p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="section-eyebrow">{eyebrow}</p>
                    <h1 className="mt-4 text-4xl sm:text-5xl">{title}</h1>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{description}</p>
                </div>
                {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>
        </Card>
    );
}
