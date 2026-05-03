import { adminApiClient, buildAdminQuery, mapPaginatedResponse, toFormData, type AdminPaginatedResult, type AdminTableParams } from '@/admin/services/adminApiClient';

export type AdminCompanySettingsRecord = {
    id: number;
    companyName: string;
    tagline?: string | null;
    about?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    pickupInstructions?: string | null;
    cashOnlyNotice?: string | null;
    openingHours: Record<string, string>;
    logo?: string | null;
    favicon?: string | null;
    socialLinks: Record<string, string | null>;
};

export type AdminCompanySettingsInput = {
    companyName: string;
    tagline?: string;
    about?: string;
    phone?: string;
    email?: string;
    address?: string;
    pickupInstructions?: string;
    cashOnlyNotice?: string;
    openingHours: Record<string, string>;
    socialLinks: Record<string, string | null>;
    logo?: File | null;
    favicon?: File | null;
};

type ApiCompanySettings = {
    id: number;
    company_name: string;
    tagline?: string | null;
    about?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    pickup_instructions?: string | null;
    cash_only_notice?: string | null;
    opening_hours: Record<string, string>;
    logo?: string | null;
    favicon?: string | null;
    social_links: Record<string, string | null>;
};

type ApiSeoSetting = {
    id: number;
    page_key: string;
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    og_image?: string | null;
    schema_json: Record<string, unknown>;
};

export type AdminSeoRecord = {
    id: string;
    pageKey: string;
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    ogImage?: string | null;
    schemaJson: Record<string, unknown>;
};

export type AdminSeoInput = {
    pageKey: string;
    title?: string;
    description?: string;
    keywords?: string;
    schemaJson: Record<string, unknown>;
    ogImage?: File | null;
};

function mapCompany(settings: ApiCompanySettings): AdminCompanySettingsRecord {
    return {
        id: settings.id,
        companyName: settings.company_name,
        tagline: settings.tagline,
        about: settings.about,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        pickupInstructions: settings.pickup_instructions,
        cashOnlyNotice: settings.cash_only_notice,
        openingHours: settings.opening_hours ?? {},
        logo: settings.logo,
        favicon: settings.favicon,
        socialLinks: settings.social_links ?? {},
    };
}

function mapSeo(setting: ApiSeoSetting): AdminSeoRecord {
    return {
        id: String(setting.id),
        pageKey: setting.page_key,
        title: setting.title,
        description: setting.description,
        keywords: setting.keywords,
        ogImage: setting.og_image,
        schemaJson: setting.schema_json ?? {},
    };
}

export const adminSettingsService = {
    async getCompanySettings() {
        const response = await adminApiClient.get<{ data: ApiCompanySettings }>('/admin/company-settings');

        return mapCompany(response.data.data);
    },
    async updateCompanySettings(input: AdminCompanySettingsInput) {
        const payload = toFormData({
            company_name: input.companyName,
            tagline: input.tagline ?? '',
            about: input.about ?? '',
            phone: input.phone ?? '',
            email: input.email ?? '',
            address: input.address ?? '',
            pickup_instructions: input.pickupInstructions ?? '',
            cash_only_notice: input.cashOnlyNotice ?? '',
            opening_hours: input.openingHours,
            social_links: input.socialLinks,
            logo: input.logo ?? undefined,
            favicon: input.favicon ?? undefined,
        });
        payload.append('_method', 'PUT');

        const response = await adminApiClient.post('/admin/company-settings', payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return mapCompany(response.data.data as ApiCompanySettings);
    },
    async getSeoSettings(params: AdminTableParams): Promise<AdminPaginatedResult<AdminSeoRecord>> {
        const response = await adminApiClient.get('/admin/seo-settings', {
            params: buildAdminQuery({
                page: params.page,
                per_page: params.perPage,
                search: params.search,
            }),
        });

        return mapPaginatedResponse(response.data, mapSeo);
    },
    async createSeoSetting(input: AdminSeoInput) {
        const response = await adminApiClient.post('/admin/seo-settings', toFormData({
            page_key: input.pageKey,
            title: input.title ?? '',
            description: input.description ?? '',
            keywords: input.keywords ?? '',
            schema_json: input.schemaJson,
            og_image: input.ogImage ?? undefined,
        }), {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return mapSeo(response.data.data as ApiSeoSetting);
    },
    async updateSeoSetting(id: string | number, input: AdminSeoInput) {
        const payload = toFormData({
            page_key: input.pageKey,
            title: input.title ?? '',
            description: input.description ?? '',
            keywords: input.keywords ?? '',
            schema_json: input.schemaJson,
            og_image: input.ogImage ?? undefined,
        });
        payload.append('_method', 'PUT');

        const response = await adminApiClient.post(`/admin/seo-settings/${id}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return mapSeo(response.data.data as ApiSeoSetting);
    },
    async deleteSeoSetting(id: string | number) {
        await adminApiClient.delete(`/admin/seo-settings/${id}`);
    },
};
