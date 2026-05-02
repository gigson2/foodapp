function getDigits(value: string) {
    return value.replace(/\D/g, '');
}

export function normalizeUsPhone(value: string) {
    const digits = getDigits(value);

    if (digits.length === 11 && digits.startsWith('1')) {
        return `+${digits}`;
    }

    if (digits.length === 10) {
        return `+1${digits}`;
    }

    return digits ? `+${digits}` : '';
}

export function formatUsPhone(value: string) {
    const digits = getDigits(value).replace(/^1(?=\d{10}$)/, '').slice(0, 10);

    if (digits.length === 0) {
        return '';
    }

    if (digits.length < 4) {
        return `(${digits}`;
    }

    if (digits.length < 7) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function isValidUsPhone(value: string) {
    const digits = getDigits(value);

    return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
}
