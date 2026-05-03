import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Textarea } from '@/components/common/Textarea';
import { adminService } from '@/services/adminService';

const companySchema = z.object({
    company_name: z.string().trim().min(2, 'Company name is required'),
    tagline: z.string().trim().optional(),
    about: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
    address: z.string().trim().optional(),
    friday: z.string().trim().optional(),
    saturday: z.string().trim().optional(),
    ordering_cutoff: z.string().trim().optional(),
    logo: z.string().trim().optional(),
    favicon: z.string().trim().optional(),
    instagram: z.string().trim().optional(),
    facebook: z.string().trim().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export function AdminCompanySettingsPage() {
    const queryClient = useQueryClient();
    const settingsQuery = useQuery({
        queryKey: ['admin', 'company-settings'],
        queryFn: adminService.getCompanySettings,
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            company_name: '',
            tagline: '',
            about: '',
            phone: '',
            email: '',
            address: '',
            friday: '',
            saturday: '',
            ordering_cutoff: '',
            logo: '',
            favicon: '',
            instagram: '',
            facebook: '',
        },
    });

    useEffect(() => {
        if (!settingsQuery.data) {
            return;
        }

        reset({
            company_name: settingsQuery.data.company_name,
            tagline: settingsQuery.data.tagline ?? '',
            about: settingsQuery.data.about ?? '',
            phone: settingsQuery.data.phone ?? '',
            email: settingsQuery.data.email ?? '',
            address: settingsQuery.data.address ?? '',
            friday: settingsQuery.data.opening_hours?.friday ?? '',
            saturday: settingsQuery.data.opening_hours?.saturday ?? '',
            ordering_cutoff: settingsQuery.data.opening_hours?.ordering_cutoff ?? '',
            logo: settingsQuery.data.logo ?? '',
            favicon: settingsQuery.data.favicon ?? '',
            instagram: settingsQuery.data.social_links?.instagram ?? '',
            facebook: settingsQuery.data.social_links?.facebook ?? '',
        });
    }, [reset, settingsQuery.data]);

    const updateMutation = useMutation({
        mutationFn: (values: CompanyFormValues) =>
            adminService.updateCompanySettings({
                id: settingsQuery.data?.id ?? 0,
                company_name: values.company_name,
                tagline: values.tagline || null,
                about: values.about || null,
                phone: values.phone || null,
                email: values.email || null,
                address: values.address || null,
                opening_hours: {
                    friday: values.friday || '',
                    saturday: values.saturday || '',
                    ordering_cutoff: values.ordering_cutoff || '',
                },
                logo: values.logo || null,
                favicon: values.favicon || null,
                social_links: {
                    instagram: values.instagram || null,
                    facebook: values.facebook || null,
                },
            }),
        onSuccess: async () => {
            toast.success('Company settings updated');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin', 'company-settings'] }),
                queryClient.invalidateQueries({ queryKey: ['public-company-settings'] }),
            ]);
        },
    });

    if (settingsQuery.isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <AdminPageHeading
                description="Maintain the business profile, pickup address, opening hours, and public-facing restaurant identity."
                title="Company settings"
            />

            <form className="grid gap-5 xl:grid-cols-[0.62fr_0.38fr]" onSubmit={handleSubmit((values) => updateMutation.mutate(values))}>
                <Card className="theme-panel space-y-4 p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input error={errors.company_name?.message} label="Company name" {...register('company_name')} />
                        <Input label="Tagline" {...register('tagline')} />
                    </div>
                    <Textarea label="About" {...register('about')} />
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input label="Phone" {...register('phone')} />
                        <Input error={errors.email?.message} label="Email" {...register('email')} />
                    </div>
                    <Textarea label="Address" {...register('address')} />
                    <div className="grid gap-4 md:grid-cols-3">
                        <Input label="Friday schedule" {...register('friday')} />
                        <Input label="Saturday schedule" {...register('saturday')} />
                        <Input label="Ordering cutoff" {...register('ordering_cutoff')} />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input label="Logo path" {...register('logo')} />
                        <Input label="Favicon path" {...register('favicon')} />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input label="Instagram URL" {...register('instagram')} />
                        <Input label="Facebook URL" {...register('facebook')} />
                    </div>
                </Card>

                <Card className="theme-panel space-y-4 p-5">
                    <h2 className="text-2xl">Publish updates</h2>
                    <p className="text-sm leading-7 text-muted">
                        These values feed the public storefront company settings endpoint, so changes here update the live customer experience.
                    </p>
                    <Button className="w-full" type="submit">
                        {updateMutation.isPending ? <LoadingSpinner /> : null}
                        Save company settings
                    </Button>
                </Card>
            </form>
        </div>
    );
}
