import { AlertTriangle } from 'lucide-react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export function RouteErrorBoundary() {
    const error = useRouteError();
    const message = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : error instanceof Error
          ? error.message
          : 'An unexpected application error occurred.';

    return (
        <div className="section-shell flex min-h-screen items-center justify-center py-16">
            <Card className="max-w-2xl p-8 text-center sm:p-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--primary-500)]/16 text-[color:var(--primary-900)]">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <h1 className="mt-5 text-4xl font-semibold">Application error</h1>
                <p className="mt-4 text-base leading-8 text-muted">{message}</p>
                <Link className="mt-8 inline-flex" to="/">
                    <Button>Return to home</Button>
                </Link>
            </Card>
        </div>
    );
}
