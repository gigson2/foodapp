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

const categorySchema = z.object({
    name: z.string().trim().min(2, 'Name is required'),
    slug: z.string().trim().min(2, 'Slug is required'),
    description: z.string().trim().optional(),
    image: z.string().trim().optional(),
    sort_order: z.coerce.number().min(0),
    is_active: z.boolean(),
});

type CategoryFormInput = z.input<typeof categorySchema>;
type CategoryFormValues = z.output<typeof categorySchema>;

const defaultValues: CategoryFormInput = {
    name: '',
    slug: '',
    description: '',
    image: '',
    sort_order: 0,
    is_active: true,
};

export function AdminCategoryEditorPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const params = useParams();
    const categoryId = params.categoryId ? Number(params.categoryId) : null;
    const isEditing = Number.isFinite(categoryId);

    const categoryQuery = useQuery({
        queryKey: ['admin', 'categories', categoryId],
        queryFn: () => adminService.getCategory(categoryId as number),
        enabled: Boolean(isEditing && categoryId),
    });

    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
        reset,
        setValue,
    } = useForm<CategoryFormInput, unknown, CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues,
    });

    useEffect(() => {
        if (!categoryQuery.data) {
            return;
        }

        reset({
            name: categoryQuery.data.name,
            slug: categoryQuery.data.slug,
            description: categoryQuery.data.description ?? '',
            image: categoryQuery.data.image ?? '',
            sort_order: categoryQuery.data.sort_order,
            is_active: categoryQuery.data.is_active,
        });
    }, [categoryQuery.data, reset]);

    const saveMutation = useMutation({
        mutationFn: (values: CategoryFormValues) => {
            const payload = {
                name: values.name,
                slug: values.slug,
                description: values.description || null,
                image: values.image || null,
                sort_order: values.sort_order,
                is_active: values.is_active,
            };

            if (isEditing && categoryId) {
                return adminService.updateCategory(categoryId, payload);
            }

            return adminService.createCategory(payload);
        },
        onSuccess: async () => {
            toast.success(isEditing ? 'Category updated' : 'Category created');
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }),
                queryClient.invalidateQueries({ queryKey: ['public-categories'] }),
            ]);
            navigate('/admin/categories');
        },
    });

    const isActive = useWatch({ control, name: 'is_active' });
    const categoryImage = useWatch({ control, name: 'image' });

    if (isEditing && categoryQuery.isLoading) {
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
                    <Link to="/admin/categories">
                        <Button variant="secondary">Back to categories</Button>
                    </Link>
                }
                description="Create or edit a category used by the public menu and the admin catalog."
                title={isEditing ? 'Edit category' : 'Create category'}
            />

            <form className="grid gap-5 xl:grid-cols-[0.6fr_0.4fr]" onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
                <Card className="theme-panel space-y-4 p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input error={errors.name?.message} label="Name" {...register('name')} />
                        <Input error={errors.slug?.message} label="Slug" {...register('slug')} />
                    </div>
                    <Textarea label="Description" {...register('description')} />
                    <Input label="Image path or URL" {...register('image')} />
                    <Input error={errors.sort_order?.message} label="Sort order" type="number" {...register('sort_order')} />
                </Card>

                <Card className="theme-panel space-y-4 p-5">
                    <h2 className="text-2xl">Visibility and preview</h2>
                    <label className="flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm">
                        <input checked={Boolean(isActive)} className="h-4 w-4" type="checkbox" onChange={(event) => setValue('is_active', event.target.checked)} />
                        <span>Category is active on the storefront</span>
                    </label>

                    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/6">
                        {categoryImage ? (
                            <img alt="Category preview" className="h-56 w-full object-cover" src={categoryImage} />
                        ) : (
                            <div className="flex h-56 items-center justify-center text-sm text-muted">Image preview appears here.</div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button className="flex-1" type="submit">
                            {saveMutation.isPending ? <LoadingSpinner /> : null}
                            {isEditing ? 'Save changes' : 'Create category'}
                        </Button>
                        <Link className="flex-1" to="/admin/categories">
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
