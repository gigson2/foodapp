type AdminContentShellProps = {
    children: React.ReactNode;
};

export function AdminContentShell({ children }: AdminContentShellProps) {
    return (
        <main className="min-w-0 px-4 py-5 pb-28 sm:px-6 lg:px-8 lg:pb-8">
            <div className="mx-auto max-w-[1700px]">{children}</div>
        </main>
    );
}
