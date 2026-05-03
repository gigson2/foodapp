import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/common/Textarea';

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
    const [form, setForm] = useState<AdminCategoryFormInput>(emptyCategoryForm());
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const categoriesQuery = useQuery({
        queryKey: ['admin-app', 'categories', { page, perPage, search, active }],
        queryFn: () => adminCategoryService.getCategories({ page, perPage, search, isActive: active }),
    });

    const saveMutation = useMutation({
        mutationFn: async (payload: AdminCategoryFormInput) => editingCategory ? adminCategoryService.updateCategory(editingCategory.id, payload) : adminCategoryService.createCategory(payload),
        onSuccess: async () => {
            toast.success(editingCategory ? 'Category updated' : 'Category created');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'categories'] }),
                queryClient.invalidateQueries({ queryKey: ['public-categories'] }),
            ]);
            setEditingCategory(null);
            setForm(emptyCategoryForm());
            setImagePreview(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: adminCategoryService.deleteCategory,
        onSuccess: async () => {
            toast.success('Category removed');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'categories'] }),
                queryClient.invalidateQueries({ queryKey: ['public-categories'] }),
            ]);
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
            name: 'State',
            cell: (category) => (
                <AdminBadge className={category.isActive ? 'border-emerald-500/30 bg-emerald-500/14 text-emerald-300' : 'border-rose-500/30 bg-rose-500/14 text-rose-300'}>
                    {category.isActive ? 'Active' : 'Inactive'}
                </AdminBadge>
            ),
        },
        {
            name: 'Actions',
            button: true,
            cell: (category) => (
                <div className="flex gap-3">
                    <IconButton aria-label={`Edit ${category.name}`} className="h-10 w-10" onClick={() => startEditing(category)}>
                        <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton aria-label={`Delete ${category.name}`} className="h-10 w-10 border-rose-500/30 text-rose-400 hover:border-rose-500/42 hover:bg-rose-500/12" onClick={() => deleteMutation.mutate(category.id)}>
                        <Trash2 className="h-4 w-4" />
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
                            label="State"
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
                        <Button onClick={() => saveMutation.mutate(form)} size="sm">{editingCategory ? 'Update category' : 'Create category'}</Button>
                        {editingCategory ? <Button onClick={() => { setEditingCategory(null); setForm(emptyCategoryForm()); }} size="sm" variant="ghost">Cancel edit</Button> : null}
                    </div>
                </AdminSectionCard>
            </div>
        </div>
    );
}
