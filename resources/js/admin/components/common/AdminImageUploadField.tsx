import { ImagePlus } from 'lucide-react';

type AdminImageUploadFieldProps = {
    label: string;
    previewSrc?: string | null;
    previewAlt: string;
    onChange: (file: File | null) => void;
    helperText?: string;
};

export function AdminImageUploadField({
    label,
    previewSrc,
    previewAlt,
    onChange,
    helperText,
}: AdminImageUploadFieldProps) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-medium text-[color:var(--text-950)]">{label}</span>
            <div className="rounded-[1.35rem] border border-dashed border-[color:var(--primary-500)]/28 bg-white/4 p-4 transition hover:border-[color:var(--primary-500)]/42 hover:bg-[color:var(--primary-500)]/6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-28 w-full max-w-[8rem] items-center justify-center overflow-hidden rounded-[1rem] border border-white/10 bg-white/6">
                        {previewSrc ? (
                            <img alt={previewAlt} className="h-full w-full object-cover" src={previewSrc} />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-muted">
                                <ImagePlus className="h-6 w-6" />
                                <span className="text-xs uppercase tracking-[0.14em]">No image</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary-500)]/25 bg-[color:var(--primary-500)]/10 px-4 py-2 text-sm font-semibold text-[color:var(--primary-500)]">
                            <ImagePlus className="h-4 w-4" />
                            Choose image
                        </div>
                        <input
                            className="mt-3 block w-full cursor-pointer text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-transparent file:px-0 file:py-0 file:text-sm file:font-semibold file:text-[color:var(--primary-500)]"
                            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                            type="file"
                        />
                        {helperText ? <p className="mt-2 text-xs text-muted">{helperText}</p> : null}
                    </div>
                </div>
            </div>
        </label>
    );
}
