import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, RotateCcw, X } from 'lucide-react';
import type { TableColumn } from 'react-data-table-component';
import { toast } from 'sonner';
import { AdminBadge } from '@/admin/components/common/AdminBadge';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminFilterSelect } from '@/admin/components/common/AdminFilterSelect';
import { IconButton } from '@/components/common/IconButton';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSearchInput } from '@/admin/components/common/AdminSearchInput';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminReviewService } from '@/admin/services/adminReviewService';
import type { AdminReviewStatus, AdminReviewSummary } from '@/admin/types/adminReview';
import { formatRelativeDayLabel } from '@/admin/utils/adminDates';

function getReviewStatusClass(status: AdminReviewStatus) {
    switch (status) {
        case 'approved':
            return 'border-emerald-500/30 bg-emerald-500/14 text-emerald-300';
        case 'rejected':
            return 'border-rose-500/30 bg-rose-500/14 text-rose-300';
        default:
            return 'border-amber-500/30 bg-amber-500/14 text-amber-300';
    }
}

export function AdminReviewsPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    const reviewsQuery = useQuery({
        queryKey: ['admin-app', 'reviews', { page, perPage, search, status }],
        queryFn: () => adminReviewService.getReviews({ page, perPage, search, status }),
    });

    const statusMutation = useMutation({
        mutationFn: ({ reviewId, nextStatus }: { reviewId: string; nextStatus: AdminReviewStatus }) => adminReviewService.updateStatus(reviewId, nextStatus),
        onSuccess: async (_, variables) => {
            toast.success(`Review marked ${variables.nextStatus.replace('_', ' ')}`);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'reviews'] }),
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'dashboard'] }),
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'notifications'] }),
            ]);
        },
    });

    const reviews = reviewsQuery.data?.items ?? [];
    const meta = reviewsQuery.data?.meta;
    const columns: TableColumn<AdminReviewSummary>[] = [
        {
            name: 'Customer',
            cell: (review) => (
                <div>
                    <p className="font-semibold">{review.customerName}</p>
                    <p className="mt-1 text-xs text-muted">{review.customerPhone}</p>
                </div>
            ),
        },
        {
            name: 'Rating',
            cell: (review) => <span className="text-[color:var(--accent-500)]">{'★'.repeat(review.rating)}</span>,
        },
        {
            name: 'Review',
            grow: 1.6,
            cell: (review) => (
                <div>
                    <p className="text-sm text-muted">{review.message}</p>
                    {review.foodName ? <p className="mt-1 text-xs text-muted">{review.foodName}</p> : null}
                </div>
            ),
        },
        {
            name: 'Status',
            cell: (review) => <AdminBadge className={getReviewStatusClass(review.status)}>{review.status}</AdminBadge>,
        },
        {
            name: 'Date',
            cell: (review) => <span className="text-sm text-muted">{formatRelativeDayLabel(review.createdAt)}</span>,
        },
        {
            name: 'Actions',
            grow: 1.2,
            cell: (review) => (
                <div className="flex flex-wrap gap-3">
                    <IconButton aria-label={`Approve review from ${review.customerName}`} className="h-10 w-10 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/42 hover:bg-emerald-500/12" onClick={() => statusMutation.mutate({ reviewId: review.id, nextStatus: 'approved' })}>
                        <Check className="h-4 w-4" />
                    </IconButton>
                    <IconButton aria-label={`Reject review from ${review.customerName}`} className="h-10 w-10 border-rose-500/30 text-rose-300 hover:border-rose-500/42 hover:bg-rose-500/12" onClick={() => statusMutation.mutate({ reviewId: review.id, nextStatus: 'rejected' })}>
                        <X className="h-4 w-4" />
                    </IconButton>
                    <IconButton aria-label={`Mark review from ${review.customerName} as pending`} className="h-10 w-10" onClick={() => statusMutation.mutate({ reviewId: review.id, nextStatus: 'pending' })}>
                        <RotateCcw className="h-4 w-4" />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                description="Approve, reject, or return reviews to pending. Only approved reviews should appear on the public storefront."
                title="Reviews"
            />

            <AdminSectionCard className="overflow-hidden">
                <div className="grid gap-4 border-b border-white/10 px-5 py-5 lg:grid-cols-[1.2fr_0.6fr]">
                    <AdminSearchInput label="Search" onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search customer name, phone, food, or review text" value={search} />
                    <AdminFilterSelect
                        label="Status"
                        onChange={(value) => { setStatus(value); setPage(1); }}
                        options={[
                            { label: 'All statuses', value: '' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Approved', value: 'approved' },
                            { label: 'Rejected', value: 'rejected' },
                        ]}
                        value={status}
                    />
                </div>

                {meta ? (
                    <AdminDataTable
                        columns={columns}
                        currentPage={page}
                        data={reviews}
                        loading={reviewsQuery.isLoading}
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
        </div>
    );
}
