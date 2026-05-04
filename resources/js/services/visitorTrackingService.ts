import { apiClient } from '@/services/apiClient';

const SESSION_KEY_STORAGE = 'restaurant.visitor.session_key';
const LANDING_PAGE_KEY = 'restaurant.visitor.landing_page';

function generateSessionKey(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `vsk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateSessionKey(): string {
    try {
        const stored = window.localStorage.getItem(SESSION_KEY_STORAGE);

        if (stored) {
            return stored;
        }

        const fresh = generateSessionKey();
        window.localStorage.setItem(SESSION_KEY_STORAGE, fresh);

        return fresh;
    } catch {
        return generateSessionKey();
    }
}

export function captureLandingPage(): void {
    try {
        if (!window.localStorage.getItem(LANDING_PAGE_KEY)) {
            window.localStorage.setItem(LANDING_PAGE_KEY, window.location.href);
        }
    } catch {
        // ignore storage errors
    }
}

export function getLandingPage(): string | null {
    try {
        return window.localStorage.getItem(LANDING_PAGE_KEY);
    } catch {
        return null;
    }
}

function detectDevice(): { deviceType: string; browser: string; platform: string } {
    const ua = navigator.userAgent;

    const deviceType = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
        ? 'mobile'
        : /Tablet|iPad/i.test(ua)
          ? 'tablet'
          : 'desktop';

    let browser = 'unknown';

    if (/Edg\//i.test(ua)) {
        browser = 'Edge';
    } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
        browser = 'Opera';
    } else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) {
        browser = 'Chrome';
    } else if (/Firefox\//i.test(ua)) {
        browser = 'Firefox';
    } else if (/Safari\//i.test(ua)) {
        browser = 'Safari';
    }

    let platform = 'unknown';

    if (/Win/i.test(navigator.platform ?? ua)) {
        platform = 'Windows';
    } else if (/Mac/i.test(navigator.platform ?? ua)) {
        platform = 'macOS';
    } else if (/Android/i.test(ua)) {
        platform = 'Android';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
        platform = 'iOS';
    } else if (/Linux/i.test(navigator.platform ?? ua)) {
        platform = 'Linux';
    }

    return { deviceType, browser, platform };
}

export type VisitorEventPayload = {
    eventType:
        | 'page_view'
        | 'food_view'
        | 'add_to_cart'
        | 'checkout_started'
        | 'order_completed'
        | 'review_submitted'
        | 'registration';
    eventName: string;
    pageUrl?: string;
    metadata?: Record<string, unknown>;
};

export async function sendVisitorEvent(payload: VisitorEventPayload): Promise<void> {
    const sessionKey = getOrCreateSessionKey();
    const landingPage = getLandingPage();
    const { deviceType, browser, platform } = detectDevice();

    await apiClient.post('/visitor-events', {
        session_key: sessionKey,
        event_type: payload.eventType,
        event_name: payload.eventName,
        page_url: payload.pageUrl ?? window.location.href,
        metadata: payload.metadata ?? null,
        referrer: document.referrer || null,
        landing_page: landingPage,
        device_type: deviceType,
        browser,
        platform,
    });
}
