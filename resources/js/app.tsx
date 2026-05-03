import axios from 'axios';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { toast } from 'sonner';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/common/ToastProvider';
import { router } from '@/routes';
import { normalizeApiError } from '@/services/apiClient';

function notifyUnexpectedError(error: unknown) {
    if (axios.isAxiosError(error)) {
        return;
    }

    const normalized = normalizeApiError(error);

    toast[normalized.variant](normalized.title, {
        description: normalized.description,
    });
}

const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onError: notifyUnexpectedError,
    }),
    queryCache: new QueryCache({
        onError: notifyUnexpectedError,
    }),
});

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
