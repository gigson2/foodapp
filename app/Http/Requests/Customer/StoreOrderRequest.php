<?php

namespace App\Http\Requests\Customer;

use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
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
            'food_id' => ['required', 'integer', 'exists:foods,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'customer_note' => ['nullable', 'string'],
            'order_type' => ['nullable', Rule::in([OrderType::Pickup->value])],
            'payment_method' => ['nullable', Rule::in([PaymentMethod::Cash->value])],
        ];
    }
}
