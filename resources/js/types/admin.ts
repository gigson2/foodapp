export type AdminOrderStatus =
    | 'pending'
    | 'received'
    | 'processing'
    | 'ready_for_pickup'
    | 'on_delivery'
    | 'completed'
    | 'cancelled';

export interface AdminDashboardMetrics {
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    total_customers: number;
    total_visitors: number;
    total_revenue: number;
    today_revenue: number;
    week_revenue: number;
    month_revenue: number;
}

export interface AdminOrderItem {
    id: number;
    food_id: number | null;
    food_name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
    customer_note?: string | null;
}

export interface AdminOrder {
    id: number;
    user_id: number | null;
    order_number: string;
    customer_name: string;
    customer_email?: string | null;
    customer_phone: string;
    delivery_address?: string | null;
    order_type: string;
    status: AdminOrderStatus;
    subtotal: number;
    delivery_fee: number;
    discount: number;
    tax: number;
    total: number;
    payment_method: string;
    payment_status: string;
    customer_note?: string | null;
    admin_note?: string | null;
    placed_at?: string | null;
    accepted_at?: string | null;
    completed_at?: string | null;
    cancelled_at?: string | null;
    items: AdminOrderItem[];
    created_at: string;
    updated_at: string;
}

export interface AdminFood {
    id: number;
    category_id: number;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    name: string;
    slug: string;
    description: string;
    short_description?: string | null;
    image?: string | null;
    price: number;
    preparation_time_minutes: number;
    ingredients: string[];
    allergens: string[];
    dietary_labels: string[];
    is_available: boolean;
    is_featured: boolean;
    is_popular: boolean;
    sort_order: number;
    seo_title?: string | null;
    seo_description?: string | null;
    deleted_at?: string | null;
}

export interface AdminCategory {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    sort_order: number;
    is_active: boolean;
    foods_count?: number;
}

export interface AdminCustomer {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    status: string;
    last_login_at?: string | null;
    orders_count?: number;
    lifetime_value?: number;
    last_order_at?: string | null;
    customer_profile?: {
        address?: string | null;
        city?: string | null;
        notes?: string | null;
    } | null;
}

export interface AdminVisitorSession {
    id: number;
    user_id?: number | null;
    session_key: string;
    ip_hash: string;
    user_agent?: string | null;
    device_type?: string | null;
    browser?: string | null;
    platform?: string | null;
    referrer?: string | null;
    landing_page?: string | null;
    last_seen_at?: string | null;
    events_count?: number;
    created_at: string;
}

export interface AdminCompanySetting {
    id: number;
    company_name: string;
    tagline?: string | null;
    about?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    opening_hours: Record<string, string>;
    logo?: string | null;
    favicon?: string | null;
    social_links: Record<string, string | null>;
}

export interface AdminSeoSetting {
    id: number;
    page_key: string;
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    og_image?: string | null;
    schema_json: Record<string, unknown>;
}

export interface AdminNotification {
    id: string;
    type: string;
    data: Record<string, unknown>;
    read_at?: string | null;
    created_at: string;
}
