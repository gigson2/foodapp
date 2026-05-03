import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Archive, Pencil, RotateCcw } from 'lucide-react';
import type { TableColumn } from 'react-data-table-component';
import { toast } from 'sonner';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminFilterSelect } from '@/admin/components/common/AdminFilterSelect';
import { AdminImageUploadField } from '@/admin/components/common/AdminImageUploadField';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSearchInput } from '@/admin/components/common/AdminSearchInput';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminCategoryService } from '@/admin/services/adminCategoryService';
import { adminFoodService, type AdminFoodFormInput, type AdminFoodRecord } from '@/admin/services/adminFoodService';
import { formatAdminMoney } from '@/admin/utils/adminMoney';
import { Button } from '@/components/common/Button';
import { IconButton } from '@/components/common/IconButton';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { PUBLIC_FOODS_QUERY_KEY } from '@/services/publicService';
import { publishPublicContentUpdate } from '@/services/publicContentSync';

function buildInitialFoodForm(categoryId = 0): AdminFoodFormInput {
    return {
        categoryId,
        name: '',
        slug: '',
        description: '',
        shortDescription: '',
        price: 0,
        preparationTimeMinutes: 30,
        ingredients: [],
        allergens: [],
        dietaryLabels: [],
        isAvailable: true,
        isFeatured: false,
        isPopular: false,
        sortOrder: 0,
        seoTitle: '',
        seoDescription: '',
        image: null,
    };
}

