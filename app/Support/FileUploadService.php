<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class FileUploadService
{
    public function storePublic(?UploadedFile $file, string $directory): ?string
    {
        if (! $file) {
            return null;
        }

        $this->assertPublicUploadIsAllowed($file);

        $extension = $file->extension() ?: 'bin';
        $filename = Str::uuid()->toString().'.'.$extension;
        $path = $file->storeAs($directory, $filename, 'public');

        return $this->normalizePublicPath(Storage::url($path));
    }

    public function replacePublic(?string $currentPath, ?UploadedFile $file, string $directory): ?string
    {
        if (! $file) {
            return $currentPath;
        }

        $this->deletePublic($currentPath);

        return $this->storePublic($file, $directory);
    }

    public function deletePublic(?string $path): void
    {
        $normalizedPath = $this->normalizePublicPath($path);

        if (! $normalizedPath || ! str_starts_with($normalizedPath, '/storage/')) {
            return;
        }

        $storagePath = Str::after($normalizedPath, '/storage/');

        if ($storagePath !== '') {
            Storage::disk('public')->delete($storagePath);
        }
    }

    protected function assertPublicUploadIsAllowed(UploadedFile $file): void
    {
        $extension = strtolower((string) ($file->extension() ?: $file->getClientOriginalExtension()));
        $mimeType = strtolower((string) $file->getMimeType());

        if ($extension === 'svg' || $mimeType === 'image/svg+xml') {
            throw ValidationException::withMessages([
                'file' => 'SVG uploads are not supported for public assets.',
            ]);
        }
    }

    protected function normalizePublicPath(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            $parsedPath = parse_url($path, PHP_URL_PATH);

            return is_string($parsedPath) && $parsedPath !== '' ? $parsedPath : null;
        }

        return $path;
    }
}
