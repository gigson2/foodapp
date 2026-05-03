import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Textarea } from '@/components/common/Textarea';
import { adminService } from '@/services/adminService';
import type { AdminSeoSetting } from '@/types/admin';

const seoSchema = z.object({
    page_key: z.string().trim().min(2, 'Page key is required'),
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
    keywords: z.string().trim().optional(),
    og_image: z.string().trim().optional(),
    schema_json: z
        .string()
        .trim()
        .min(2, 'Schema JSON is required')
        .refine((value) => {
            try {
                JSON.parse(value);

                return true;
            } catch {
                return false;
            }
        }, 'Schema JSON must be valid JSON'),
});

type SeoFormValues = z.infer<typeof seoSchema>;

const emptySeoValues: SeoFormValues = {
    page_key: '',
    title: '',
    description: '',
    keywords: '',
    og_image: '',
    schema_json: '{\n  "@context": "https://schema.org",\n  "@type": "Restaurant"\n}',
};

function toFormValues(setting: AdminSeoSetting): SeoFormValues {
    return {
        page_key: setting.page_key,
        title: setting.title ?? '',
        description: setting.description ?? '',
        keywords: setting.keywords ?? '',
        og_image: setting.og_image ?? '',
        schema_json: JSON.stringify(setting.schema_json ?? {}, null, 2),
    };
}

export function AdminSeoSettingsPage() {
    const queryClient = useQueryClient();
    const [selectedSetting, setSelectedSetting] = useState<AdminSeoSetting | null>(null);
    const seoQuery = useQuery({
        queryKey: ['admin', 'seo-settings'],
        queryFn: adminService.getSeoSettings,
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
    } = useForm<SeoFormValues>({
        resolver: zodResolver(seoSchema),
        defaultValues: emptySeoValues,
    });

    useEffect(() => {
        reset(selectedSetting ? toFormValues(selectedSetting) : emptySeoValues);
    }, [reset, selectedSetting]);

    const saveMutation = useMutation({
        mutationFn: (values: SeoFormValues) => {
            const payload = {
                page_key: values.page_key,
                title: values.title || null,
                description: values.description || null,
                keywords: values.keywords || null,
                og_image: values.og_image || null,
                schema_json: JSON.parse(values.schema_json),
            };

            if (selectedSetting) {
                return adminService.updateSeoSetting(selectedSetting.id, payload);
            }

            return adminService.createSeoSetting(payload);
        },
        onSuccess: async () => {
            toast.success(selectedSetting ? 'SEO setting updated' : 'SEO setting created');
            setSelectedSetting(null);
            await queryClient.invalidateQueries({ queryKey: ['admin', 'seo-settings'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: adminService.deleteSeoSetting,
        onSuccess: async (message) => {
            toast.success(message);
            setSelectedSetting(null);
            await queryClient.invalidateQueries({ queryKey: ['admin', 'seo-settings'] });
        },
    });

    const settings = seoQuery.data ?? [];

    return (
        <div className="space-y-5">
            <AdminPageHeading
                actions={
                    <Button onClick={() => setSelectedSetting(null)} variant="secondary">
                        New SEO record
                    </Button>
                }
                description="Manage page titles, descriptions, keywords, and schema JSON used by the restaurant storefront."
                title="SEO settings"
            />

            <div className="grid gap-5 xl:grid-cols-[0.44fr_0.56fr]">
                <Card className="theme-panel p-5">
                    <h2 className="text-2xl">Existing SEO records</h2>
                    {seoQuery.isLoading ? (
                        <div className="mt-6">
                            <LoadingSpinner />
                        </div>
                    ) : settings.length === 0 ? (
                        <div className="mt-6">
                            <EmptyState description="Create a page-level SEO record to start managing metadata." title="No SEO settings configured" />
                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {settings.map((setting) => (
                                <button
                                    className={`w-full rounded-[1.25rem] border p-4 text-left transition ${
                                        selectedSetting?.id === setting.id
                                            ? 'border-[color:var(--primary-500)]/28 bg-[color:var(--primary-500)]/10'
                                            : 'border-white/10 bg-white/6 hover:border-[color:var(--primary-500)]/20'
                                    }`}
                                    key={setting.id}
                                    onClick={() => setSelectedSetting(setting)}
                                    type="button"
                                >
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{setting.page_key}</p>
                                    <p className="mt-2 font-semibold">{setting.title}</p>
                                    <p className="mt-2 text-sm leading-7 text-muted">{setting.description}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </Card>

                <form onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
                    <Card className="theme-panel space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-2xl">{selectedSetting ? 'Edit SEO record' : 'Create SEO record'}</h2>
                                <p className="mt-2 text-sm leading-7 text-muted">Use valid JSON-LD in the schema field.</p>
                            </div>
                            {selectedSetting ? (
                                <Button onClick={() => deleteMutation.mutate(selectedSetting.id)} type="button" variant="ghost">
                                    Delete
                                </Button>
                            ) : null}
                        </div>

                        <Input error={errors.page_key?.message} label="Page key" {...register('page_key')} />
                        <Input label="Title" {...register('title')} />
                        <Textarea label="Description" {...register('description')} />
                        <Input label="Keywords" {...register('keywords')} />
                        <Input label="OG image path" {...register('og_image')} />
                        <Textarea className="min-h-56 font-mono text-sm" error={errors.schema_json?.message} label="Schema JSON" {...register('schema_json')} />

                        <div className="flex gap-3">
                            <Button className="flex-1" type="submit">
                                {saveMutation.isPending ? <LoadingSpinner /> : null}
                                {selectedSetting ? 'Save changes' : 'Create SEO record'}
                            </Button>
                            <Button className="flex-1" onClick={() => setSelectedSetting(null)} type="button" variant="ghost">
                                Reset form
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    );
}
