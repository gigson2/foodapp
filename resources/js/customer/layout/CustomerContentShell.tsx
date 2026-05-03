import type { PropsWithChildren } from 'react';

export function CustomerContentShell({ children }: PropsWithChildren) {
    return (
        <main className="min-w-0 flex-1 px-0 pb-24 pt-4 md:pb-10">
            {children}
        </main>
    );
}
