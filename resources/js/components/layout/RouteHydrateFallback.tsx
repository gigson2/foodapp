import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function RouteHydrateFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-(--background-50) text-(--foreground-900)">
            <div className="flex items-center gap-3 text-sm font-medium">
                <LoadingSpinner />
                <span>Loading page...</span>
            </div>
        </div>
    );
}
