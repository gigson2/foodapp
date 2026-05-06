import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { formatUsPhone, isValidUsPhone } from '@/utils/phone';

const optionalEmailSchema = z.union([
    z.literal(''),
    z.string().trim().email('Enter a valid email address'),
]);

const loginSchema = z.object({
    phone: z
        .string()
        .trim()
        .min(1, 'Phone number is required')
        .refine(isValidUsPhone, 'Enter a valid USA phone number'),
    password: z.string().trim().min(8, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
const registerSchema = z.object({
    name: z.string().trim().min(2, 'Full name is required'),
    email: optionalEmailSchema,
    phone: z.string().trim().min(1, 'Phone number is required').refine(isValidUsPhone, 'Enter a valid USA phone number'),
    password: z.string().trim().min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string().trim().min(8, 'Please confirm your password'),
}).refine((value) => value.password === value.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type PasswordRecoveryLookup = 'email';

type FrontendLoginModalProps = {
    errorMessage?: string | null;
    isOpen: boolean;
    loading?: boolean;
    onClose: () => void;
    onLogin: (values: LoginFormValues) => Promise<void> | void;
    onRequestPasswordReset: (values: { lookup: PasswordRecoveryLookup; login: string }) => Promise<void> | void;
    onRegister: (values: RegisterFormValues) => Promise<void> | void;
    onResetPassword: (values: {
        lookup: PasswordRecoveryLookup;
        login: string;
        code: string;
        password: string;
        passwordConfirmation: string;
    }) => Promise<void> | void;
    onSwitchToLogin?: () => void;
};

export function FrontendLoginModal({
    errorMessage,
    isOpen,
    loading = false,
    onClose,
    onLogin,
    onRequestPasswordReset,
    onRegister,
    onResetPassword,
    onSwitchToLogin,
}: FrontendLoginModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
    const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
    const [resetIdentifier, setResetIdentifier] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [resetPassword, setResetPassword] = useState('');
    const [resetPasswordConfirmation, setResetPasswordConfirmation] = useState('');
    const [resetValidationMessage, setResetValidationMessage] = useState<string | null>(null);
    const {
        formState: { errors },
        handleSubmit: handleLoginSubmit,
        register,
        setValue,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: '',
            password: '',
        },
    });
    const {
        formState: { errors: registerErrors },
        getValues: getRegisterValues,
        handleSubmit: handleRegisterSubmit,
        register: registerField,
        setValue: setRegisterValue,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: undefined,
            phone: '',
            password: '',
            passwordConfirmation: '',
        },
    });

    const phoneField = register('phone', {
        onChange: (event) => {
            setValue('phone', formatUsPhone(event.target.value), {
                shouldDirty: true,
                shouldValidate: true,
            });
        },
    });
    const registerPhoneField = registerField('phone', {
        onChange: (event) => {
            setRegisterValue('phone', formatUsPhone(event.target.value), {
                shouldDirty: true,
                shouldValidate: true,
            });
        },
    });

    const openResetMode = () => {
        setMode('reset');
        setResetStep('request');
        setResetIdentifier('');
        setResetCode('');
        setResetPassword('');
        setResetPasswordConfirmation('');
        setResetValidationMessage(null);
    };

    const handleResetIdentifierChange = (value: string) => {
        setResetValidationMessage(null);
        setResetIdentifier(value.trimStart());
    };

    const handlePasswordResetRequest = async () => {
        const trimmedIdentifier = resetIdentifier.trim();

        if (!z.string().trim().email().safeParse(trimmedIdentifier).success) {
            setResetValidationMessage('Enter a valid email address.');
            return;
        }

        setResetValidationMessage(null);
        await onRequestPasswordReset({
            lookup: 'email',
            login: trimmedIdentifier,
        });
        setResetStep('verify');
    };

    const handlePasswordReset = async () => {
        const trimmedCode = resetCode.replace(/\D+/g, '');

        if (trimmedCode.length !== 6) {
            setResetValidationMessage('Enter the 6-digit reset code.');
            return;
        }

        if (resetPassword.trim().length < 8) {
            setResetValidationMessage('Password must be at least 8 characters.');
            return;
        }

        if (resetPassword !== resetPasswordConfirmation) {
            setResetValidationMessage('Passwords do not match.');
            return;
        }

        setResetValidationMessage(null);

        await onResetPassword({
            lookup: 'email',
            login: resetIdentifier.trim(),
            code: trimmedCode,
            password: resetPassword,
            passwordConfirmation: resetPasswordConfirmation,
        });

        setMode('login');
        setResetStep('request');
        setResetCode('');
        setResetPassword('');
        setResetPasswordConfirmation('');
        setResetValidationMessage(null);
    };

    const content = (
        <div className="space-y-4">
            {mode === 'reset' ? (
                <div className="flex items-center justify-between rounded-[1.4rem] p-1" style={{ background: 'var(--ui-surface-muted)' }}>
                    <span className="px-4 py-2 text-sm font-semibold text-(--primary-500)">Reset password</span>
                    <button className="rounded-[1.1rem] px-4 py-2 text-sm font-semibold text-muted transition" onClick={() => {
                        setMode('login');
                        setResetStep('request');
                        setResetValidationMessage(null);
                    }} type="button">
                        Back to sign in
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 rounded-[1.4rem] p-1" style={{ background: 'var(--ui-surface-muted)' }}>
                    <button className={`rounded-[1.1rem] px-4 py-2 text-sm font-semibold transition ${mode === 'login' ? 'ui-active-nav text-(--primary-500)' : 'text-muted'}`} onClick={() => setMode('login')} type="button">Sign in</button>
                    <button className={`rounded-[1.1rem] px-4 py-2 text-sm font-semibold transition ${mode === 'register' ? 'ui-active-nav text-(--primary-500)' : 'text-muted'}`} onClick={() => setMode('register')} type="button">Register</button>
                </div>
            )}

            {mode === 'login' ? (
                <form
                    className="space-y-4"
                    onSubmit={handleLoginSubmit(async (values) => {
                        await onLogin(values);
                    })}
                >
                    <Input autoComplete="tel-national" error={errors.phone?.message} inputMode="tel" label="Phone number" maxLength={14} placeholder="(402) 555-0100" {...phoneField} />
                    <Input autoComplete="current-password" error={errors.password?.message} label="Password" placeholder="Enter your password" type="password" {...register('password')} />
                    <div className="rounded-3xl border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                        Welcome back! Sign in to track your orders, leave reviews, and enjoy a faster checkout experience.
                    </div>
                    {errorMessage ? <p className="text-sm text-(--primary-600)">{errorMessage}</p> : null}
                    <Button className="w-full" disabled={loading} type="submit">
                        {loading ? <LoadingSpinner /> : null}
                        Sign in
                    </Button>
                    <button className="text-sm font-semibold text-(--primary-500)" onClick={openResetMode} type="button">
                        Forgot your password?
                    </button>
                </form>
            ) : mode === 'reset' ? (
                <div className="space-y-4">
                    {resetStep === 'request' ? (
                        <div className="space-y-4">
                            <Input
                                autoComplete="email"
                                inputMode="email"
                                label="Email address"
                                onChange={(event) => handleResetIdentifierChange(event.target.value)}
                                placeholder="you@example.com"
                                value={resetIdentifier}
                            />
                            <div className="rounded-3xl border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                                Enter your account email address. We will send a 6-digit reset code there.
                            </div>
                            {resetValidationMessage ? <p className="text-sm text-(--primary-600)">{resetValidationMessage}</p> : null}
                            {errorMessage ? <p className="text-sm text-(--primary-600)">{errorMessage}</p> : null}
                            <Button className="w-full" disabled={loading} onClick={handlePasswordResetRequest} type="button">
                                {loading ? <LoadingSpinner /> : null}
                                Send reset code
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-3xl border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                                Enter the 6-digit code sent to the recovery email on your account, then choose a new password.
                            </div>
                            <Input label="Email address" onChange={(event) => handleResetIdentifierChange(event.target.value)} value={resetIdentifier} />
                            <Input inputMode="numeric" label="Reset code" maxLength={6} onChange={(event) => {
                                setResetValidationMessage(null);
                                setResetCode(event.target.value.replace(/\D+/g, '').slice(0, 6));
                            }} placeholder="123456" value={resetCode} />
                            <Input autoComplete="new-password" label="New password" onChange={(event) => {
                                setResetValidationMessage(null);
                                setResetPassword(event.target.value);
                            }} placeholder="Create a new password" type="password" value={resetPassword} />
                            <Input autoComplete="new-password" label="Confirm new password" onChange={(event) => {
                                setResetValidationMessage(null);
                                setResetPasswordConfirmation(event.target.value);
                            }} placeholder="Confirm your new password" type="password" value={resetPasswordConfirmation} />
                            {resetValidationMessage ? <p className="text-sm text-(--primary-600)">{resetValidationMessage}</p> : null}
                            {errorMessage ? <p className="text-sm text-(--primary-600)">{errorMessage}</p> : null}
                            <div className="flex gap-3">
                                <Button className="flex-1" disabled={loading} onClick={handlePasswordReset} type="button">
                                    {loading ? <LoadingSpinner /> : null}
                                    Reset password
                                </Button>
                                <Button className="flex-1" disabled={loading} onClick={() => {
                                    setResetStep('request');
                                    setResetCode('');
                                    setResetPassword('');
                                    setResetPasswordConfirmation('');
                                    setResetValidationMessage(null);
                                }} type="button" variant="ghost">
                                    Start over
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <form
                    className="space-y-4"
                    onSubmit={handleRegisterSubmit(async (values) => {
                        await onRegister(values);
                    })}
                >
                    <Input autoComplete="name" error={registerErrors.name?.message} label="Full name" placeholder="Enter your full name" {...registerField('name')} />
                    <Input autoComplete="email" error={registerErrors.email?.message} label="Email address (used for password recovery)" placeholder="you@example.com" type="email" {...registerField('email')} />
                    <Input autoComplete="tel-national" error={registerErrors.phone?.message} inputMode="tel" label="Phone number" maxLength={14} placeholder="(402) 555-0100" {...registerPhoneField} />
                    <Input autoComplete="new-password" error={registerErrors.password?.message} label="Password" placeholder="Create a password" type="password" {...registerField('password')} />
                    <Input autoComplete="new-password" error={registerErrors.passwordConfirmation?.message} label="Confirm password" placeholder="Confirm your password" type="password" {...registerField('passwordConfirmation')} />
                    <div className="rounded-3xl border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                        New customers can register before placing any order.
                        <br />
                        Registration uses your full name, USA phone number, password, and an optional recovery email.
                    </div>
                    {errorMessage ? (
                        <div className="space-y-2">
                            <p className="text-sm text-(--primary-600)">{errorMessage}</p>
                            {onSwitchToLogin ? (
                                <button
                                    className="text-sm font-semibold text-(--primary-500)"
                                    onClick={() => {
                                        setValue('phone', getRegisterValues('phone'));
                                        setMode('login');
                                        onSwitchToLogin();
                                    }}
                                    type="button"
                                >
                                    Sign in instead &rarr;
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                    <Button className="w-full" disabled={loading} type="submit">
                        {loading ? <LoadingSpinner /> : null}
                        Create account
                    </Button>
                </form>
            )}
        </div>
    );

    if (isMobile) {
        return (
            <BottomSheet
                description="Sign in to manage your orders and enjoy a personalised experience."
                isOpen={isOpen}
                onClose={onClose}
                panelClassName="max-w-[min(100%,28rem)]"
                title="Sign in"
            >
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal
            description="Sign in to manage your orders and enjoy a personalised experience."
            isOpen={isOpen}
            onClose={onClose}
            title="Sign in"
        >
            {content}
        </Modal>
    );
}
