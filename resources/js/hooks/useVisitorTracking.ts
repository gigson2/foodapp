import { useCallback, useEffect, useRef } from 'react';
import { captureLandingPage, sendVisitorEvent, type VisitorEventPayload } from '@/services/visitorTrackingService';

/**
 * Initialises visitor tracking for the storefront.
 * - Fires a `page_view` event once when the component mounts.
 * - Returns a stable `trackEvent` callback for ad-hoc CRM events.
 * All network calls are fire-and-forget; errors are silently swallowed.
 */
export function useVisitorTracking() {
    const pageViewFired = useRef(false);

    // Capture the landing page URL on the very first render.
    useEffect(() => {
        captureLandingPage();
    }, []);

    // Fire a single page_view event when the component mounts.
    useEffect(() => {
        if (pageViewFired.current) {
            return;
        }

        pageViewFired.current = true;

        sendVisitorEvent({
            eventType: 'page_view',
            eventName: 'storefront_view',
            pageUrl: window.location.href,
        }).catch(() => undefined);
    }, []);

    const trackEvent = useCallback((payload: VisitorEventPayload) => {
        sendVisitorEvent(payload).catch(() => undefined);
    }, []);

    return { trackEvent };
}
