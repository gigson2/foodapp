import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminPaginationMeta } from '@/admin/services/adminApiClient';

type AdminPaginationControlsProps = {
    meta: AdminPaginationMeta;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
};

const perPageOptions = [10, 20, 50, 100];

export function AdminPaginationControls({ meta, onPageChange, onPerPageChange }: AdminPaginationControlsProps) {
    return (
        <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted">
                Showing {meta.from ?? 0}-{meta.to ?? 0} of {meta.total}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex items-center gap-3 text-sm text-muted">
                    <span>Rows per page</span>
                    <select
                        className="theme-field rounded-xl px-3 py-2"
                        onChange={(event) => onPerPageChange(Number(event.target.value))}
                        value={meta.perPage}
                    >
                        {perPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex items-center gap-2">
                    <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 disabled:opacity-40"
                        disabled={meta.currentPage <= 1}
                        onClick={() => onPageChange(meta.currentPage - 1)}
                        type="button"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="min-w-20 text-center text-sm font-semibold">
                        Page {meta.currentPage} / {meta.lastPage}
                    </span>
                    <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 disabled:opacity-40"
                        disabled={meta.currentPage >= meta.lastPage}
                        onClick={() => onPageChange(meta.currentPage + 1)}
                        type="button"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