function splitTags(value: string) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export function AdminMenuPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(0);
    const [availability, setAvailability] = useState<boolean | ''>('');
    const [editingFood, setEditingFood] = useState<AdminFoodRecord | null>(null);
    const [form, setForm] = useState<AdminFoodFormInput>(buildInitialFoodForm());
    const [ingredientsText, setIngredientsText] = useState('');
    const [allergensText, setAllergensText] = useState('');
    const [labelsText, setLabelsText] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const foodsQuery = useQuery({
        queryKey: ['admin-app', 'foods', { page, perPage, search, categoryId, availability }],
        queryFn: () => adminFoodService.getFoods({ page, perPage, search, categoryId, isAvailable: availability }),
    });
    const categoriesQuery = useQuery({
        queryKey: ['admin-app', 'categories', 'all'],
        queryFn: () => adminCategoryService.getCategories({ page: 1, perPage: 100, search: '' }),
    });

    const saveMutation = useMutation({
        mutationFn: async (payload: AdminFoodFormInput) => editingFood ? adminFoodService.updateFood(editingFood.id, payload) : adminFoodService.createFood(payload),
        onSuccess: async () => {
            toast.success(editingFood ? 'Food updated' : 'Food created');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'foods'] }),
                queryClient.invalidateQueries({ queryKey: PUBLIC_FOODS_QUERY_KEY }),
            ]);
            publishPublicContentUpdate('foods');
            setEditingFood(null);
            setForm(buildInitialFoodForm(categoryId));
            setIngredientsText('');
            setAllergensText('');
            setLabelsText('');
            setImagePreview(null);
        },
    });

    const archiveMutation = useMutation({
        mutationFn: adminFoodService.archiveFood,
        onSuccess: async () => {
            toast.success('Food archived');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'foods'] }),
                queryClient.invalidateQueries({ queryKey: PUBLIC_FOODS_QUERY_KEY }),
            ]);
            publishPublicContentUpdate('foods');
        },
    });
    const restoreMutation = useMutation({
        mutationFn: adminFoodService.restoreFood,
        onSuccess: async () => {
            toast.success('Food restored');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'foods'] }),
                queryClient.invalidateQueries({ queryKey: PUBLIC_FOODS_QUERY_KEY }),
            ]);
            publishPublicContentUpdate('foods');
        },
    });

    const categories = categoriesQuery.data?.items ?? [];
    const categoryOptions = [{ label: 'All categories', value: '0' }, ...categories.map((category) => ({ label: category.name, value: category.id }))];

    const startEditing = (food: AdminFoodRecord) => {
        setEditingFood(food);
        setForm({
            categoryId: food.categoryId,
            name: food.name,
            slug: food.slug,
            description: food.description,
            shortDescription: food.shortDescription ?? '',
            price: food.price,
            preparationTimeMinutes: food.preparationTimeMinutes,
            ingredients: food.ingredients,
            allergens: food.allergens,
            dietaryLabels: food.dietaryLabels,
            isAvailable: food.isAvailable,
            isFeatured: food.isFeatured,
            isPopular: food.isPopular,
            sortOrder: food.sortOrder,
            seoTitle: food.seoTitle ?? '',
            seoDescription: food.seoDescription ?? '',
            image: null,
        });
        setIngredientsText(food.ingredients.join(', '));
        setAllergensText(food.allergens.join(', '));
        setLabelsText(food.dietaryLabels.join(', '));
        setImagePreview(food.image ?? null);
    };

    const resetForm = () => {
        setEditingFood(null);
        setForm(buildInitialFoodForm(categoryId));
        setIngredientsText('');
        setAllergensText('');
        setLabelsText('');
        setImagePreview(null);
    };

    const foods = foodsQuery.data?.items ?? [];
    const meta = foodsQuery.data?.meta;
    const columns: TableColumn<AdminFoodRecord>[] = [
        {
            name: 'Food',
            grow: 1.2,
            cell: (food) => (
                <div className="flex items-center gap-3 py-1">
                    {food.image ? <img alt={food.name} className="h-14 w-14 rounded-xl object-cover" src={food.image} /> : <div className="h-14 w-14 rounded-xl bg-white/6" />}
                    <div>
                        <p className="font-semibold">{food.name}</p>
                        <p className="mt-1 text-xs text-muted">{food.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            name: 'Category',
            cell: (food) => <span>{food.category}</span>,
        },
        {
            name: 'Price',
            cell: (food) => <span className="font-semibold">{formatAdminMoney(food.price)}</span>,
        },
        {
            name: 'Flags',
            grow: 1.1,
            cell: (food) => (
                <div className="flex flex-wrap gap-2">
                    <AdminBadge className={food.isAvailable ? 'border-emerald-500/30 bg-emerald-500/14 text-emerald-300' : 'border-rose-500/30 bg-rose-500/14 text-rose-300'}>
                        {food.isAvailable ? 'Available' : 'Unavailable'}
                    </AdminBadge>
                    {food.deletedAt ? <AdminBadge className="border-amber-500/30 bg-amber-500/14 text-amber-300">Archived</AdminBadge> : null}
                    {food.isPopular ? <AdminBadge className="border-amber-500/30 bg-amber-500/14 text-amber-300">Popular</AdminBadge> : null}
                    {food.isFeatured ? <AdminBadge className="border-[color:var(--primary-500)]/30 bg-[color:var(--primary-500)]/12 text-[color:var(--primary-500)]">Featured</AdminBadge> : null}
                </div>
            ),
        },
        {
            name: 'Actions',
            button: true,
            cell: (food) => (
                <div className="flex gap-3">
                    <IconButton aria-label={`Edit ${food.name}`} className="h-10 w-10" disabled={saveMutation.isPending || archiveMutation.isPending || restoreMutation.isPending} onClick={() => startEditing(food)}>
                        <Pencil className="h-4 w-4" />
                    </IconButton>
                    {food.deletedAt ? (
                        <IconButton aria-label={`Restore ${food.name}`} className="h-10 w-10 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/42 hover:bg-emerald-500/12" disabled={saveMutation.isPending || archiveMutation.isPending || restoreMutation.isPending} onClick={() => restoreMutation.mutate(food.id)}>
                            <RotateCcw className="h-4 w-4" />
                        </IconButton>
                    ) : (
                        <IconButton aria-label={`Archive ${food.name}`} className="h-10 w-10 border-rose-500/30 text-rose-400 hover:border-rose-500/42 hover:bg-rose-500/12" disabled={saveMutation.isPending || archiveMutation.isPending || restoreMutation.isPending} onClick={() => archiveMutation.mutate(food.id)}>
                            <Archive className="h-4 w-4" />
                        </IconButton>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                actions={<Button onClick={resetForm} size="sm">{editingFood ? 'Create new food' : 'Reset form'}</Button>}
                description="Manage grill packs, pricing, availability, tags, and food images using the live restaurant database."
                title="Menu"
            />

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <AdminSectionCard className="overflow-hidden">
                    <div className="grid gap-4 border-b border-white/10 px-5 py-5 lg:grid-cols-[1.3fr_repeat(2,minmax(0,0.6fr))]">
                        <AdminSearchInput label="Search" onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search foods by name, slug, or description" value={search} />
                        <AdminFilterSelect label="Category" onChange={(value) => { setCategoryId(Number(value)); setPage(1); }} options={categoryOptions} value={String(categoryId)} />
                        <AdminFilterSelect
                            label="Availability"
                            onChange={(value) => { setAvailability(value === '' ? '' : value === 'true'); setPage(1); }}
                            options={[
                                { label: 'All', value: '' },
                                { label: 'Available', value: 'true' },
                                { label: 'Unavailable', value: 'false' },
                            ]}
                            value={availability === '' ? '' : String(availability)}
                        />
                    </div>

                    {meta ? (
                        <AdminDataTable
                            columns={columns}
                            currentPage={page}
                            data={foods}
                            loading={foodsQuery.isLoading}
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
                    <h2 className="text-2xl">{editingFood ? 'Edit food' : 'Add food'}</h2>
                    <div className="mt-5 grid gap-4">
                        <label className="block space-y-2">
                            <span className="text-sm font-medium text-[color:var(--text-950)]">Category</span>
                            <select className="theme-field w-full rounded-2xl px-4 py-3" onChange={(event) => setForm((current) => ({ ...current, categoryId: Number(event.target.value) }))} value={form.categoryId}>
                                <option value={0}>Select category</option>
                                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                            </select>
                        </label>
                        <Input label="Food name" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={form.name} />
                        <Input label="Slug" onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} value={form.slug} />
                        <Textarea label="Description" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} value={form.description} />
                        <Input label="Short description" onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))} value={form.shortDescription ?? ''} />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input label="Price" onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))} step="0.01" type="number" value={form.price} />
                            <Input label="Preparation time (minutes)" onChange={(event) => setForm((current) => ({ ...current, preparationTimeMinutes: Number(event.target.value) }))} type="number" value={form.preparationTimeMinutes} />
                            <Input label="Sort order" onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} type="number" value={form.sortOrder} />
                        </div>
                        <AdminImageUploadField
                            helperText="Upload a food image for menu cards and order details."
                            label="Food image"
                            onChange={(file) => {
                                setForm((current) => ({ ...current, image: file }));
                                setImagePreview(file ? URL.createObjectURL(file) : (editingFood?.image ?? null));
                            }}
                            previewAlt={form.name || 'Food preview'}
                            previewSrc={imagePreview ?? editingFood?.image ?? null}
                        />
                        <Input label="Ingredients (comma separated)" onChange={(event) => setIngredientsText(event.target.value)} value={ingredientsText} />
                        <Input label="Allergens (comma separated)" onChange={(event) => setAllergensText(event.target.value)} value={allergensText} />
                        <Input label="Dietary labels (comma separated)" onChange={(event) => setLabelsText(event.target.value)} value={labelsText} />
                        <Input label="SEO title" onChange={(event) => setForm((current) => ({ ...current, seoTitle: event.target.value }))} value={form.seoTitle ?? ''} />
                        <Textarea label="SEO description" onChange={(event) => setForm((current) => ({ ...current, seoDescription: event.target.value }))} value={form.seoDescription ?? ''} />
                        <div className="grid gap-3 sm:grid-cols-3">
                            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                <input checked={form.isAvailable} onChange={(event) => setForm((current) => ({ ...current, isAvailable: event.target.checked }))} type="checkbox" />
                                Available
                            </label>
                            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                <input checked={form.isPopular} onChange={(event) => setForm((current) => ({ ...current, isPopular: event.target.checked }))} type="checkbox" />
                                Popular
                            </label>
                            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                <input checked={form.isFeatured} onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))} type="checkbox" />
                                Featured
                            </label>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Button
                            disabled={saveMutation.isPending}
                            onClick={() => saveMutation.mutate({
                                ...form,
                                ingredients: splitTags(ingredientsText),
                                allergens: splitTags(allergensText),
                                dietaryLabels: splitTags(labelsText),
                            })}
                            size="sm"
                        >
                            {editingFood ? 'Update food' : 'Create food'}
                        </Button>
                        {editingFood ? <Button disabled={saveMutation.isPending} onClick={resetForm} size="sm" variant="ghost">Cancel edit</Button> : null}
                    </div>
                </AdminSectionCard>
            </div>
        </div>
    );
}
