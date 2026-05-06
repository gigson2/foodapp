import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminImageUploadField } from '@/admin/components/common/AdminImageUploadField';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminSettingsService, type AdminCompanySettingsInput } from '@/admin/services/adminSettingsService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { PUBLIC_COMPANY_SETTINGS_QUERY_KEY } from '@/services/publicService';
import { publishPublicContentUpdate } from '@/services/publicContentSync';

const emptyCompanySettingsForm: AdminCompanySettingsInput = {
    companyName: '',
    tagline: '',
    about: '',
    phone: '',
    email: '',
    address: '',
    pickupInstructions: '',
    cashOnlyNotice: '',
    openingHours: {},
    socialLinks: {},
    logo: null,
    favicon: null,
};

export function AdminCompanySettingsPage() {
    const queryClient = useQueryClient();
    const settingsQuery = useQuery({
        queryKey: ['admin-app', 'company-settings'],
        queryFn: adminSettingsService.getCompanySettings,
    });
    const [draftForm, setDraftForm] = useState<AdminCompanySettingsInput | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
    const baseForm = useMemo<AdminCompanySettingsInput>(() => {
        if (!settingsQuery.data) {
            return emptyCompanySettingsForm;
        }

        return {
            companyName: settingsQuery.data.companyName,
            tagline: settingsQuery.data.tagline ?? '',
            about: settingsQuery.data.about ?? '',
            phone: settingsQuery.data.phone ?? '',
            email: settingsQuery.data.email ?? '',
            address: settingsQuery.data.address ?? '',
            pickupInstructions: settingsQuery.data.pickupInstructions ?? '',
            cashOnlyNotice: settingsQuery.data.cashOnlyNotice ?? '',
            openingHours: settingsQuery.data.openingHours,
            socialLinks: settingsQuery.data.socialLinks,
            logo: null,
            favicon: null,
        };
    }, [settingsQuery.data]);
    const form = draftForm ?? baseForm;

    const updateMutation = useMutation({
        mutationFn: adminSettingsService.updateCompanySettings,
        onSuccess: async () => {
            toast.success('Company settings saved');
            setDraftForm(null);
            setLogoPreview(null);
            setFaviconPreview(null);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'company-settings'] }),
                queryClient.invalidateQueries({ queryKey: PUBLIC_COMPANY_SETTINGS_QUERY_KEY }),
            ]);
            publishPublicContentUpdate('company-settings');
        },
    });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                description="Control the business profile, pickup instructions, cash-only notices, branding assets, and operating hours used across the restaurant platform."
                title="Company settings"
            />

            <AdminSectionCard className="p-5 sm:p-6">
                <div className="grid gap-4 lg:grid-cols-2">
                        <Input label="Company name" onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), companyName: event.target.value }))} value={form.companyName} />
                        <Input label="Tagline" onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), tagline: event.target.value }))} value={form.tagline} />
                        <Input label="Phone" onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), phone: event.target.value }))} value={form.phone} />
                        <Input label="Email" onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), email: event.target.value }))} value={form.email} />
                        <div className="lg:col-span-2">
                            <Input label="Address" onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), address: event.target.value }))} value={form.address} />
                        </div>
                        <div className="lg:col-span-2">
                            <Textarea label="About" onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), about: event.target.value }))} value={form.about} />
                        </div>
                        <div className="lg:col-span-2">
                            <Textarea label="Pickup instructions" onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), pickupInstructions: event.target.value }))} value={form.pickupInstructions} />
                        </div>
                        <div>
                            <Input label="Cash-only notice" onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), cashOnlyNotice: event.target.value }))} value={form.cashOnlyNotice} />
                        </div>
                        <Input
                            label="Thursday schedule"
                            onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), openingHours: { ...(current ?? baseForm).openingHours, friday: event.target.value } }))}
                            value={form.openingHours.friday ?? ''}
                        />
                        <Input
                            label="Saturday schedule"
                            onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), openingHours: { ...(current ?? baseForm).openingHours, saturday: event.target.value } }))}
                            value={form.openingHours.saturday ?? ''}
                        />
                        <Input
                            label="Ordering cutoff"
                            onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), openingHours: { ...(current ?? baseForm).openingHours, ordering_cutoff: event.target.value } }))}
                            value={form.openingHours.ordering_cutoff ?? ''}
                        />
                        <Input
                            label="Instagram"
                            onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), socialLinks: { ...(current ?? baseForm).socialLinks, instagram: event.target.value } }))}
                            value={form.socialLinks.instagram ?? ''}
                        />
                        <Input
                            label="Facebook"
                            onChange={(event) => setDraftForm((current) => ({ ...(current ?? baseForm), socialLinks: { ...(current ?? baseForm).socialLinks, facebook: event.target.value } }))}
                            value={form.socialLinks.facebook ?? ''}
                        />
                        <AdminImageUploadField
                            helperText="Recommended for public branding and install prompts."
                            label="Logo"
                            onChange={(file) => {
                                setDraftForm((current) => ({ ...(current ?? baseForm), logo: file }));
                                setLogoPreview(file ? URL.createObjectURL(file) : (settingsQuery.data?.logo ?? null));
                            }}
                            previewAlt={form.companyName || 'Company logo'}
                            previewSrc={logoPreview ?? settingsQuery.data?.logo ?? null}
                        />
                        <AdminImageUploadField
                            helperText="Used by the browser tab and install shell."
                            label="Favicon"
                            onChange={(file) => {
                                setDraftForm((current) => ({ ...(current ?? baseForm), favicon: file }));
                                setFaviconPreview(file ? URL.createObjectURL(file) : (settingsQuery.data?.favicon ?? null));
                            }}
                            previewAlt={form.companyName || 'Company favicon'}
                            previewSrc={faviconPreview ?? settingsQuery.data?.favicon ?? null}
                        />
                </div>
                <div className="mt-5">
                    <Button disabled={updateMutation.isPending} onClick={() => updateMutation.mutate(form)} size="sm">
                        Save company settings
                    </Button>
                </div>
            </AdminSectionCard>
        </div>
    );
}
