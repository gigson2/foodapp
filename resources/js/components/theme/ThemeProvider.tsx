import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { ThemeContext, type ThemeContextValue, type ThemeMode } from '@/components/theme/ThemeContext';

const STORAGE_KEY = 'restaurant-theme';

export function ThemeProvider({ children }: PropsWithChildren) {
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        if (typeof window === 'undefined') {
            return 'dark';
        }

        return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(theme);
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
        window.localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const value = useMemo<ThemeContextValue>(
        () => ({
            theme,
            toggleTheme: () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')),
            setTheme: (nextTheme) => setThemeState(nextTheme),
        }),
        [theme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
