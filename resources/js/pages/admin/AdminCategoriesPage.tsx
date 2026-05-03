import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { AdminTableCard } from '@/components/admin/AdminTableCard';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { adminService } from '@/services/adminService';

export function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const categoriesQuery = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: adminService.getCategories,
    });

    const deleteMutation = useMutation({
        mutationFn: adminService.deleteCategory,
        onSuccess: async (message) => {
            toast.success(message);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }),
                queryClient.invalidateQueries({ queryKey: ['public-categories'] }),
            ]);
        },
    });

    const categories = categoriesQuery.data ?? [];

    return (
        <div className="space-y-5">
            <AdminPageHeading
                actions={
                    <Link to="/admin/categories/new">
                        <Button>Add category</Button>
                    </Link>
                }
                description="Maintain the public menu structure, category ordering, images, and availability."
                title="Category management"
            />

            <AdminTableCard
                description="Current food categories configured for the storefront."
                title="Categories"
            >
                {categoriesQuery.isLoading ? (
                    <div className="p-6">
                        <LoadingSpinner />
                    </div>
                ) : categories.length === 0 ? (
                    <EmptyState description="Create the first category to organize the public menu." title="No categories configured" />
                ) : (
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                            <tr>
                                <th className="px-5 py-4">Category</th>
                                <th className="px-5 py-4">Slug</th>
                                <th className="px-5 py-4">Foods</th>
                                <th className="px-5 py-4">Active</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr className="border-b border-white/6" key={category.id}>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold">{category.name}</p>
                                        <p className="mt-1 text-xs text-muted">{category.description}</p>
                                    </td>
                                    <td className="px-5 py-4">{category.slug}</td>
                                    <td className="px-5 py-4">{category.foods_count ?? 0}</td>
                                    <td className="px-5 py-4">{category.is_active ? 'Yes' : 'No'}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Link to={`/admin/categories/${category.id}/edit`}>
                                                <Button size="sm" variant="secondary">Edit</Button>
                                            </Link>
                                            <Button onClick={() => deleteMutation.mutate(category.id)} size="sm" variant="ghost">
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </AdminTableCard>
        </div>
    );
}
