import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuthSession } from '@/hooks/useAuthSession';

type RequireAdminProps = {
    children: (user: NonNullable<ReturnType<typeof useAuthSession>['user']>) => React.ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
    const { isLoading, user } = useAuthSession();

    // Frontend checks improve UX only. Laravel auth middleware and policies remain the final authority.
    if (isLoading) {
        return (
            <div className="section-shell flex min-h-screen items-center justify-center py-24">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return <Navigate replace to="/admin/login" />;
    }

    if (user.role !== 'admin') {
        return <Navigate replace to="/customer" />;
    }

    return <>{children(user)}</>;
}
