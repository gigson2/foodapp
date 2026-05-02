import { createBrowserRouter, Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { AppShell } from '@/components/layout/AppShell';

function PlaceholderRoute({
    description,
    title,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="section-shell flex min-h-screen items-center justify-center py-16">
            <Card className="max-w-2xl p-8 text-center sm:p-10">
                <p className="section-eyebrow justify-center">Placeholder route</p>
                <h1 className="mt-5 text-4xl font-semibold">{title}</h1>
                <p className="mt-4 text-base leading-8 text-muted">{description}</p>
                <Link className="mt-8 inline-flex" to="/">
                    <Button>Return to public app</Button>
                </Link>
            </Card>
        </div>
    );
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
    },
    {
        path: '/customer',
        element: (
            <PlaceholderRoute
                description="The full customer dashboard is intentionally deferred. The current phase focuses on the public ordering flow and account modal experience."
                title="Customer dashboard placeholder"
            />
        ),
    },
    {
        path: '/admin',
        element: (
            <PlaceholderRoute
                description="The admin dashboard is intentionally deferred. This route is reserved for the later backend and operations interface."
                title="Admin dashboard placeholder"
            />
        ),
    },
]);
