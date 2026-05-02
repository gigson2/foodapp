type PushSubscriptionPlaceholder = {
    endpoint: string;
    ready: false;
};

export async function registerServiceWorker() {
    if (
        typeof window === 'undefined'
        || !('serviceWorker' in navigator)
        || import.meta.env.DEV
    ) {
        return null;
    }

    if (document.readyState === 'complete') {
        await navigator.serviceWorker.register('/service-worker.js').catch(() => undefined);
        return null;
    }

    window.addEventListener(
        'load',
        () => {
            navigator.serviceWorker.register('/service-worker.js').catch(() => undefined);
        },
        { once: true },
    );

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

    const permission = await Notification.requestPermission();
    window.dispatchEvent(new CustomEvent('notification-permission-change', { detail: permission }));

    return permission;
}

export async function createPushSubscriptionPlaceholder(): Promise<PushSubscriptionPlaceholder | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return null;
    }

    if (! import.meta.env.DEV) {
        await navigator.serviceWorker.ready.catch(() => undefined);
    }

    return {
        endpoint: 'mock-push-subscription',
        ready: false,
    };
}
