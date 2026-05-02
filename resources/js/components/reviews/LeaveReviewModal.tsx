import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { Textarea } from '@/components/common/Textarea';
import { StarRatingInput } from '@/components/reviews/StarRatingInput';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Food } from '@/types';

const reviewSchema = z.object({
    name: z.string().trim().min(2, 'Name is required'),
    phone: z
        .string()
        .trim()
        .min(7, 'Phone number is required')
        .regex(/^[\d+\s()-]+$/, 'Enter a valid phone number'),
    foodName: z.string().optional(),
    rating: z.number().min(1, 'Rating is required').max(5),
    message: z.string().trim().min(10, 'Review message is required'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

type LeaveReviewModalProps = {
    foods: Food[];
    initialValues?: Partial<ReviewFormValues>;
    isOpen: boolean;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (values: ReviewFormValues) => Promise<{ success: boolean; error?: string }>;
};

export function LeaveReviewModal({
    foods,
    initialValues,
    isOpen,
    loading = false,
    onClose,
    onSubmit,
}: LeaveReviewModalProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
        setValue,
        watch,
    } = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            name: initialValues?.name ?? '',
            phone: initialValues?.phone ?? '',
            foodName: initialValues?.foodName ?? '',
            rating: initialValues?.rating ?? 0,
            message: initialValues?.message ?? '',
        },
    });

    const rating = watch('rating');

    useEffect(() => {
        if (isOpen) {
            setSubmitError(null);
            reset({
                name: initialValues?.name ?? '',
                phone: initialValues?.phone ?? '',
                foodName: '',
                rating: 0,
                message: '',
            });
        }
    }, [initialValues?.name, initialValues?.phone, isOpen, reset]);

    const content = (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
                setSubmitError(null);
                const result = await onSubmit(values);

                if (! result.success) {
                    setSubmitError(result.error ?? 'Unable to submit review.');
                    return;
                }

                reset({
                    name: initialValues?.name ?? '',
                    phone: initialValues?.phone ?? '',
                    foodName: '',
                    rating: 0,
                    message: '',
                });
            })}
        >
            <Input autoComplete="name" error={errors.name?.message} label="Full name" placeholder="Enter your full name" {...register('name')} />
            <Input autoComplete="tel" error={errors.phone?.message} label="Phone number" placeholder="Enter your phone number" {...register('phone')} />

            <label className="block space-y-2">
                <span className="text-sm font-medium text-[color:var(--text-950)]">Food ordered</span>
                <select
                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/7 px-4 py-3 text-[color:var(--text-950)] outline-none transition focus:border-[color:var(--accent-500)]/40 focus:bg-white/10"
                    {...register('foodName')}
                >
                    <option value="">Select a grill item</option>
                    {foods.map((food) => (
                        <option key={food.id} value={food.name}>
                            {food.name}
                        </option>
                    ))}
                </select>
            </label>

            <StarRatingInput onChange={(nextRating) => setValue('rating', nextRating, { shouldValidate: true })} value={rating} />
            {errors.rating?.message ? <p className="text-sm text-[color:var(--primary-800)]">{errors.rating.message}</p> : null}

            <Textarea error={errors.message?.message} label="Review" placeholder="Share your pickup and grill experience" {...register('message')} />

            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-muted">
                Only customers who have ordered from Dri Africain Traditional Grill LLC can leave a review.
            </div>

            {submitError ? <p className="text-sm text-[color:var(--primary-800)]">{submitError}</p> : null}

            <Button className="w-full" type="submit">
                {loading ? <LoadingSpinner /> : null}
                Submit review
            </Button>
        </form>
    );

    if (isMobile) {
        return (
            <BottomSheet
                description="Your review will be submitted for approval before it appears publicly."
                isOpen={isOpen}
                onClose={onClose}
                title="Leave a review"
            >
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal
            description="Your review will be submitted for approval before it appears publicly."
            isOpen={isOpen}
            onClose={onClose}
            title="Leave a review"
        >
            {content}
        </Modal>
    );
}
