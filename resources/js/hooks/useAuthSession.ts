import axios from 'axios';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '@/services/sessionService';

export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

export function useAuthSession() {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: AUTH_SESSION_QUERY_KEY,
        queryFn: async () => {
            try {
                return await sessionService.getCurrentUser();
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    return null;
                }

                throw error;
            }
        },
        retry: false,
    });

    useEffect(() => {
        function handleUnauthorized() {
            queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
        }

        window.addEventListener('restaurant:unauthorized', handleUnauthorized);

        return () => window.removeEventListener('restaurant:unauthorized', handleUnauthorized);
    }, [queryClient]);

    return {
        ...query,
        user: query.data ?? null,
    };
}
