import { Navigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthSession } from '@/hooks/useAuthSession';

export function AdminRouteLayout() {
    const location = useLocation();
    const { isLoading, user } = useAuthSession();

    if (isLoading) {
        return (
            <div className="section-shell flex min-h-screen items-center justify-center py-24">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return <Navigate replace state={{ from: location }} to="/admin/login" />;
    }

    if (user.role !== 'admin') {
        return (
            <div className="section-shell flex min-h-screen items-center justify-center py-16">
                <Card className="theme-panel w-full max-w-xl p-6 sm:p-8">
                    <h1 className="text-4xl">Admin role required</h1>
                    <p className="mt-4 text-base leading-8 text-muted">
                        This account is authenticated, but it does not have the admin role required for the operations dashboard.
                    </p>
                </Card>
            </div>
        );
    }

    return <AdminLayout currentUser={user} />;
}
