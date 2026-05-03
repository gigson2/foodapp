import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

type AdminEChartProps = {
    option: Record<string, unknown>;
    height?: number;
};

type EChartAxis = {
    axisLabel?: Record<string, unknown>;
    axisLine?: {
        show?: boolean;
        lineStyle?: Record<string, unknown>;
    };
    splitLine?: {
        show?: boolean;
        lineStyle?: Record<string, unknown>;
    };
    [key: string]: unknown;
};

function getChartPalette() {
    if (typeof window === 'undefined') {
        return {
            text: '#ede6fe',
            muted: '#b79cfc',
            primary: '#ff3333',
            accent: '#acf73b',
            secondary: '#33ff70',
            border: 'rgba(255,255,255,0.08)',
            divider: 'rgba(255,255,255,0.08)',
            surface: 'rgba(255,255,255,0.04)',
        };
    }

    const root = document.documentElement;
    const styles = window.getComputedStyle(document.documentElement);
    const isLight = root.classList.contains('light');

    return {
        text: isLight
            ? styles.getPropertyValue('--text-950').trim() || '#160f0c'
            : styles.getPropertyValue('--text-950').trim() || '#ede6fe',
        muted: isLight
            ? styles.getPropertyValue('--text-700').trim() || '#5d4332'
            : styles.getPropertyValue('--text-800').trim() || '#b79cfc',
        primary: styles.getPropertyValue('--primary-500').trim() || '#ff3333',
        accent: styles.getPropertyValue('--accent-500').trim() || '#acf73b',
        secondary: styles.getPropertyValue('--secondary-500').trim() || '#33ff70',
        border: isLight
            ? 'rgba(93, 67, 50, 0.24)'
            : styles.getPropertyValue('--ui-border').trim() || 'rgba(255,255,255,0.08)',
        divider: isLight
            ? 'rgba(93, 67, 50, 0.22)'
            : styles.getPropertyValue('--ui-divider').trim() || 'rgba(255,255,255,0.08)',
        surface: styles.getPropertyValue('--ui-surface-solid').trim() || 'rgba(255,255,255,0.04)',
    };
}

export function AdminEChart({ option, height = 320 }: AdminEChartProps) {
    const mergedOption = useMemo(() => {
        const palette = getChartPalette();
        const applyAxisTheme = (axis: unknown, type: 'x' | 'y') => {
            if (!axis || typeof axis !== 'object') {
                return axis;
            }

            const current = axis as EChartAxis;

            return {
                ...current,
                axisLabel: {
                    color: palette.muted,
                    ...(current.axisLabel ?? {}),
                },
                axisLine: {
                    show: true,
                    ...(current.axisLine ?? {}),
                    lineStyle: {
                        color: palette.divider,
                        ...((current.axisLine?.lineStyle as Record<string, unknown> | undefined) ?? {}),
                    },
                },
                splitLine: type === 'y'
                    ? {
                        show: true,
                        ...(current.splitLine ?? {}),
                        lineStyle: {
                            color: palette.divider,
                            ...((current.splitLine?.lineStyle as Record<string, unknown> | undefined) ?? {}),
                        },
                    }
                    : current.splitLine,
            };
        };

        return {
            textStyle: {
                color: palette.text,
                fontFamily: 'var(--font-sans, inherit)',
            },
            color: [palette.primary, palette.accent, palette.secondary, '#7dd3fc', '#f59e0b'],
            legend: {
                textStyle: {
                    color: palette.text,
                },
                ...((option.legend as Record<string, unknown> | undefined) ?? {}),
            },
            tooltip: {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                textStyle: {
                    color: palette.text,
                },
            },
            ...option,
            xAxis: Array.isArray(option.xAxis)
                ? option.xAxis.map((axis) => applyAxisTheme(axis, 'x'))
                : applyAxisTheme(option.xAxis, 'x'),
            yAxis: Array.isArray(option.yAxis)
                ? option.yAxis.map((axis) => applyAxisTheme(axis, 'y'))
                : applyAxisTheme(option.yAxis, 'y'),
        };
    }, [option]);

    return <ReactECharts option={mergedOption} style={{ height }} />;
}
