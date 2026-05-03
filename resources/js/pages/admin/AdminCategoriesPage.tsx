import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { AdminTableCard } from '@/components/admin/AdminTableCard';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { adminService } from '@/services/adminService';
import type { AdminCategory } from '@/types/admin';

export function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const [viewCategory, setViewCategory] = useState<AdminCategory | null>(null);

    const categoriesQuery = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: adminService.getCategories,
    });

    const invalidate = async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }),
            queryClient.invalidateQueries({ queryKey: ['public-categories'] }),
        ]);
    };

    const toggleMutation = useMutation({
        mutationFn: adminService.toggleCategoryActive,
        onSuccess: async (data) => {
            toast.success(data.is_active ? 'Category activated.' : 'Category deactivated.');
            await invalidate();
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
                                <th className="px-5 py-4">Status</th>
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
                                    <td className="px-5 py-4">
                                        <button
                                            aria-checked={category.is_active}
                                            aria-label={category.is_active ? 'Deactivate category' : 'Activate category'}
                                            className={[
                                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
                                                'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-500)] focus-visible:ring-offset-2',
                                                category.is_active
                                                    ? 'bg-[color:var(--primary-500)]'
                                                    : 'bg-white/20',
                                            ].join(' ')}
                                            disabled={toggleMutation.isPending}
                                            onClick={() => toggleMutation.mutate(category.id)}
                                            role="switch"
                                            type="button"
                                        >
                                            <span
                                                className={[
                                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0',
                                                    'transition duration-200 ease-in-out',
                                                    category.is_active ? 'translate-x-5' : 'translate-x-0',
                                                ].join(' ')}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Link to={`/admin/categories/${category.id}/edit`}>
                                                <Button size="sm" variant="secondary">Edit</Button>
                                            </Link>
                                            <Button
                                                onClick={() => setViewCategory(category)}
                                                size="sm"
                                                variant="ghost"
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </AdminTableCard>

            {viewCategory && createPortal(
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(3,1,16,0.78)] px-3 py-4 backdrop-blur-md sm:px-6"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setViewCategory(null);
                    }}
                >
                    <div className="ui-surface-solid relative w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <h2 className="text-lg font-semibold">{viewCategory.name}</h2>
                            <button
                                aria-label="Close"
                                className="flex-shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-500)]"
                                onClick={() => setViewCategory(null)}
                                type="button"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {viewCategory.image && (
                                <img
                                    alt={viewCategory.name}
                                    className="h-40 w-full rounded-xl object-cover"
                                    src={viewCategory.image}
                                />
                            )}

                            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                                <div className="rounded-lg bg-white/5 p-3">
                                    <p className="text-xs text-muted">Slug</p>
                                    <p className="mt-1 font-medium">{viewCategory.slug}</p>
                                </div>
                                <div className="rounded-lg bg-white/5 p-3">
                                    <p className="text-xs text-muted">Foods</p>
                                    <p className="mt-1 font-medium">{viewCategory.foods_count ?? 0}</p>
                                </div>
                                <div className="rounded-lg bg-white/5 p-3">
                                    <p className="text-xs text-muted">Sort order</p>
                                    <p className="mt-1 font-medium">{viewCategory.sort_order}</p>
                                </div>
                                <div className="col-span-2 rounded-lg bg-white/5 p-3 sm:col-span-1">
                                    <p className="text-xs text-muted">Status</p>
                                    <p className={['mt-1 font-medium', viewCategory.is_active ? 'text-green-400' : 'text-muted'].join(' ')}>
                                        {viewCategory.is_active ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>

                            {viewCategory.description && (
                                <div className="rounded-lg bg-white/5 p-3 text-sm">
                                    <p className="text-xs text-muted">Description</p>
                                    <p className="mt-1">{viewCategory.description}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Link to={`/admin/categories/${viewCategory.id}/edit`}>
                                <Button size="sm" variant="secondary">Edit</Button>
                            </Link>
                            <Button onClick={() => setViewCategory(null)} size="sm" variant="ghost">Close</Button>
                        </div>
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
}
