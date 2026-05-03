import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/common/ToastProvider';
import { router } from '@/routes';

const queryClient = new QueryClient();

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <ToastProvider />
                <RouterProvider router={router} />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
