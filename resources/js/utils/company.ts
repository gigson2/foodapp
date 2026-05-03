import type { CompanySettings } from '@/types';

const FALLBACK_COMPANY_NAME = 'Dri Foods';
const FALLBACK_ADDRESS = 'Pickup address coming soon';

export function getCompanyName(companySettings: CompanySettings | null | undefined): string {
    return companySettings?.company_name?.trim() || FALLBACK_COMPANY_NAME;
}

export function getCompanyAddress(companySettings: CompanySettings | null | undefined): string {
    return companySettings?.address?.trim() || FALLBACK_ADDRESS;
}

export function getCompanyTagline(companySettings: CompanySettings | null | undefined): string | null {
    return companySettings?.tagline?.trim() || null;
}

export function getCompanyAbout(companySettings: CompanySettings | null | undefined): string | null {
    return companySettings?.about?.trim() || null;
}

export function getCompanyLocationLabel(companySettings: CompanySettings | null | undefined): string {
    const address = getCompanyAddress(companySettings);
    const parts = address
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length >= 3) {
        return `${parts[1]}, ${parts[2]}`;
    }

    if (parts.length >= 2) {
        return `${parts[0]}, ${parts[1]}`;
    }

    return address;
}

export function buildCompanyPageTitle(companySettings: CompanySettings | null | undefined): string {
    return getCompanyName(companySettings);
}
