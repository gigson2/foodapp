import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/common/ToastProvider';
import { router } from '@/routes';

export function App() {
    return (
        <ThemeProvider>
            <ToastProvider />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}
