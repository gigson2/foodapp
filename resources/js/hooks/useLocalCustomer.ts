import { useSyncExternalStore } from 'react';
import { authService } from '@/services/authService';

function subscribe(listener: () => void) {
    return authService.subscribe(listener);
}

function getSnapshot() {
    return authService.getCurrentCustomer();
}

export function useLocalCustomer() {
    const customer = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    return {
        customer,
        isLoggedIn: Boolean(customer),
        saveCustomer: authService.saveCustomer,
        logout: authService.logout,
        preparePhoneIdentity: authService.preparePhoneIdentity,
    };
}
