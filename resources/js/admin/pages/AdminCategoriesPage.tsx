import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil } from 'lucide-react';
import type { TableColumn } from 'react-data-table-component';
import { toast } from 'sonner';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminFilterSelect } from '@/admin/components/common/AdminFilterSelect';
import { AdminImageUploadField } from '@/admin/components/common/AdminImageUploadField';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSearchInput } from '@/admin/components/common/AdminSearchInput';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminCategoryService, type AdminCategoryFormInput, type AdminCategoryRecord } from '@/admin/services/adminCategoryService';
import { Button } from '@/components/common/Button';
import { IconButton } from '@/components/common/IconButton';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Textarea } from '@/components/common/Textarea';
import { PUBLIC_CATEGORIES_QUERY_KEY, PUBLIC_FOODS_QUERY_KEY } from '@/services/publicService';
import { publishPublicContentUpdate } from '@/services/publicContentSync';

function emptyCategoryForm(): AdminCategoryFormInput {
    return {
        name: '',
        slug: '',
        description: '',
        sortOrder: 0,
        isActive: true,
        image: null,
    };
}

export function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [active, setActive] = useState<boolean | ''>('');
    const [editingCategory, setEditingCategory] = useState<AdminCategoryRecord | null>(null);
    const [viewingCategoryId, setViewingCategoryId] = useState<string | null>(null);
    const [form, setForm] = useState<AdminCategoryFormInput>(emptyCategoryForm());
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const categoriesQuery = useQuery({
        queryKey: ['admin-app', 'categories', { page, perPage, search, active }],
        queryFn: () => adminCategoryService.getCategories({ page, perPage, search, isActive: active }),
    });
    const categoryDetailQuery = useQuery({
        enabled: viewingCategoryId !== null,
        queryKey: ['admin-app', 'category', viewingCategoryId],
        queryFn: () => adminCategoryService.getCategory(viewingCategoryId ?? ''),
    });

    const saveMutation = useMutation({
        mutationFn: async (payload: AdminCategoryFormInput) => editingCategory ? adminCategoryService.updateCategory(editingCategory.id, payload) : adminCategoryService.createCategory(payload),
        onSuccess: async () => {
            toast.success(editingCategory ? 'Category updated' : 'Category created');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'categories'] }),
                queryClient.invalidateQueries({ queryKey: PUBLIC_CATEGORIES_QUERY_KEY }),
                queryClient.invalidateQueries({ queryKey: PUBLIC_FOODS_QUERY_KEY }),
            ]);
            publishPublicContentUpdate('categories');
            publishPublicContentUpdate('foods');
            setEditingCategory(null);
            setForm(emptyCategoryForm());
            setImagePreview(null);
        },
    });

    const toggleMutation = useMutation({
        mutationFn: adminCategoryService.toggleCategoryActive,
        onSuccess: async () => {
            toast.success('Category status updated');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'categories'] }),
                queryClient.invalidateQueries({ queryKey: PUBLIC_CATEGORIES_QUERY_KEY }),
                queryClient.invalidateQueries({ queryKey: PUBLIC_FOODS_QUERY_KEY }),
            ]);
            publishPublicContentUpdate('categories');
            publishPublicContentUpdate('foods');
        },
    });

    const categories = categoriesQuery.data?.items ?? [];
    const meta = categoriesQuery.data?.meta;
    const columns: TableColumn<AdminCategoryRecord>[] = [
        {
            name: 'Category',
            grow: 1.2,
            cell: (category) => (
                <div className="flex items-center gap-3 py-1">
                    {category.image ? <img alt={category.name} className="h-14 w-14 rounded-xl object-cover" src={category.image} /> : <div className="h-14 w-14 rounded-xl bg-white/6" />}
                    <div>
                        <p className="font-semibold">{category.name}</p>
                        <p className="mt-1 text-xs text-muted">{category.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            name: 'Description',
            grow: 1.3,
            cell: (category) => <span className="text-sm text-muted">{category.description ?? 'No description'}</span>,
        },
        {
            name: 'Foods',
            cell: (category) => <span>{category.foodsCount}</span>,
        },
        {
            name: 'Status',
            grow: 1.1,
            cell: (category) => (
                <button
                    aria-checked={category.isActive}
                    aria-label={`${category.isActive ? 'Deactivate' : 'Activate'} ${category.name}`}
                    className={`ui-focus-ring inline-flex items-center gap-3 whitespace-nowrap rounded-full border px-3 py-2 text-sm font-semibold transition ${
                        category.isActive
                            ? 'border-emerald-500/30 bg-emerald-500/14 text-emerald-300'
                            : 'border-rose-500/30 bg-rose-500/14 text-rose-300'
                    }`}
                    disabled={toggleMutation.isPending}
                    onClick={() => toggleMutation.mutate(category.id)}
                    role="switch"
                    type="button"
                >
                    <span
                        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition ${
                            category.isActive
                                ? 'border-emerald-400/50 bg-emerald-500/22'
                                : 'border-rose-400/40 bg-rose-500/14'
                        }`}
                    >
                        <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-current transition ${
                                category.isActive ? 'left-[1.35rem]' : 'left-0.5'
                            }`}
                        />
                    </span>
                    <span>{category.isActive ? 'Active' : 'Inactive'}</span>
                </button>
            ),
        },
        {
            name: 'Actions',
            button: true,
            cell: (category) => (
                <div className="flex gap-3">
                    <IconButton aria-label={`View ${category.name}`} className="h-10 w-10" disabled={saveMutation.isPending || toggleMutation.isPending} onClick={() => setViewingCategoryId(category.id)}>
                        <Eye className="h-4 w-4" />
                    </IconButton>
                    <IconButton aria-label={`Edit ${category.name}`} className="h-10 w-10" disabled={saveMutation.isPending || toggleMutation.isPending} onClick={() => startEditing(category)}>
                        <Pencil className="h-4 w-4" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const startEditing = (category: AdminCategoryRecord) => {
        setEditingCategory(category);
        setForm({
            name: category.name,
            slug: category.slug,
            description: category.description ?? '',
            sortOrder: category.sortOrder,
            isActive: category.isActive,
            image: null,
        });
        setImagePreview(category.image ?? null);
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                actions={<Button onClick={() => { setEditingCategory(null); setForm(emptyCategoryForm()); setImagePreview(null); }} size="sm">{editingCategory ? 'Create new category' : 'Reset form'}</Button>}
                description="Maintain the restaurant menu categories, sort order, active state, and category artwork used across the store and admin."
                title="Categories"
            />

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <AdminSectionCard className="overflow-hidden">
                    <div className="grid gap-4 border-b border-white/10 px-5 py-5 lg:grid-cols-[1.2fr_0.7fr]">
                        <AdminSearchInput label="Search" onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search categories by name or slug" value={search} />
                        <AdminFilterSelect
                            label="Status"
                            onChange={(value) => { setActive(value === '' ? '' : value === 'true'); setPage(1); }}
                            options={[
                                { label: 'All', value: '' },
                                { label: 'Active', value: 'true' },
                                { label: 'Inactive', value: 'false' },
                            ]}
                            value={active === '' ? '' : String(active)}
                        />
                    </div>

                    {meta ? (
                        <AdminDataTable
                            columns={columns}
                            currentPage={page}
                            data={categories}
                            loading={categoriesQuery.isLoading}
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
                    <h2 className="text-2xl">{editingCategory ? 'Edit category' : 'Add category'}</h2>
                    <div className="mt-5 grid gap-4">
                        <Input label="Name" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={form.name} />
                        <Input label="Slug" onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} value={form.slug} />
                        <Textarea label="Description" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} value={form.description ?? ''} />
                        <Input label="Sort order" onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} type="number" value={form.sortOrder} />
                        <AdminImageUploadField
                            helperText="Upload a category image or icon."
                            label="Category image"
                            onChange={(file) => {
                                setForm((current) => ({ ...current, image: file }));
                                setImagePreview(file ? URL.createObjectURL(file) : (editingCategory?.image ?? null));
                            }}
                            previewAlt={form.name || 'Category preview'}
                            previewSrc={imagePreview ?? editingCategory?.image ?? null}
                        />
                        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                            <input checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} type="checkbox" />
                            Active
                        </label>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Button disabled={saveMutation.isPending} onClick={() => saveMutation.mutate(form)} size="sm">{editingCategory ? 'Update category' : 'Create category'}</Button>
                        {editingCategory ? <Button disabled={saveMutation.isPending} onClick={() => { setEditingCategory(null); setForm(emptyCategoryForm()); setImagePreview(null); }} size="sm" variant="ghost">Cancel edit</Button> : null}
                    </div>
                </AdminSectionCard>
            </div>

            <Modal
                description="Category details and storefront visibility information."
                isOpen={viewingCategoryId !== null}
                onClose={() => setViewingCategoryId(null)}
                panelClassName="max-w-2xl"
                title={categoryDetailQuery.data?.name ?? 'Category details'}
            >
                {categoryDetailQuery.isLoading ? (
                    <p className="text-sm text-muted">Loading category details...</p>
                ) : categoryDetailQuery.data ? (
                    <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
                        <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--ui-divider)] bg-[color:var(--ui-surface-muted)]">
                            {categoryDetailQuery.data.image ? (
                                <img
                                    alt={categoryDetailQuery.data.name}
                                    className="aspect-[4/3] h-full w-full object-cover"
                                    src={categoryDetailQuery.data.image}
                                />
                            ) : (
                                <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted">
                                    No category image uploaded
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4">
                            <div className="ui-surface-solid rounded-[1.35rem] p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Slug</p>
                                <p className="mt-2 text-sm text-[color:var(--text-950)]">{categoryDetailQuery.data.slug}</p>
                            </div>
                            <div className="ui-surface-solid rounded-[1.35rem] p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Description</p>
                                <p className="mt-2 text-sm leading-7 text-[color:var(--text-950)]">{categoryDetailQuery.data.description || 'No description added yet.'}</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="ui-surface-solid rounded-[1.35rem] p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Foods</p>
                                    <p className="mt-2 text-xl">{categoryDetailQuery.data.foodsCount}</p>
                                </div>
                                <div className="ui-surface-solid rounded-[1.35rem] p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Sort order</p>
                                    <p className="mt-2 text-xl">{categoryDetailQuery.data.sortOrder}</p>
                                </div>
                                <div className="ui-surface-solid rounded-[1.35rem] p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Status</p>
                                    <div className="mt-2">
                                        <AdminBadge className={categoryDetailQuery.data.isActive ? 'border-emerald-500/30 bg-emerald-500/14 text-emerald-300' : 'border-rose-500/30 bg-rose-500/14 text-rose-300'}>
                                            {categoryDetailQuery.data.isActive ? 'Active' : 'Inactive'}
                                        </AdminBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="ui-surface-solid rounded-[1.35rem] p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Storefront visibility</p>
                                <p className="mt-2 text-sm leading-7 text-[color:var(--text-950)]">
                                    {categoryDetailQuery.data.isActive
                                        ? 'This category is visible to customers, and foods assigned to it can appear on the storefront when those foods are available and not archived.'
                                        : 'This category is hidden from customers, and foods assigned to it are also kept off the storefront until the category is activated again.'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted">Unable to load category details.</p>
                )}
            </Modal>
        </div>
    );
}
