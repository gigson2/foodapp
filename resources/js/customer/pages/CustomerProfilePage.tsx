import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { AdminImageUploadField } from '@/admin/components/common/AdminImageUploadField';
import { AUTH_SESSION_QUERY_KEY } from '@/hooks/useAuthSession';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Textarea } from '@/components/common/Textarea';
import { customerPortalService } from '@/customer/services/customerPortalService';
import { apiClient } from '@/services/apiClient';
import { getExistingPushSubscription, requestNotificationAccess, subscribeToPush } from '@/services/pwaService';
import { formatUsPhone } from '@/utils/phone';

export function CustomerProfilePage() {
    const queryClient = useQueryClient();
    const profileQuery = useQuery({
        queryKey: ['customer-portal', 'profile'],
        queryFn: customerPortalService.getProfile,
    });

    const [profileDraft, setProfileDraft] = useState<{
        name: string;
        phone: string;
        email: string;
        address: string;
        city: string;
        notes: string;
        avatar: File | null;
        inAppEnabled: boolean;
        pushEnabled: boolean;
        emailEnabled: boolean;
    } | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        password: '',
        passwordConfirmation: '',
    });

    const baseForm = useMemo(() => ({
        name: profileQuery.data?.name ?? '',
        phone: profileQuery.data?.phone ? formatUsPhone(profileQuery.data.phone) : '',
        email: profileQuery.data?.email ?? '',
        address: profileQuery.data?.customer_profile?.address ?? '',
        city: profileQuery.data?.customer_profile?.city ?? '',
        notes: profileQuery.data?.customer_profile?.notes ?? '',
        avatar: null as File | null,
        inAppEnabled: profileQuery.data?.notification_preference?.in_app_enabled ?? true,
        pushEnabled: profileQuery.data?.notification_preference?.push_enabled ?? true,
        emailEnabled: profileQuery.data?.notification_preference?.email_enabled ?? false,
    }), [profileQuery.data]);

    const form = profileDraft ?? baseForm;

    const updateProfileMutation = useMutation({
        mutationFn: customerPortalService.updateProfile,
        onSuccess: async (profile) => {
            toast.success('Profile updated');
            setProfileDraft(null);
            setAvatarPreview(null);
            queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, profile);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['customer-portal', 'profile'] }),
                queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY }),
            ]);
        },
    });

    const updatePasswordMutation = useMutation({
        mutationFn: customerPortalService.updatePassword,
        onSuccess: () => {
            toast.success('Password updated');
            setPasswordForm({
                currentPassword: '',
                password: '',
                passwordConfirmation: '',
            });
        },
    });

    const enableNotificationsMutation = useMutation({
        mutationFn: async () => {
            const permission = await requestNotificationAccess();

            if (permission !== 'granted') {
                throw new Error(permission === 'denied' ? 'Browser notifications were denied.' : 'Notification permission was not granted.');
            }

            const existing = await getExistingPushSubscription();
            const subscription = existing ?? await subscribeToPush();

            if (!subscription) {
                throw new Error('Unable to register this browser for push notifications.');
            }

            await customerPortalService.savePushSubscription(subscription);
        },
        onSuccess: () => {
            toast.success('Push notifications enabled');
        },
    });
    const testPushMutation = useMutation({
        mutationFn: async () => {
            await apiClient.post('/push-notifications/test');
        },
        onSuccess: () => {
            toast.success('A real push test was sent to this device.');
        },
    });

    if (profileQuery.isLoading && !profileQuery.data) {
        return (
            <div className="section-shell flex min-h-[40vh] items-center justify-center py-24">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="section-shell space-y-6 py-6">
            <div>
                <p className="section-eyebrow">Customer dashboard</p>
                <h2 className="mt-4 text-4xl sm:text-5xl">Profile</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                    Update the customer profile details, pickup notes, password, and notification preferences used for your account.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                <AdminSectionCard className="p-5 sm:p-6">
                    <h3 className="text-3xl">Profile details</h3>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Input label="Full name" onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseForm), name: event.target.value }))} value={form.name} />
                        <Input label="Phone number" onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseForm), phone: formatUsPhone(event.target.value) }))} value={form.phone} />
                        <div className="sm:col-span-2">
                            <Input label="Email" onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseForm), email: event.target.value }))} type="email" value={form.email} />
                        </div>
                        <Input label="Address" onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseForm), address: event.target.value }))} value={form.address} />
                        <Input label="City" onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseForm), city: event.target.value }))} value={form.city} />
                        <div className="sm:col-span-2">
                            <Textarea label="Pickup notes" onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseForm), notes: event.target.value }))} value={form.notes} />
                        </div>
                        <div className="sm:col-span-2">
                            <AdminImageUploadField
                                helperText="Upload a profile photo for your customer account."
                                label="Avatar"
                                onChange={(file) => {
                                    setProfileDraft((current) => ({ ...(current ?? baseForm), avatar: file }));
                                    setAvatarPreview(file ? URL.createObjectURL(file) : (profileQuery.data?.avatar ?? null));
                                }}
                                previewAlt={form.name || 'Customer avatar'}
                                previewSrc={avatarPreview ?? profileQuery.data?.avatar ?? null}
                            />
                        </div>
                        <label className="ui-outline flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                            <input checked={form.inAppEnabled} onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseForm), inAppEnabled: event.target.checked }))} type="checkbox" />
                            In-app notifications
                        </label>
                        <label className="ui-outline flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                            <input checked={form.pushEnabled} onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseForm), pushEnabled: event.target.checked }))} type="checkbox" />
                            Push notifications
                        </label>
                        <label className="ui-outline flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                            <input checked={form.emailEnabled} onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseForm), emailEnabled: event.target.checked }))} type="checkbox" />
                            Email notifications
                        </label>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Button
                            disabled={updateProfileMutation.isPending}
                            onClick={() => updateProfileMutation.mutate(form)}
                            size="sm"
                        >
                            Save profile
                        </Button>
                        <Button
                            disabled={enableNotificationsMutation.isPending}
                            onClick={() => enableNotificationsMutation.mutate()}
                            size="sm"
                            variant="secondary"
                        >
                            Enable push notifications
                        </Button>
                        <Button
                            disabled={testPushMutation.isPending}
                            onClick={() => testPushMutation.mutate()}
                            size="sm"
                            variant="ghost"
                        >
                            Send push test
                        </Button>
                    </div>
                </AdminSectionCard>

                <AdminSectionCard className="p-5 sm:p-6">
                    <h3 className="text-3xl">Change password</h3>
                    <div className="mt-5 space-y-4">
                        <Input label="Current password" onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))} type="password" value={passwordForm.currentPassword} />
                        <Input label="New password" onChange={(event) => setPasswordForm((current) => ({ ...current, password: event.target.value }))} type="password" value={passwordForm.password} />
                        <Input label="Confirm new password" onChange={(event) => setPasswordForm((current) => ({ ...current, passwordConfirmation: event.target.value }))} type="password" value={passwordForm.passwordConfirmation} />
                    </div>
                    <div className="mt-5">
                        <Button
                            disabled={updatePasswordMutation.isPending}
                            onClick={() => updatePasswordMutation.mutate(passwordForm)}
                            size="sm"
                            variant="accent"
                        >
                            Update password
                        </Button>
                    </div>
                </AdminSectionCard>
            </div>
        </div>
    );
}
