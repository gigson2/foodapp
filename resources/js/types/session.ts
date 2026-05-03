export interface AuthenticatedUser {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    role: string;
    avatar?: string | null;
    status: string;
    last_login_at?: string | null;
    email_verified_at?: string | null;
    customer_profile?: {
        address?: string | null;
        city?: string | null;
        notes?: string | null;
    } | null;
    notification_preference?: {
        in_app_enabled: boolean;
        push_enabled: boolean;
        email_enabled: boolean;
        preferences?: Record<string, boolean>;
    } | null;
}
