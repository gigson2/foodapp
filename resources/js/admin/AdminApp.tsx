import { AdminLayout } from '@/admin/layout/AdminLayout';
import { RequireAdmin } from '@/admin/components/common/RequireAdmin';

export function AdminApp() {
    return <RequireAdmin>{(user) => <AdminLayout currentUser={user} />}</RequireAdmin>;
}
