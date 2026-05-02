type PushSubscriptionPlaceholder = {
    endpoint: string;
    ready: false;
};

export async function registerServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return null;
    }

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch(() => undefined);
    });

    return null;
}

export function getNotificationPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return 'unsupported' as const;
    }

    return Notification.permission;
}

export async function requestNotificationAccess() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return 'unsupported' as const;
    }

    return Notification.requestPermission();
}

export async function createPushSubscriptionPlaceholder(): Promise<PushSubscriptionPlaceholder | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return null;
    }

    return {
        endpoint: 'mock-push-subscription',
        ready: false,
    };
}
