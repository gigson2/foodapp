import { Toaster } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

export function ToastProvider() {
    const { theme } = useTheme();

    return <Toaster position="top-right" richColors theme={theme} />;
}
