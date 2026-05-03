<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanySettingResource;
use App\Models\CompanySetting;
use Illuminate\Http\Request;

class CompanySettingController extends Controller
{
    public function show(): CompanySettingResource
    {
        return new CompanySettingResource(CompanySetting::query()->firstOrFail());
    }

    public function update(Request $request): CompanySettingResource
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'about' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'opening_hours' => ['nullable', 'array'],
            'logo' => ['nullable', 'string', 'max:255'],
            'favicon' => ['nullable', 'string', 'max:255'],
            'social_links' => ['nullable', 'array'],
        ]);

        $settings = CompanySetting::query()->firstOrFail();
        $settings->fill($validated)->save();

        return new CompanySettingResource($settings);
    }
}
