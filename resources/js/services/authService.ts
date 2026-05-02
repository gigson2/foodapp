import type { Customer } from '@/types';
import { createId } from '@/utils/ids';
import { formatUsPhone, normalizeUsPhone } from '@/utils/phone';
import { readStorage, removeStorage, writeStorage } from '@/utils/storage';

const CUSTOMER_KEY = 'restaurant.customer';
const listeners = new Set<() => void>();
let currentCustomer = readStorage<Customer | null>(CUSTOMER_KEY, null);

function notify() {
    listeners.forEach((listener) => listener());
}

export const authService = {
    getCurrentCustomer(): Customer | null {
        return currentCustomer;
    },
    saveCustomer(input: Pick<Customer, 'name' | 'phone'>): Customer {
        const normalizedPhone = normalizeUsPhone(input.phone);
        const customer: Customer = {
            id: createId('customer'),
            name: input.name.trim(),
            phone: normalizedPhone,
            createdAt: currentCustomer?.phone === normalizedPhone ? currentCustomer.createdAt : new Date().toISOString(),
        };

        currentCustomer = customer;
        writeStorage(CUSTOMER_KEY, customer);
        notify();

        return customer;
    },
    logout() {
        currentCustomer = null;
        removeStorage(CUSTOMER_KEY);
        notify();
    },
    subscribe(listener: () => void) {
        listeners.add(listener);

        return () => listeners.delete(listener);
    },
    async preparePhoneIdentity(phone: string) {
        return {
            phone: normalizeUsPhone(phone),
            authMode: 'simple_phone_identity' as const,
            upgradePath: 'otp_sms' as const,
        };
    },
    normalizePhone: normalizeUsPhone,
    formatPhone: formatUsPhone,
};
