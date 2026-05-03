import { RequireCustomer } from '@/customer/components/RequireCustomer';
import { CustomerLayout } from '@/customer/layout/CustomerLayout';

export function CustomerApp() {
    return <RequireCustomer>{(user) => <CustomerLayout currentUser={user} />}</RequireCustomer>;
}
