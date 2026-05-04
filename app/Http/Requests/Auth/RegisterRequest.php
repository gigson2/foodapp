<?php

namespace App\Http\Requests\Auth;

use App\Enums\UserRole;
use App\Support\PhoneNumber;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:20', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'notes' => ['nullable', 'string'],
            'role' => ['sometimes', Rule::in([UserRole::Customer->value])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $normalizedPhone = PhoneNumber::normalizeUs($this->input('phone'));

        $this->merge([
            'name' => trim((string) $this->input('name')),
            'email' => $this->filled('email') ? strtolower(trim((string) $this->input('email'))) : null,
            'phone' => $normalizedPhone,
        ]);
    }
}
