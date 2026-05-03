import axios from 'axios';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { toast } from 'sonner';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/common/ToastProvider';
import { router } from '@/routes';
import { normalizeApiError } from '@/services/apiClient';
import { publicService, PUBLIC_COMPANY_SETTINGS_QUERY_KEY } from '@/services/publicService';
import { buildCompanyPageTitle } from '@/utils/company';

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

function updateLinkHref(rel: string, href: string | null | undefined) {
    if (!href) {
        return;
    }

    const selector = `link[rel="${rel}"]`;
    const link = document.querySelector<HTMLLinkElement>(selector);

    if (link) {
        link.href = href;
    }
}

function BrandingSync() {
    const { data: companySettings } = useQuery({
        queryKey: PUBLIC_COMPANY_SETTINGS_QUERY_KEY,
        queryFn: publicService.getCompanySettings,
    });

    useEffect(() => {
        document.title = buildCompanyPageTitle(companySettings);

        if (companySettings?.favicon) {
            updateLinkHref('icon', companySettings.favicon);
            updateLinkHref('shortcut icon', companySettings.favicon);
        }
    }, [companySettings]);

    return null;
}

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <ToastProvider />
                <BrandingSync />
                <RouterProvider router={router} />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
