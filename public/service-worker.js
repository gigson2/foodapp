const CACHE_NAME = 'dri-africain-shell-v6';
const OFFLINE_URL = '/offline.html';
const STATIC_ASSETS = ['/', OFFLINE_URL, '/manifest.webmanifest', '/icons/app_ico.png', '/icons/apple-touch-icon.png', '/icons/app-icon-192.png', '/icons/app-icon-512.png'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    // Never cache API requests — always fetch live from the server
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/sanctum/')) {
        event.respondWith(fetch(request));
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
        return;
    }

    // Cache-first for static assets; network-fallback caches new responses
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) {
                return cached;
            }

            return fetch(request)
                .then((response) => {
                    if (!response.ok || !request.url.startsWith(self.location.origin)) {
                        return response;
                    }

                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));

                    return response;
                })
                .catch(() => caches.match(OFFLINE_URL));
        }),
    );
});

// Handle incoming Web Push notifications
self.addEventListener('push', (event) => {
    let data = {};

    try {
        data = event.data ? event.data.json() : {};
    } catch {
        data = { title: 'Dri Africain', body: event.data ? event.data.text() : 'You have a new update.' };
    }

    const title = data.title || 'Dri Africain Traditional Grill';
    const options = {
        body: data.body || data.message || 'You have a new update.',
        icon: '/icons/app-icon-192.png',
        badge: '/icons/app_ico.png',
        tag: data.tag || data.kind || 'general',
        data: { url: data.url || '/customer', ...data },
        requireInteraction: false,
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Open relevant page when push notification is clicked
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }

            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        }),
    );
});
