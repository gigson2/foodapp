import { SiteFooter } from '@/components/common/SiteFooter';

type AdminContentShellProps = {
    children: React.ReactNode;
};

export function AdminContentShell({ children }: AdminContentShellProps) {
    return (
        <main className="min-w-0 flex-1 w-full px-4 py-5 pb-28 sm:px-6 lg:px-8 lg:pb-8">
            <div className="w-full">
                {children}
                <SiteFooter />
            </div>
        </main>
    );
}
