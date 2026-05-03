<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanySettingResource;
use App\Models\CompanySetting;

class CompanySettingController extends Controller
{
    public function __invoke(): CompanySettingResource
    {
        return new CompanySettingResource(CompanySetting::query()->firstOrFail());
    }
}
