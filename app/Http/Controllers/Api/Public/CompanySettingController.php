<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicCompanySettingResource;
use App\Models\CompanySetting;

class CompanySettingController extends Controller
{
    public function __invoke(): PublicCompanySettingResource
    {
        return new PublicCompanySettingResource(CompanySetting::query()->firstOrFail());
    }
}
