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
import { Modal } from '@/components/common/Modal';
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
    const [isEditorOpen, setIsEditorOpen] = useState(false);
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
            closeEditor();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: adminSettingsService.deleteSeoSetting,
        onSuccess: async () => {
            toast.success('SEO setting deleted');
            await queryClient.invalidateQueries({ queryKey: ['admin-app', 'seo-settings'] });
        },
    });

    const resetEditorState = () => {
        setEditingRecord(null);
        setForm(emptySeoForm());
        setSchemaJsonText('{}');
        setImagePreview(null);
    };

    const openCreateModal = () => {
        resetEditorState();
        setIsEditorOpen(true);
    };

    const openEditModal = (record: AdminSeoRecord) => {
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
        setIsEditorOpen(true);
    };

    const closeEditor = () => {
        setIsEditorOpen(false);
        resetEditorState();
    };

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
                    <button className="text-sm font-semibold text-[color:var(--primary-500)]" onClick={() => openEditModal(record)} type="button">
                        Edit
                    </button>
                    <button className="text-sm font-semibold text-rose-300" onClick={() => deleteMutation.mutate(record.id)} type="button">
                        Delete
                    </button>
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
                actions={<Button className="w-full sm:w-auto" onClick={openCreateModal} size="sm">Add SEO setting</Button>}
                description="Manage page titles, descriptions, keywords, and sharing images."
                title="SEO settings"
            />

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

            <Modal
                isOpen={isEditorOpen}
                onClose={closeEditor}
                panelClassName="max-w-3xl"
                title={editingRecord ? 'Edit SEO setting' : 'Add SEO setting'}
            >
                <form
                    className="space-y-5"
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSave();
                    }}
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Input label="Page key" onChange={(event) => setForm((current) => ({ ...current, pageKey: event.target.value }))} value={form.pageKey} />
                        <Input label="Title" onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} value={form.title ?? ''} />
                        <div className="lg:col-span-2">
                            <Textarea label="Description" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} value={form.description ?? ''} />
                        </div>
                        <div className="lg:col-span-2">
                            <Input label="Keywords" onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))} value={form.keywords ?? ''} />
                        </div>
                        <div className="lg:col-span-2">
                            <Textarea label="Schema JSON" onChange={(event) => setSchemaJsonText(event.target.value)} value={schemaJsonText} />
                        </div>
                        <div className="lg:col-span-2">
                            <AdminImageUploadField
                                helperText="Upload an image for social sharing previews."
                                label="Sharing image"
                                onChange={(file) => {
                                    setForm((current) => ({ ...current, ogImage: file }));
                                    setImagePreview(file ? URL.createObjectURL(file) : (editingRecord?.ogImage ?? null));
                                }}
                                previewAlt={form.pageKey || 'SEO image preview'}
                                previewSrc={imagePreview ?? editingRecord?.ogImage ?? null}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button disabled={saveMutation.isPending} onClick={closeEditor} type="button" variant="ghost">
                            Cancel
                        </Button>
                        <Button disabled={saveMutation.isPending} type="submit">
                            {editingRecord ? 'Update SEO setting' : 'Create SEO setting'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
