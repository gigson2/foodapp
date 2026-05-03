import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TableColumn } from 'react-data-table-component';
import { toast } from 'sonner';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminImageUploadField } from '@/admin/components/common/AdminImageUploadField';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSearchInput } from '@/admin/components/common/AdminSearchInput';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminSettingsService, type AdminSeoInput, type AdminSeoRecord } from '@/admin/services/adminSettingsService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';

function emptySeoForm(): AdminSeoInput {
    return {
        pageKey: '',
        title: '',
        description: '',
        keywords: '',
        schemaJson: {},
        ogImage: null,
    };
}

export function AdminSeoSettingsPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [editingRecord, setEditingRecord] = useState<AdminSeoRecord | null>(null);
    const [form, setForm] = useState<AdminSeoInput>(emptySeoForm());
    const [schemaJsonText, setSchemaJsonText] = useState('{}');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const seoQuery = useQuery({
        queryKey: ['admin-app', 'seo-settings', { page, perPage, search }],
        queryFn: () => adminSettingsService.getSeoSettings({ page, perPage, search }),
    });

    const saveMutation = useMutation({
        mutationFn: async (payload: AdminSeoInput) => editingRecord ? adminSettingsService.updateSeoSetting(editingRecord.id, payload) : adminSettingsService.createSeoSetting(payload),
        onSuccess: async () => {
            toast.success(editingRecord ? 'SEO setting updated' : 'SEO setting created');
            await queryClient.invalidateQueries({ queryKey: ['admin-app', 'seo-settings'] });
            setEditingRecord(null);
            setForm(emptySeoForm());
            setSchemaJsonText('{}');
            setImagePreview(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: adminSettingsService.deleteSeoSetting,
        onSuccess: async () => {
            toast.success('SEO setting deleted');
            await queryClient.invalidateQueries({ queryKey: ['admin-app', 'seo-settings'] });
        },
    });

    const records = seoQuery.data?.items ?? [];
    const meta = seoQuery.data?.meta;
    const columns: TableColumn<AdminSeoRecord>[] = [
        {
            name: 'Page',
            cell: (record) => <span className="font-semibold">{record.pageKey}</span>,
        },
        {
            name: 'Title',
            grow: 1.2,
            cell: (record) => (
                <div>
                    <p>{record.title ?? 'Untitled'}</p>
                    <p className="mt-1 text-xs text-muted">{record.description ?? 'No description'}</p>
                </div>
            ),
        },
        {
            name: 'Keywords',
            grow: 1.1,
            cell: (record) => <span className="text-sm text-muted">{record.keywords ?? 'No keywords'}</span>,
        },
        {
            name: 'Actions',
            button: true,
            cell: (record) => (
                <div className="flex gap-3">
                    <button
                        className="text-sm font-semibold text-[color:var(--primary-500)]"
                        onClick={() => {
                            setEditingRecord(record);
                            setForm({
                                pageKey: record.pageKey,
                                title: record.title ?? '',
                                description: record.description ?? '',
                                keywords: record.keywords ?? '',
                                schemaJson: record.schemaJson,
                                ogImage: null,
                            });
                            setSchemaJsonText(JSON.stringify(record.schemaJson, null, 2));
                            setImagePreview(record.ogImage ?? null);
                        }}
                        type="button"
                    >
                        Edit
                    </button>
                    <button className="text-sm font-semibold text-rose-300" onClick={() => deleteMutation.mutate(record.id)} type="button">Delete</button>
                </div>
            ),
        },
    ];
    const handleSave = () => {
        try {
            saveMutation.mutate({
                ...form,
                schemaJson: JSON.parse(schemaJsonText || '{}'),
            });
        } catch {
            toast.error('Schema JSON must be valid JSON.');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                actions={<Button onClick={() => { setEditingRecord(null); setForm(emptySeoForm()); setSchemaJsonText('{}'); setImagePreview(null); }} size="sm">{editingRecord ? 'Create new setting' : 'Reset form'}</Button>}
                description="Manage searchable SEO records for the storefront, including metadata, Open Graph images, and structured schema JSON."
                title="SEO settings"
            />

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <AdminSectionCard className="overflow-hidden">
                    <div className="border-b border-white/10 px-5 py-5">
                        <AdminSearchInput label="Search" onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search by page key, title, or description" value={search} />
                    </div>
                    {meta ? (
                        <AdminDataTable
                            columns={columns}
                            currentPage={page}
                            data={records}
                            loading={seoQuery.isLoading}
                            perPage={perPage}
                            totalRows={meta.total}
                            onPageChange={setPage}
                            onPerPageChange={(nextPerPage) => {
                                setPerPage(nextPerPage);
                                setPage(1);
                            }}
                        />
                    ) : null}
                </AdminSectionCard>

                <AdminSectionCard className="p-5 sm:p-6">
                    <h2 className="text-2xl">{editingRecord ? 'Edit SEO setting' : 'Add SEO setting'}</h2>
                    <div className="mt-5 grid gap-4">
                        <Input label="Page key" onChange={(event) => setForm((current) => ({ ...current, pageKey: event.target.value }))} value={form.pageKey} />
                        <Input label="Title" onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} value={form.title ?? ''} />
                        <Textarea label="Description" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} value={form.description ?? ''} />
                        <Input label="Keywords" onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))} value={form.keywords ?? ''} />
                        <Textarea label="Schema JSON" onChange={(event) => setSchemaJsonText(event.target.value)} value={schemaJsonText} />
                        <AdminImageUploadField
                            helperText="Upload an image for Open Graph previews."
                            label="Open Graph image"
                            onChange={(file) => {
                                setForm((current) => ({ ...current, ogImage: file }));
                                setImagePreview(file ? URL.createObjectURL(file) : (editingRecord?.ogImage ?? null));
                            }}
                            previewAlt={form.pageKey || 'SEO image preview'}
                            previewSrc={imagePreview ?? editingRecord?.ogImage ?? null}
                        />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Button disabled={saveMutation.isPending} onClick={handleSave} size="sm">
                            {editingRecord ? 'Update SEO setting' : 'Create SEO setting'}
                        </Button>
                        {editingRecord ? <Button disabled={saveMutation.isPending} onClick={() => { setEditingRecord(null); setForm(emptySeoForm()); setSchemaJsonText('{}'); setImagePreview(null); }} size="sm" variant="ghost">Cancel edit</Button> : null}
                    </div>
                </AdminSectionCard>
            </div>
        </div>
    );
}
