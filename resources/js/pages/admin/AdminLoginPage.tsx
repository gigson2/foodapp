import { ShieldCheck } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { AUTH_SESSION_QUERY_KEY, useAuthSession } from '@/hooks/useAuthSession';
import { adminService } from '@/services/adminService';
import { formatUsPhone, normalizeUsPhone } from '@/utils/phone';

export function AdminLoginPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading: loadingSession, user } = useAuthSession();
    const [credentials, setCredentials] = useState({ phone: '(402) 555-0100', password: 'password' });

    const loginMutation = useMutation({
        mutationFn: adminService.login,
        onSuccess: async (payload) => {
            queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, payload.user);
            if (payload.user.role !== 'admin') {
                navigate('/customer', { replace: true });
                return;
            }

            await queryClient.invalidateQueries({ queryKey: ['admin', 'me'] });
            const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/admin';
            navigate(nextPath, { replace: true });
        },
    });

    if (!loadingSession && user?.role === 'admin') {
        return <Navigate replace to="/admin" />;
    }

    return (
        <div className="section-shell flex min-h-screen items-center justify-center py-16">
            <Card className="theme-panel w-full max-w-xl p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="section-eyebrow">Admin access</p>
                        <h1 className="mt-4 text-4xl">Dri Africain admin dashboard</h1>
                        <p className="mt-4 text-base leading-8 text-muted">
                            Sign in with your admin phone number and password to manage foods, categories, pickup orders, visitors, SEO, and company operations.
                        </p>
                        <p className="mt-3 text-sm leading-7 text-muted">
                            This is real Laravel admin authentication. The public storefront account modal is still a local pickup identity flow and does not sign you into the admin system.
                        </p>
                    </div>
                    <ThemeToggle />
                </div>

                <form
                    className="mt-8 space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        loginMutation.mutate({
                            login: normalizeUsPhone(credentials.phone),
                            password: credentials.password,
                        });
                    }}
                >
                    <Input
                        autoComplete="tel-national"
                        inputMode="tel"
                        label="Admin phone number"
                        maxLength={14}
                        onChange={(event) =>
                            setCredentials((current) => ({ ...current, phone: formatUsPhone(event.target.value) }))
                        }
                        placeholder="(402) 555-0100"
                        value={credentials.phone}
                    />
                    <Input
                        autoComplete="current-password"
                        label="Password"
                        onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                        placeholder="Enter password"
                        type="password"
                        value={credentials.password}
                    />

                    {loginMutation.isError ? (
                        <p className="text-sm text-[color:var(--primary-600)]">
                            {axios.isAxiosError(loginMutation.error)
                                ? (loginMutation.error.response?.data?.message as string | undefined) ?? 'Unable to sign in with those credentials.'
                                : loginMutation.error instanceof Error
                                    ? loginMutation.error.message
                                    : 'Unable to sign in with those credentials.'}
                        </p>
                    ) : null}

                    <Button className="w-full" type="submit">
                        <ShieldCheck className="h-4 w-4" />
                        Sign in to admin
                    </Button>
                </form>

                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                    Demo admin credentials seeded locally:
                    <br />
                    `(402) 555-0100` / `password`
                </div>
            </Card>
        </div>
    );
}
