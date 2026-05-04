<?php

namespace App\Http\Requests\Auth;

use App\Support\PhoneNumber;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RequestPasswordRecoveryOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'lookup' => ['required', Rule::in(['phone', 'email'])],
            'login' => ['required', 'string', 'max:255'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $lookup = $this->input('lookup');
        $login = trim((string) $this->input('login'));

        $this->merge([
            'lookup' => is_string($lookup) ? strtolower($lookup) : $lookup,
            'login' => $lookup === 'phone'
                ? (PhoneNumber::normalizeUs($login) ?? $login)
                : strtolower($login),
        ]);
    }
}
