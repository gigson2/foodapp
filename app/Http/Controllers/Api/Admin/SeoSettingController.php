<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SeoSettingResource;
use App\Models\SeoSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class SeoSettingController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SeoSettingResource::collection(SeoSetting::query()->orderBy('page_key')->get());
    }

    public function store(Request $request): SeoSettingResource
    {
        $validated = $request->validate([
            'page_key' => ['required', 'string', 'max:120', 'unique:seo_settings,page_key'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'keywords' => ['nullable', 'string'],
            'og_image' => ['nullable', 'string', 'max:255'],
            'schema_json' => ['nullable', 'array'],
        ]);

        return new SeoSettingResource(SeoSetting::query()->create($validated));
    }

    public function show(SeoSetting $seoSetting): SeoSettingResource
    {
        return new SeoSettingResource($seoSetting);
    }

    public function update(Request $request, SeoSetting $seoSetting): SeoSettingResource
    {
        $validated = $request->validate([
            'page_key' => ['required', 'string', 'max:120', Rule::unique('seo_settings', 'page_key')->ignore($seoSetting->id)],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'keywords' => ['nullable', 'string'],
            'og_image' => ['nullable', 'string', 'max:255'],
            'schema_json' => ['nullable', 'array'],
        ]);

        $seoSetting->fill($validated)->save();

        return new SeoSettingResource($seoSetting);
    }

    public function destroy(SeoSetting $seoSetting): JsonResponse
    {
        $seoSetting->delete();

        return response()->json([
            'message' => 'SEO setting deleted successfully.',
        ]);
    }
}
