import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { AdminTableCard } from '@/components/admin/AdminTableCard';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MoneyDisplay } from '@/components/ordering/MoneyDisplay';
import { adminService } from '@/services/adminService';

export function AdminFoodsPage() {
    const queryClient = useQueryClient();
    const foodsQuery = useQuery({
        queryKey: ['admin', 'foods'],
        queryFn: adminService.getFoods,
    });

    const deleteMutation = useMutation({
        mutationFn: adminService.deleteFood,
        onSuccess: async (message) => {
            toast.success(message);
            await queryClient.invalidateQueries({ queryKey: ['admin', 'foods'] });
            await queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
        },
    });

    const foods = foodsQuery.data ?? [];

    return (
        <div className="space-y-5">
            <AdminPageHeading
                actions={
                    <Link to="/admin/foods/new">
                        <Button>Add food</Button>
                    </Link>
                }
                description="Create and maintain the public pickup menu, pricing, availability, and featured food presentation."
                title="Food management"
            />

            <AdminTableCard
                description="Current foods stored in the restaurant catalog."
                title="Foods"
            >
                {foodsQuery.isLoading ? (
                    <div className="p-6">
                        <LoadingSpinner />
                    </div>
                ) : foods.length === 0 ? (
                    <EmptyState description="Create the first public food item to populate the customer menu." title="No foods configured" />
                ) : (
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                            <tr>
                                <th className="px-5 py-4">Food</th>
                                <th className="px-5 py-4">Category</th>
                                <th className="px-5 py-4">Availability</th>
                                <th className="px-5 py-4">Price</th>
                                <th className="px-5 py-4">Prep</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foods.map((food) => (
                                <tr className="border-b border-white/6 align-top" key={food.id}>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold">{food.name}</p>
                                        <p className="mt-1 text-xs text-muted">{food.short_description ?? food.description}</p>
                                    </td>
                                    <td className="px-5 py-4">{food.category?.name ?? 'N/A'}</td>
                                    <td className="px-5 py-4">{food.is_available ? 'Available' : 'Hidden'}</td>
                                    <td className="px-5 py-4"><MoneyDisplay amount={food.price} /></td>
                                    <td className="px-5 py-4">{food.preparation_time_minutes} min</td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Link to={`/admin/foods/${food.id}/edit`}>
                                                <Button size="sm" variant="secondary">Edit</Button>
                                            </Link>
                                            {!food.deleted_at ? (
                                                <Button onClick={() => deleteMutation.mutate(food.id)} size="sm" variant="ghost">
                                                    Archive
                                                </Button>
                                            ) : null}
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
