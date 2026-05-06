<?php

namespace App\Http\Requests\Auth;

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
            'lookup' => ['required', Rule::in(['email'])],
            'login' => ['required', 'string', 'max:255'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $login = trim((string) $this->input('login'));

        $this->merge([
            'login' => strtolower($login),
        ]);
    }
}
