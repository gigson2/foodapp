import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export function PlaceholderRoute({
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
