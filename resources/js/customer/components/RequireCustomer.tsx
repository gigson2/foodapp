import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuthSession } from '@/hooks/useAuthSession';

type RequireCustomerProps = {
    children: (user: NonNullable<ReturnType<typeof useAuthSession>['user']>) => ReactNode;
};

export function RequireCustomer({ children }: RequireCustomerProps) {
    const { isLoading, user } = useAuthSession();

    if (isLoading) {
        return (
            <div className="section-shell flex min-h-screen items-center justify-center py-24">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return <Navigate replace to="/" />;
    }

    if (user.role === 'admin') {
        return <Navigate replace to="/admin" />;
    }

    if (user.role !== 'customer') {
        return <Navigate replace to="/" />;
    }

    return <>{children(user)}</>;
}
