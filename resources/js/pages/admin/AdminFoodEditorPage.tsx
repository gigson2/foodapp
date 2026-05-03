import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Textarea } from '@/components/common/Textarea';
import { adminService } from '@/services/adminService';
import { csvToList, listToCsv } from '@/utils/admin';

const foodSchema = z.object({
    category_id: z.coerce.number().min(1, 'Category is required'),
    name: z.string().trim().min(2, 'Name is required'),
    slug: z.string().trim().min(2, 'Slug is required'),
    description: z.string().trim().min(10, 'Description is required'),
    short_description: z.string().trim().optional(),
    image: z.string().trim().optional(),
    price: z.coerce.number().min(0, 'Price is required'),
    preparation_time_minutes: z.coerce.number().min(0).max(240),
    ingredients_csv: z.string().optional(),
    allergens_csv: z.string().optional(),
    dietary_labels_csv: z.string().optional(),
    sort_order: z.coerce.number().min(0),
    seo_title: z.string().trim().optional(),
    seo_description: z.string().trim().optional(),
    is_available: z.boolean(),
    is_featured: z.boolean(),
    is_popular: z.boolean(),
});

type FoodFormInput = z.input<typeof foodSchema>;
type FoodFormValues = z.output<typeof foodSchema>;

const defaultValues: FoodFormInput = {
    category_id: 0,
    name: '',
    slug: '',
    description: '',
    short_description: '',
    image: '',
    price: 0,
    preparation_time_minutes: 30,
    ingredients_csv: '',
    allergens_csv: '',
    dietary_labels_csv: '',
    sort_order: 0,
    seo_title: '',
    seo_description: '',
    is_available: true,
    is_featured: false,
    is_popular: false,
};

