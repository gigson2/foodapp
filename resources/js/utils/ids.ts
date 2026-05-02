export function createId(prefix: string) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createOrderNumber() {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

    return `ET-${stamp}-${suffix}`;
}
