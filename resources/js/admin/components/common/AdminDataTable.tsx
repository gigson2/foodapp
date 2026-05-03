import * as React from 'react';
import * as DataTableModule from 'react-data-table-component';
import { AdminEmptyState } from '@/admin/components/common/AdminEmptyState';
import { AdminPaginationControls } from '@/admin/components/common/AdminPaginationControls';
import { useAdminResponsive } from '@/admin/hooks/useAdminResponsive';
import type { TableColumn, TableProps } from 'react-data-table-component';

type AdminDataTableProps<T> = {
    columns: TableColumn<T>[];
    data: T[];
    loading?: boolean;
    totalRows: number;
    currentPage: number;
    perPage: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (rowsPerPage: number, page: number) => void;
    noDataTitle?: string;
    noDataDescription?: string;
};

const customStyles = {
    table: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    headRow: {
        style: {
            backgroundColor: 'var(--ui-surface-muted)',
            borderBottomColor: 'var(--ui-divider)',
            minHeight: '56px',
        },
    },
    headCells: {
        style: {
            color: 'var(--text-800)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
        },
    },
    rows: {
        style: {
            backgroundColor: 'transparent',
            color: 'var(--text-950)',
            borderBottomColor: 'var(--ui-divider)',
            minHeight: '72px',
        },
        highlightOnHoverStyle: {
            backgroundColor: 'color-mix(in srgb, var(--primary-500) 9%, var(--ui-surface-solid))',
            transitionDuration: '0.15s',
            outline: '1px solid var(--ui-border-accent)',
        },
    },
    pagination: {
        style: {
            backgroundColor: 'transparent',
            color: 'var(--text-800)',
            borderTopColor: 'var(--ui-divider)',
            minHeight: '64px',
        },
        pageButtonsStyle: {
            borderRadius: '9999px',
            fill: 'var(--text-900)',
            color: 'var(--text-900)',
        },
    },
    cells: {
        style: {
            paddingTop: '1rem',
            paddingBottom: '1rem',
        },
    },
};

function resolveDataTableComponent(moduleValue: unknown): <T>(props: TableProps<T>) => React.JSX.Element {
    let candidate = moduleValue as Record<string, unknown> | undefined;

    for (let depth = 0; depth < 5; depth += 1) {
        if (typeof candidate === 'function') {
            return candidate as <T>(props: TableProps<T>) => React.JSX.Element;
        }

        if (candidate && typeof candidate === 'object' && '$$typeof' in candidate) {
            return candidate as unknown as <T>(props: TableProps<T>) => React.JSX.Element;
        }

        if (candidate && typeof candidate === 'object' && 'default' in candidate) {
            candidate = candidate.default as Record<string, unknown> | undefined;
            continue;
        }

        break;
    }

    throw new Error('Unable to resolve react-data-table-component export.');
}

const ResolvedDataTable = resolveDataTableComponent(DataTableModule);

function getColumnLabel<T>(column: TableColumn<T>, index: number) {
    if (typeof column.name === 'string') {
        return column.name;
    }

    return `Field ${index + 1}`;
}

function renderColumnValue<T>(column: TableColumn<T>, row: T, rowIndex: number) {
    const format = (column as { format?: (row: T, rowIndex: number) => React.ReactNode }).format;
    const selector = (column as { selector?: ((row: T, rowIndex?: number) => React.ReactNode) | string }).selector;

    if (typeof column.cell === 'function') {
        return column.cell(row, rowIndex, column, String(rowIndex));
    }

    if (typeof format === 'function') {
        return format(row, rowIndex);
    }

    if (typeof selector === 'function') {
        return selector(row, rowIndex);
    }

    if (typeof selector === 'string' && selector in (row as Record<string, unknown>)) {
        return (row as Record<string, React.ReactNode>)[selector];
    }

    return null;
}

function hasRenderableValue(value: React.ReactNode) {
    if (value === null || value === undefined || value === false) {
        return false;
    }

    if (typeof value === 'string') {
        return value.trim() !== '';
    }

    return true;
}

export function AdminDataTable<T>({
    columns,
    data,
    loading = false,
    totalRows,
    currentPage,
    perPage,
    onPageChange,
    onPerPageChange,
    noDataTitle = 'No records',
    noDataDescription = 'No records match the current filters.',
}: AdminDataTableProps<T>) {
    const { isMobile, isTablet } = useAdminResponsive();
    const isCompactView = isMobile || isTablet;
    const lastPage = Math.max(1, Math.ceil(totalRows / Math.max(1, perPage)));
    const from = totalRows === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const to = totalRows === 0 ? 0 : Math.min(totalRows, from + data.length - 1);

    if (loading && data.length === 0) {
        return (
            <div className="px-5 py-8 text-sm text-muted">
                Loading records...
            </div>
        );
    }

    if (data.length === 0) {
        return <AdminEmptyState description={noDataDescription} title={noDataTitle} />;
    }

    if (isCompactView) {
        return (
            <div>
                <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-1">
                    {data.map((row, rowIndex) => (
                        <article
                            className="ui-surface-raised rounded-[1.35rem] p-4"
                            key={rowIndex}
                        >
                            <div className="space-y-3">
                                {columns.map((column, columnIndex) => {
                                    const value = renderColumnValue(column, row, rowIndex);

                                    if (!hasRenderableValue(value)) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            className="grid gap-1 border-b border-white/6 pb-3 last:border-b-0 last:pb-0"
                                            key={`${columnIndex}-${getColumnLabel(column, columnIndex)}`}
                                        >
                                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">
                                                {getColumnLabel(column, columnIndex)}
                                            </p>
                                            <div className="text-sm text-[color:var(--text-950)]">
                                                {value}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </article>
                    ))}
                </div>

                <AdminPaginationControls
                    meta={{
                        currentPage,
                        from,
                        lastPage,
                        perPage,
                        to,
                        total: totalRows,
                    }}
                    onPageChange={onPageChange}
                    onPerPageChange={(nextPerPage) => onPerPageChange(nextPerPage, 1)}
                />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <ResolvedDataTable
                columns={columns}
                customStyles={customStyles}
                data={data}
                highlightOnHover
                noDataComponent={<AdminEmptyState description={noDataDescription} title={noDataTitle} />}
                pagination
                paginationDefaultPage={currentPage}
                paginationPerPage={perPage}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                paginationServer
                paginationTotalRows={totalRows}
                progressPending={loading}
                responsive
                onChangePage={onPageChange}
                onChangeRowsPerPage={onPerPageChange}
            />
        </div>
    );
}
