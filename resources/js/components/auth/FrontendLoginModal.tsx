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
    phone: z.string().trim().min(1, 'Phone number is required').refine(isValidUsPhone, 'Enter a valid USA phone number'),
    password: z.string().trim().min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string().trim().min(8, 'Please confirm your password'),
}).refine((value) => value.password === value.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type FrontendLoginModalProps = {
    errorMessage?: string | null;
    isOpen: boolean;
    loading?: boolean;
    onClose: () => void;
    onLogin: (values: LoginFormValues) => Promise<void> | void;
    onRegister: (values: RegisterFormValues) => Promise<void> | void;
};

export function FrontendLoginModal({
    errorMessage,
    isOpen,
    loading = false,
    onClose,
    onLogin,
    onRegister,
}: FrontendLoginModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const [mode, setMode] = useState<'login' | 'register'>('login');
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
        handleSubmit: handleRegisterSubmit,
        register: registerField,
        setValue: setRegisterValue,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
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

    const content = (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-[1.4rem] p-1" style={{ background: 'var(--ui-surface-muted)' }}>
                <button className={`rounded-[1.1rem] px-4 py-2 text-sm font-semibold transition ${mode === 'login' ? 'ui-active-nav text-[color:var(--primary-500)]' : 'text-muted'}`} onClick={() => setMode('login')} type="button">Sign in</button>
                <button className={`rounded-[1.1rem] px-4 py-2 text-sm font-semibold transition ${mode === 'register' ? 'ui-active-nav text-[color:var(--primary-500)]' : 'text-muted'}`} onClick={() => setMode('register')} type="button">Register</button>
            </div>

            {mode === 'login' ? (
                <form
                    className="space-y-4"
                    onSubmit={handleLoginSubmit(async (values) => {
                        await onLogin(values);
                    })}
                >
                    <Input autoComplete="tel-national" error={errors.phone?.message} inputMode="tel" label="Phone number" maxLength={14} placeholder="(402) 555-0100" {...phoneField} />
                    <Input autoComplete="current-password" error={errors.password?.message} label="Password" placeholder="Enter your password" type="password" {...register('password')} />
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                        Welcome back! Sign in to track your orders, leave reviews, and enjoy a faster checkout experience.
                    </div>
                    {errorMessage ? <p className="text-sm text-[color:var(--primary-600)]">{errorMessage}</p> : null}
                    <Button className="w-full" disabled={loading} type="submit">
                        {loading ? <LoadingSpinner /> : null}
                        Sign in
                    </Button>
                </form>
            ) : (
                <form
                    className="space-y-4"
                    onSubmit={handleRegisterSubmit(async (values) => {
                        await onRegister(values);
                    })}
                >
                    <Input autoComplete="name" error={registerErrors.name?.message} label="Full name" placeholder="Enter your full name" {...registerField('name')} />
                    <Input autoComplete="tel-national" error={registerErrors.phone?.message} inputMode="tel" label="Phone number" maxLength={14} placeholder="(402) 555-0100" {...registerPhoneField} />
                    <Input autoComplete="new-password" error={registerErrors.password?.message} label="Password" placeholder="Create a password" type="password" {...registerField('password')} />
                    <Input autoComplete="new-password" error={registerErrors.passwordConfirmation?.message} label="Confirm password" placeholder="Confirm your password" type="password" {...registerField('passwordConfirmation')} />
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                        New customers can register before placing any order.
                        <br />
                        Registration uses your full name, USA phone number, and password.
                    </div>
                    {errorMessage ? <p className="text-sm text-[color:var(--primary-600)]">{errorMessage}</p> : null}
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
