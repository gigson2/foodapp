import { Toaster } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

export function ToastProvider() {
    const { theme } = useTheme();

    return (
        <Toaster
            closeButton
            duration={4200}
            position="top-right"
            richColors
            theme={theme}
            toastOptions={{
                className: 'ui-surface-solid ui-outline-strong',
                descriptionClassName: 'text-muted',
            }}
            visibleToasts={5}
        />
    );
}
