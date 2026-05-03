import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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

type FrontendLoginModalProps = {
    errorMessage?: string | null;
    isOpen: boolean;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (values: LoginFormValues) => Promise<void> | void;
};

export function FrontendLoginModal({
    errorMessage,
    isOpen,
    loading = false,
    onClose,
    onSubmit,
}: FrontendLoginModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const {
        formState: { errors },
        handleSubmit,
        register,
        setValue,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: '',
            password: '',
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

    const content = (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
                await onSubmit(values);
            })}
        >
            <Input
                autoComplete="tel-national"
                error={errors.phone?.message}
                inputMode="tel"
                label="Phone number"
                maxLength={14}
                placeholder="(402) 555-0100"
                {...phoneField}
            />
            <Input
                autoComplete="current-password"
                error={errors.password?.message}
                label="Password"
                placeholder="Enter your password"
                type="password"
                {...register('password')}
            />

            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                Sign in from the main site with your phone number and password.
                <br />
                Admin users will be redirected to the admin dashboard. Customer users stay on the storefront and can open their account dashboard when needed.
            </div>

            {errorMessage ? <p className="text-sm text-[color:var(--primary-600)]">{errorMessage}</p> : null}

            <Button className="w-full" type="submit">
                {loading ? <LoadingSpinner /> : null}
                Sign in
            </Button>
        </form>
    );

    if (isMobile) {
        return (
            <BottomSheet
                description="Use your phone number and password to access your account or admin dashboard."
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
            description="Use your phone number and password to access your account or admin dashboard."
            isOpen={isOpen}
            onClose={onClose}
            title="Sign in"
        >
            {content}
        </Modal>
    );
}
