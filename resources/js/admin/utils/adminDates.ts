export function formatAdminDate(value: string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}

export function formatAdminDateTime(value: string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

export function formatRelativeDayLabel(value: string) {
    const today = new Date();
    const target = new Date(value);
    const diff = Math.round((today.setHours(0, 0, 0, 0) - target.setHours(0, 0, 0, 0)) / 86400000);

    if (diff === 0) {
        return 'Today';
    }

    if (diff === 1) {
        return 'Yesterday';
    }

    return formatAdminDate(value);
}
