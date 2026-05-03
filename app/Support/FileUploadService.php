<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    public function storePublic(?UploadedFile $file, string $directory): ?string
    {
        if (! $file) {
            return null;
        }

        $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
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
