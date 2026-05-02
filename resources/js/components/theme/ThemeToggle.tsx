import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { IconButton } from '@/components/common/IconButton';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <IconButton
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
        >
            {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </IconButton>
    );
}
