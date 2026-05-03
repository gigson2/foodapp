export interface CompanySettings {
    id: number;
    company_name: string;
    tagline: string | null;
    about: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    pickup_instructions?: string | null;
    cash_only_notice?: string | null;
    opening_hours: Record<string, string>;
    logo: string | null;
    favicon: string | null;
    social_links: Record<string, string | null>;
    updated_at?: string | null;
}
