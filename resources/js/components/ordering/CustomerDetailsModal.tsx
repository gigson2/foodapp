import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const customerSchema = z.object({
    name: z.string().min(2, 'Full name is required'),
    phone: z.string().min(7, 'Phone number is required'),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

type CustomerDetailsModalProps = {
    isOpen: boolean;
    loading?: boolean;
    mode: 'order' | 'account';
    onClose: () => void;
    onSubmit: (values: CustomerFormValues) => Promise<void> | void;
};

export function CustomerDetailsModal({
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
            name: '',
            phone: '',
        },
    });

    const content = (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
                await onSubmit(values);
                reset();
            })}
        >
            <Input autoComplete="name" error={errors.name?.message} label="Full name" placeholder="Enter your full name" {...register('name')} />
            <Input autoComplete="tel" error={errors.phone?.message} label="Phone number" placeholder="Enter your phone number" {...register('phone')} />

            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                Enter your details so the restaurant can contact you when your food is ready.
                <br />
                Your phone number will be used to identify your orders.
            </div>

            <Button className="w-full" type="submit">
                {loading ? <LoadingSpinner /> : null}
                {mode === 'order' ? 'Continue to Place Order' : 'Save and Continue'}
            </Button>
        </form>
    );

    const title = mode === 'order' ? 'Your pickup details' : 'Sign in with your phone';
    const description =
        mode === 'order'
            ? 'Add your name and phone number before the restaurant receives your pickup order.'
            : 'Use your phone number as your simple identity for this phase. The backend can later upgrade this flow to OTP.';

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
