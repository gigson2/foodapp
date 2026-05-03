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
}
