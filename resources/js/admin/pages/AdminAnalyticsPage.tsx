import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TableColumn } from 'react-data-table-component';
import { AdminDataTable } from '@/admin/components/common/AdminDataTable';
import { AdminEChart } from '@/admin/components/common/AdminEChart';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSearchInput } from '@/admin/components/common/AdminSearchInput';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { KpiCard } from '@/admin/components/dashboard/KpiCard';
import { adminAnalyticsService } from '@/admin/services/adminAnalyticsService';
import type { AdminVisitorSession } from '@/types/admin';
import { formatAdminDateTime } from '@/admin/utils/adminDates';

export function AdminAnalyticsPage() {
    const [visitorPage, setVisitorPage] = useState(1);
    const [visitorPerPage, setVisitorPerPage] = useState(10);
    const [visitorSearch, setVisitorSearch] = useState('');

    const analyticsQuery = useQuery({
        queryKey: ['admin-app', 'analytics'],
        queryFn: adminAnalyticsService.getAnalytics,
    });
    const visitorsQuery = useQuery({
        queryKey: ['admin-app', 'visitors', { visitorPage, visitorPerPage, visitorSearch }],
        queryFn: () => adminAnalyticsService.getVisitors({ page: visitorPage, perPage: visitorPerPage, search: visitorSearch }),
    });

    const metrics = analyticsQuery.data?.metrics;
    const deviceBreakdown = analyticsQuery.data?.device_breakdown ?? [];
    const topFoods = analyticsQuery.data?.top_foods ?? [];
    const recentEvents = analyticsQuery.data?.recent_events.data ?? [];
    const visitors = visitorsQuery.data?.data ?? [];
    const visitorsMeta = visitorsQuery.data?.meta ? {
        currentPage: visitorsQuery.data.meta.current_page,
        lastPage: visitorsQuery.data.meta.last_page,
        perPage: visitorsQuery.data.meta.per_page,
        total: visitorsQuery.data.meta.total,
        from: visitorsQuery.data.meta.from,
        to: visitorsQuery.data.meta.to,
    } : null;
    const visitorColumns: TableColumn<AdminVisitorSession>[] = [
        {
            name: 'Session',
            cell: (visitor) => <span className="font-semibold">{visitor.session_key}</span>,
        },
        {
            name: 'Device',
            cell: (visitor) => <span>{visitor.device_type ?? 'unknown'}</span>,
        },
        {
            name: 'Browser',
            cell: (visitor) => <span>{visitor.browser ?? 'unknown'}</span>,
        },
        {
            name: 'Platform',
            cell: (visitor) => <span>{visitor.platform ?? 'unknown'}</span>,
        },
        {
            name: 'Landing',
            cell: (visitor) => <span className="text-sm text-muted">{visitor.landing_page ?? 'N/A'}</span>,
        },
        {
            name: 'Events',
            cell: (visitor) => <span>{visitor.events_count ?? 0}</span>,
        },
        {
            name: 'Last seen',
            cell: (visitor) => <span className="text-sm text-muted">{visitor.last_seen_at ? formatAdminDateTime(visitor.last_seen_at) : 'N/A'}</span>,
        },
    ];
    const eventColumns: TableColumn<(typeof recentEvents)[number]>[] = [
        {
            name: 'Event',
            cell: (event) => (
                <div>
                    <p className="font-semibold">{event.event_name}</p>
                    <p className="mt-1 text-xs text-muted">{event.event_type.replaceAll('_', ' ')}</p>
                </div>
            ),
        },
        {
            name: 'Page',
            cell: (event) => <span className="text-sm text-muted">{event.page_url ?? 'N/A'}</span>,
        },
        {
            name: 'Session',
            cell: (event) => <span>{event.visitor_session?.session_key ?? 'Unknown'}</span>,
        },
        {
            name: 'Created',
            cell: (event) => <span className="text-sm text-muted">{formatAdminDateTime(event.created_at)}</span>,
        },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                description="Track visitor behavior, top-performing foods, and recent activity signals from the live restaurant data set."
                title="Analytics"
            />

            {metrics ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard label="Total visitors" value={String(metrics.total_visitors)} />
                    <KpiCard label="Today visitors" value={String(metrics.today_visitors)} />
                    <KpiCard label="Returning visitors" value={String(metrics.returning_visitors)} />
                    <KpiCard label="Food views" value={String(metrics.food_views)} />
                    <KpiCard label="Menu clicks" value={String(metrics.menu_clicks)} />
                    <KpiCard label="Order starts" value={String(metrics.order_starts)} />
                    <KpiCard label="Completed orders" value={String(metrics.completed_orders)} />
                    <KpiCard label="Review submissions" value={String(metrics.review_submissions)} />
                </div>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-3">
                <AdminSectionCard className="p-5 sm:p-6">
                    <h2 className="text-2xl">Device breakdown</h2>
                    <div className="mt-5">
                        <AdminEChart
                            height={300}
                            option={{
                                tooltip: { trigger: 'item' },
                                series: [
                                    {
                                        type: 'pie',
                                        radius: ['45%', '72%'],
                                        itemStyle: { borderRadius: 10, borderColor: 'rgba(12,2,49,0.2)', borderWidth: 2 },
                                        data: deviceBreakdown.map((item) => ({
                                            name: item.device_type,
                                            value: item.total,
                                        })),
                                    },
                                ],
                            }}
                        />
                    </div>
                </AdminSectionCard>

                <AdminSectionCard className="p-5 sm:p-6 xl:col-span-2">
                    <h2 className="text-2xl">Top foods</h2>
                    <div className="mt-5">
                        <AdminEChart
                            height={300}
                            option={{
                                grid: { left: 24, right: 16, top: 16, bottom: 48, containLabel: true },
                                xAxis: {
                                    type: 'category',
                                    data: topFoods.map((food) => food.name),
                                    axisLabel: { interval: 0, rotate: 18 },
                                    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
                                },
                                yAxis: {
                                    type: 'value',
                                    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
                                },
                                series: [
                                    {
                                        type: 'bar',
                                        data: topFoods.map((food) => food.orders_count),
                                        barWidth: '48%',
                                        itemStyle: { borderRadius: [12, 12, 0, 0] },
                                    },
                                ],
                            }}
                        />
                    </div>
                </AdminSectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <AdminSectionCard className="overflow-hidden p-5 sm:p-6">
                    <h2 className="text-2xl">Recent visitor events</h2>
                    <div className="mt-5">
                        <AdminDataTable
                            columns={eventColumns}
                            currentPage={1}
                            data={recentEvents}
                            loading={analyticsQuery.isLoading}
                            perPage={10}
                            totalRows={recentEvents.length}
                            onPageChange={() => {}}
                            onPerPageChange={() => {}}
                        />
                    </div>
                </AdminSectionCard>

                <AdminSectionCard className="overflow-hidden">
                    <div className="border-b border-white/10 px-5 py-5">
                        <AdminSearchInput onChange={(value) => { setVisitorSearch(value); setVisitorPage(1); }} placeholder="Search visitor session, browser, platform, or user" value={visitorSearch} />
                    </div>
                    {visitorsMeta ? (
                        <AdminDataTable
                            columns={visitorColumns}
                            currentPage={visitorPage}
                            data={visitors}
                            loading={visitorsQuery.isLoading}
                            perPage={visitorPerPage}
                            totalRows={visitorsMeta.total}
                            onPageChange={setVisitorPage}
                            onPerPageChange={(nextPerPage) => {
                                setVisitorPerPage(nextPerPage);
                                setVisitorPage(1);
                            }}
                        />
                    ) : null}
                </AdminSectionCard>
            </div>
        </div>
    );
}
