import { useQuery } from '@tanstack/react-query';
import { AdminPageHeading } from '@/components/admin/AdminPageHeading';
import { AdminTableCard } from '@/components/admin/AdminTableCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { adminService } from '@/services/adminService';
import { formatDateTime } from '@/utils/admin';

export function AdminVisitorsPage() {
    const visitorsQuery = useQuery({
        queryKey: ['admin', 'visitors'],
        queryFn: adminService.getVisitors,
    });

    const visitors = visitorsQuery.data ?? [];

    return (
        <div className="space-y-5">
            <AdminPageHeading
                description="Inspect privacy-conscious visitor traffic, landing pages, devices, and session activity captured by the CRM tracker."
                title="Visitor analytics"
            />

            <AdminTableCard
                description="Tracked visitor sessions with hashed IP information and event counts."
                title="Visitors"
            >
                {visitorsQuery.isLoading ? (
                    <div className="p-6">
                        <LoadingSpinner />
                    </div>
                ) : visitors.length === 0 ? (
                    <EmptyState description="Visitor sessions will appear here after tracking events are stored." title="No visitor sessions recorded" />
                ) : (
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-muted">
                            <tr>
                                <th className="px-5 py-4">Device</th>
                                <th className="px-5 py-4">Landing page</th>
                                <th className="px-5 py-4">Referrer</th>
                                <th className="px-5 py-4">Events</th>
                                <th className="px-5 py-4">Last seen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.map((visitor) => (
                                <tr className="border-b border-white/6 align-top" key={visitor.id}>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold">{visitor.device_type ?? 'Unknown device'}</p>
                                        <p className="mt-1 text-xs text-muted">{visitor.browser} on {visitor.platform}</p>
                                    </td>
                                    <td className="px-5 py-4">{visitor.landing_page ?? 'N/A'}</td>
                                    <td className="px-5 py-4">{visitor.referrer ?? 'Direct'}</td>
                                    <td className="px-5 py-4">{visitor.events_count ?? 0}</td>
                                    <td className="px-5 py-4">{formatDateTime(visitor.last_seen_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </AdminTableCard>
        </div>
    );
}