export function AdminFoodEditorPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const params = useParams();
    const foodId = params.foodId ? Number(params.foodId) : null;
    const isEditing = Number.isFinite(foodId);

    const categoriesQuery = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: adminService.getCategories,
    });
    const foodQuery = useQuery({
        queryKey: ['admin', 'foods', foodId],
        queryFn: () => adminService.getFood(foodId as number),
        enabled: Boolean(isEditing && foodId),
    });

    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
        reset,
        setValue,
    } = useForm<FoodFormInput, unknown, FoodFormValues>({
        resolver: zodResolver(foodSchema),
        defaultValues,
    });

    useEffect(() => {
        if (!foodQuery.data) {
            return;
        }

        reset({
            category_id: foodQuery.data.category_id,
            name: foodQuery.data.name,
            slug: foodQuery.data.slug,
            description: foodQuery.data.description,
            short_description: foodQuery.data.short_description ?? '',
            image: foodQuery.data.image ?? '',
            price: foodQuery.data.price,
            preparation_time_minutes: foodQuery.data.preparation_time_minutes,
            ingredients_csv: listToCsv(foodQuery.data.ingredients),
            allergens_csv: listToCsv(foodQuery.data.allergens),
            dietary_labels_csv: listToCsv(foodQuery.data.dietary_labels),
            sort_order: foodQuery.data.sort_order,
            seo_title: foodQuery.data.seo_title ?? '',
            seo_description: foodQuery.data.seo_description ?? '',
            is_available: foodQuery.data.is_available,
            is_featured: foodQuery.data.is_featured,
            is_popular: foodQuery.data.is_popular,
        });
    }, [foodQuery.data, reset]);

    const saveMutation = useMutation({
        mutationFn: async (values: FoodFormValues) => {
            const payload = {
                category_id: values.category_id,
                name: values.name,
                slug: values.slug,
                description: values.description,
                short_description: values.short_description || null,
                image: values.image || null,
                price: values.price,
                preparation_time_minutes: values.preparation_time_minutes,
                ingredients: csvToList(values.ingredients_csv ?? ''),
                allergens: csvToList(values.allergens_csv ?? ''),
                dietary_labels: csvToList(values.dietary_labels_csv ?? ''),
                sort_order: values.sort_order,
                seo_title: values.seo_title || null,
                seo_description: values.seo_description || null,
                is_available: values.is_available,
                is_featured: values.is_featured,
                is_popular: values.is_popular,
            };

            if (isEditing && foodId) {
                return adminService.updateFood(foodId, payload);
            }

            return adminService.createFood(payload);
        },
        onSuccess: async () => {
            toast.success(isEditing ? 'Food updated' : 'Food created');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin', 'foods'] }),
                queryClient.invalidateQueries({ queryKey: ['public-foods'] }),
            ]);
            navigate('/admin/foods');
        },
    });

    const categories = categoriesQuery.data ?? [];
    const imagePreview = useWatch({ control, name: 'image' });
    const isAvailable = useWatch({ control, name: 'is_available' });
    const isFeatured = useWatch({ control, name: 'is_featured' });
    const isPopular = useWatch({ control, name: 'is_popular' });

    if (isEditing && foodQuery.isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <AdminPageHeading
                actions={
                    <Link to="/admin/foods">
                        <Button variant="secondary">Back to foods</Button>
                    </Link>
                }
                description="Configure menu details, presentation, ordering metadata, and public visibility for a single food item."
                title={isEditing ? 'Edit food' : 'Create food'}
            />

            <form className="grid gap-5 xl:grid-cols-[0.6fr_0.4fr]" onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
                <Card className="theme-panel space-y-4 p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block space-y-2">
                            <span className="text-sm font-medium text-[color:var(--text-950)]">Category</span>
                            <select className="theme-field w-full rounded-2xl px-4 py-3" {...register('category_id')}>
                                <option value={0}>Select category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id ? <span className="text-sm text-[color:var(--primary-800)]">{errors.category_id.message}</span> : null}
                        </label>
                        <Input error={errors.price?.message} label="Price" step="0.01" type="number" {...register('price')} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Input error={errors.name?.message} label="Name" {...register('name')} />
                        <Input error={errors.slug?.message} label="Slug" {...register('slug')} />
                    </div>

                    <Textarea error={errors.description?.message} label="Description" {...register('description')} />
                    <Input error={errors.short_description?.message} label="Short description" {...register('short_description')} />
                    <Input error={errors.image?.message} label="Image path or URL" {...register('image')} />

                    <div className="grid gap-4 md:grid-cols-2">
                        <Input error={errors.preparation_time_minutes?.message} label="Preparation time (minutes)" type="number" {...register('preparation_time_minutes')} />
                        <Input error={errors.sort_order?.message} label="Sort order" type="number" {...register('sort_order')} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Input label="Ingredients" placeholder="seasoning, onions, tomatoes" {...register('ingredients_csv')} />
                        <Input label="Allergens" placeholder="nuts, dairy" {...register('allergens_csv')} />
                        <Input label="Dietary labels" placeholder="spicy, gluten free" {...register('dietary_labels_csv')} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Input label="SEO title" {...register('seo_title')} />
                        <Textarea className="min-h-24" label="SEO description" {...register('seo_description')} />
                    </div>
                </Card>

                <Card className="theme-panel space-y-4 p-5">
                    <h2 className="text-2xl">Visibility and preview</h2>
                    <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm">
                        <label className="flex items-center gap-3">
                            <input checked={Boolean(isAvailable)} className="h-4 w-4" type="checkbox" onChange={(event) => setValue('is_available', event.target.checked)} />
                            <span>Available to customers</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input checked={Boolean(isFeatured)} className="h-4 w-4" type="checkbox" onChange={(event) => setValue('is_featured', event.target.checked)} />
                            <span>Featured on storefront</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input checked={Boolean(isPopular)} className="h-4 w-4" type="checkbox" onChange={(event) => setValue('is_popular', event.target.checked)} />
                            <span>Marked popular</span>
                        </label>
                    </div>

                    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/6">
                        {imagePreview ? (
                            <img alt="Food preview" className="h-56 w-full object-cover" src={imagePreview} />
                        ) : (
                            <div className="flex h-56 items-center justify-center text-sm text-muted">Image preview appears here.</div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button className="flex-1" type="submit">
                            {saveMutation.isPending ? <LoadingSpinner /> : null}
                            {isEditing ? 'Save changes' : 'Create food'}
                        </Button>
                        <Link className="flex-1" to="/admin/foods">
                            <Button className="w-full" type="button" variant="ghost">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </Card>
            </form>
        </div>
    );
}
