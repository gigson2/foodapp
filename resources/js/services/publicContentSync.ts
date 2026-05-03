const PUBLIC_CONTENT_SYNC_KEY = 'restaurant.public-content-sync';
const PUBLIC_CONTENT_EVENT = 'restaurant:public-content-sync';

export type PublicContentScope = 'foods' | 'categories' | 'company-settings' | 'reviews';

type PublicContentSyncPayload = {
    nonce: string;
    scope: PublicContentScope;
    timestamp: number;
};

function createPayload(scope: PublicContentScope): PublicContentSyncPayload {
    return {
        nonce: `${scope}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        scope,
        timestamp: Date.now(),
    };
}

function parsePayload(rawValue: string | null): PublicContentSyncPayload | null {
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawValue) as Partial<PublicContentSyncPayload>;

        if (
            typeof parsed.scope !== 'string'
            || typeof parsed.timestamp !== 'number'
            || typeof parsed.nonce !== 'string'
        ) {
            return null;
        }

        return parsed as PublicContentSyncPayload;
    } catch {
        return null;
    }
}

export function publishPublicContentUpdate(scope: PublicContentScope): void {
    const payload = createPayload(scope);
    const serialized = JSON.stringify(payload);

    window.localStorage.setItem(PUBLIC_CONTENT_SYNC_KEY, serialized);
    window.dispatchEvent(new CustomEvent<PublicContentSyncPayload>(PUBLIC_CONTENT_EVENT, { detail: payload }));
}

export function subscribeToPublicContentUpdates(
    handler: (payload: PublicContentSyncPayload) => void,
): () => void {
    const handleStorage = (event: StorageEvent) => {
        if (event.key !== PUBLIC_CONTENT_SYNC_KEY) {
            return;
        }

        const payload = parsePayload(event.newValue);

        if (payload) {
            handler(payload);
        }
    };

    const handleCustomEvent = (event: Event) => {
        const payload = (event as CustomEvent<PublicContentSyncPayload>).detail;

        if (payload) {
            handler(payload);
        }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(PUBLIC_CONTENT_EVENT, handleCustomEvent as EventListener);

    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(PUBLIC_CONTENT_EVENT, handleCustomEvent as EventListener);
    };
}
