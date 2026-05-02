import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const customerSchema = z.object({
    name: z.string().trim().min(2, 'Full name is required'),
    phone: z
        .string()
        .trim()
        .min(7, 'Phone number is required')
        .regex(/^[\d+\s()-]+$/, 'Enter a valid phone number'),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

type CustomerDetailsModalProps = {
    initialValues?: Partial<CustomerFormValues>;
    isOpen: boolean;
    loading?: boolean;
    mode: 'order' | 'account';
    onClose: () => void;
    onSubmit: (values: CustomerFormValues) => Promise<void> | void;
};

export function CustomerDetailsModal({
    initialValues,
    isOpen,
    loading = false,
    mode,
    onClose,
    onSubmit,
}: CustomerDetailsModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
    } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: initialValues?.name ?? '',
            phone: initialValues?.phone ?? '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialValues?.name ?? '',
                phone: initialValues?.phone ?? '',
            });
        }
    }, [initialValues?.name, initialValues?.phone, isOpen, reset]);

    const content = (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
                await onSubmit(values);
            })}
        >
            <Input autoComplete="name" error={errors.name?.message} label="Full name" placeholder="Enter your full name" {...register('name')} />
            <Input autoComplete="tel" error={errors.phone?.message} label="Phone number" placeholder="Enter your phone number" {...register('phone')} />

            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                Enter your details so we can contact you when your grilled order is ready for pickup.
                <br />
                Your phone number will be used to identify your orders.
            </div>

            <Button className="w-full" type="submit">
                {loading ? <LoadingSpinner /> : null}
                {mode === 'order' ? 'Continue to Place Order' : 'Continue'}
            </Button>
        </form>
    );

    const title = mode === 'order' ? 'Your pickup details' : 'Enter your account details';
    const description =
        mode === 'order'
            ? 'Save your name and phone so Dri Africain can prepare this pickup order.'
            : 'This simple identity flow is ready to upgrade to OTP or SMS verification later.';

    if (isMobile) {
        return (
            <BottomSheet description={description} isOpen={isOpen} onClose={onClose} title={title}>
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal description={description} isOpen={isOpen} onClose={onClose} title={title}>
            {content}
        </Modal>
    );
}
