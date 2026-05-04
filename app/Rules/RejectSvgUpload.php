<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class RejectSvgUpload implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile) {
            return;
        }

        $extension = strtolower((string) $value->getClientOriginalExtension());
        $mimeType = strtolower((string) $value->getMimeType());

        if ($extension === 'svg' || $mimeType === 'image/svg+xml') {
            $fail('SVG uploads are not supported for this field.');
        }
    }
}
