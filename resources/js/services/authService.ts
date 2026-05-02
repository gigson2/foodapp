import type { Customer } from '@/types';
import { createId } from '@/utils/ids';
import { readStorage, removeStorage, writeStorage } from '@/utils/storage';

const CUSTOMER_KEY = 'restaurant.customer';
const listeners = new Set<() => void>();

function notify() {
    listeners.forEach((listener) => listener());
}

export const authService = {
    getCurrentCustomer(): Customer | null {
        return readStorage<Customer | null>(CUSTOMER_KEY, null);
    },
    saveCustomer(input: Pick<Customer, 'name' | 'phone'>): Customer {
        const customer: Customer = {
            id: createId('customer'),
            name: input.name.trim(),
            phone: input.phone.trim(),
        };

        writeStorage(CUSTOMER_KEY, customer);
        notify();

        return customer;
    },
    logout() {
        removeStorage(CUSTOMER_KEY);
        notify();
    },
    subscribe(listener: () => void) {
        listeners.add(listener);

        return () => listeners.delete(listener);
    },
    async preparePhoneIdentity(phone: string) {
        return {
            phone,
            authMode: 'simple_phone_identity' as const,
            upgradePath: 'otp_sms' as const,
        };
    },
};
