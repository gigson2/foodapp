import { useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function detectIos() {
    if (typeof window === 'undefined') {
        return false;
    }

    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function useInstallPrompt() {
    const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const isIos = useMemo(detectIos, []);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setPromptEvent(event as BeforeInstallPromptEvent);
        };

        const standalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            ('standalone' in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone));

        setIsStandalone(standalone);
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const promptInstall = async () => {
        if (! promptEvent) {
            return null;
        }

        await promptEvent.prompt();
        const result = await promptEvent.userChoice;

        if (result.outcome === 'accepted') {
            setPromptEvent(null);
        }

        return result.outcome;
    };

    return {
        canInstall: Boolean(promptEvent),
        isIos,
        isStandalone,
        promptInstall,
    };
}
