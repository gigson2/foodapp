export function formatDateTime(value?: string | null) {
    if (!value) {
        return 'N/A';
    }

    return new Date(value).toLocaleString();
}

export function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function listToCsv(values: string[] | undefined) {
    return values?.join(', ') ?? '';
}

export function csvToList(value: string) {
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}
