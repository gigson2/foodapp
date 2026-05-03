/** Convert a base64url VAPID public key to a Uint8Array for PushManager.subscribe() */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const output = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
        output[i] = rawData.charCodeAt(i);
    }
    return output;
}

export async function registerServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
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

async function ensureServiceWorkerReady(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return null;
    }

    const existing = await navigator.serviceWorker.getRegistration();

    if (!existing) {
        await navigator.serviceWorker.register('/service-worker.js').catch(() => undefined);
    }

    try {
        return await navigator.serviceWorker.ready;
    } catch {
        return null;
    }
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

/**
 * Subscribe to Web Push using the VAPID public key.
 * Returns the PushSubscription object, or null if push is not supported / subscription fails.
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
    if (
        typeof window === 'undefined'
        || !('serviceWorker' in navigator)
        || !('PushManager' in window)
    ) {
        return null;
    }

    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

    if (!vapidPublicKey) {
        return null;
    }

    try {
        const registration = await ensureServiceWorkerReady();

        if (!registration) {
            return null;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        return subscription;
    } catch {
        return null;
    }
}

/**
 * Return the current push subscription if one exists, without creating a new one.
 */
export async function getExistingPushSubscription(): Promise<PushSubscription | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return null;
    }

    try {
        const registration = await ensureServiceWorkerReady();

        if (!registration) {
            return null;
        }

        return await registration.pushManager.getSubscription();
    } catch {
        return null;
    }
}
