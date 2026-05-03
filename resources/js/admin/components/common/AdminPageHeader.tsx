type AdminPageHeaderProps = {
    title: string;
    description: string;
    actions?: React.ReactNode;
};

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <p className="section-eyebrow">Admin dashboard</p>
                <h1 className="mt-4 text-4xl sm:text-5xl">{title}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                    {description}
                </p>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
    );
}
