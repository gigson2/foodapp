import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminImageUploadField } from '@/admin/components/common/AdminImageUploadField';
import { AdminPageHeader } from '@/admin/components/common/AdminPageHeader';
import { AdminSectionCard } from '@/admin/components/common/AdminSectionCard';
import { adminProfileService } from '@/admin/services/adminProfileService';
import { AUTH_SESSION_QUERY_KEY } from '@/hooks/useAuthSession';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export function AdminProfilePage() {
    const queryClient = useQueryClient();
    const profileQuery = useQuery({
        queryKey: ['admin-app', 'profile'],
        queryFn: adminProfileService.getProfile,
    });
    const [profileDraft, setProfileDraft] = useState<{
        name: string;
        phone: string;
        email: string;
        avatar: File | null;
    } | null>(null);
    const baseProfileForm = useMemo(() => ({
        name: profileQuery.data?.name ?? '',
        phone: profileQuery.data?.phone ?? '',
        email: profileQuery.data?.email ?? '',
        avatar: null as File | null,
    }), [profileQuery.data?.email, profileQuery.data?.name, profileQuery.data?.phone]);
    const profileForm = profileDraft ?? baseProfileForm;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        password: '',
        passwordConfirmation: '',
    });

    const updateProfileMutation = useMutation({
        mutationFn: adminProfileService.updateProfile,
        onSuccess: async () => {
            toast.success('Profile updated');
            setProfileDraft(null);
            setAvatarPreview(null);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-app', 'profile'] }),
                queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY }),
            ]);
        },
    });

    const updatePasswordMutation = useMutation({
        mutationFn: adminProfileService.updatePassword,
        onSuccess: () => {
            toast.success('Password updated');
            setPasswordForm({
                currentPassword: '',
                password: '',
                passwordConfirmation: '',
            });
        },
    });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                actions={
                    <Link to="/">
                        <Button size="sm" variant="secondary">Visit store</Button>
                    </Link>
                }
                description="Update the admin account details used to manage Dri Africain Traditional Grill LLC and keep your credentials current."
                title="Admin profile"
            />

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <AdminSectionCard className="p-5 sm:p-6">
                    <h2 className="text-2xl">Profile details</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Input label="Full name" onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseProfileForm), name: event.target.value }))} value={profileForm.name} />
                        <Input label="Phone number" onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseProfileForm), phone: event.target.value }))} value={profileForm.phone} />
                        <div className="sm:col-span-2">
                            <Input label="Email" onChange={(event) => setProfileDraft((current) => ({ ...(current ?? baseProfileForm), email: event.target.value }))} type="email" value={profileForm.email} />
                        </div>
                        <div className="sm:col-span-2">
                            <AdminImageUploadField
                                helperText="Upload an avatar for the admin profile."
                                label="Avatar"
                                onChange={(file) => {
                                    setProfileDraft((current) => ({ ...(current ?? baseProfileForm), avatar: file }));
                                    setAvatarPreview(file ? URL.createObjectURL(file) : (profileQuery.data?.avatar ?? null));
                                }}
                                previewAlt={profileForm.name || 'Admin avatar'}
                                previewSrc={avatarPreview ?? profileQuery.data?.avatar ?? null}
                            />
                        </div>
                    </div>
                    <div className="mt-5">
                        <Button
                            onClick={() => updateProfileMutation.mutate(profileForm)}
                            size="sm"
                        >
                            Save profile
                        </Button>
                    </div>
                </AdminSectionCard>

                <AdminSectionCard className="p-5 sm:p-6">
                    <h2 className="text-2xl">Change password</h2>
                    <div className="mt-5 space-y-4">
                        <Input label="Current password" onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))} type="password" value={passwordForm.currentPassword} />
                        <Input label="New password" onChange={(event) => setPasswordForm((current) => ({ ...current, password: event.target.value }))} type="password" value={passwordForm.password} />
                        <Input label="Confirm new password" onChange={(event) => setPasswordForm((current) => ({ ...current, passwordConfirmation: event.target.value }))} type="password" value={passwordForm.passwordConfirmation} />
                    </div>
                    <div className="mt-5">
                        <Button
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
