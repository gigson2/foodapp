import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { sessionService } from '@/services/sessionService';

export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

export function useAuthSession() {
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

    return {
        ...query,
        user: query.data ?? null,
    };
}
