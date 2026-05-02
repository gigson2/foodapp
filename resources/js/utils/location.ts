export function openDirectionsPrompt(address: string) {
    if (typeof window === 'undefined') {
        return;
    }

    if (! window.confirm(`Open directions to ${address}?`)) {
        return;
    }

    const destination = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank', 'noopener,noreferrer');
}
