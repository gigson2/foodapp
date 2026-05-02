import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

export type ThemeMode = 'dark' | 'light';

type ThemeContextValue = {
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
};

const STORAGE_KEY = 'restaurant-theme';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

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
