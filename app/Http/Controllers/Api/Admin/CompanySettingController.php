<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCompanySettingRequest;
use App\Http\Resources\CompanySettingResource;
use App\Models\CompanySetting;
use App\Support\FileUploadService;

class CompanySettingController extends Controller
{
    public function __construct(
        protected FileUploadService $fileUploadService,
    ) {
    }

    public function show(): CompanySettingResource
    {
        return new CompanySettingResource(CompanySetting::query()->firstOrFail());
    }

    public function update(StoreCompanySettingRequest $request): CompanySettingResource
    {
        $validated = $request->validated();

        $settings = CompanySetting::query()->firstOrFail();
        $validated['logo'] = $this->fileUploadService->replacePublic($settings->logo, $request->file('logo'), 'company');
        $validated['favicon'] = $this->fileUploadService->replacePublic($settings->favicon, $request->file('favicon'), 'company');
        $settings->fill($validated)->save();

        return new CompanySettingResource($settings);
    }
}
