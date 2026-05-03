<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSeoSettingRequest;
use App\Http\Requests\Admin\UpdateSeoSettingRequest;
use App\Http\Resources\SeoSettingResource;
use App\Models\SeoSetting;
use App\Support\AdminPagination;
use App\Support\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Request;

class SeoSettingController extends Controller
{
    public function __construct(
        protected FileUploadService $fileUploadService,
    ) {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = AdminPagination::resolvePerPage($request);
        $search = $request->string('search')->trim()->toString();

        return SeoSettingResource::collection(
            SeoSetting::query()
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where(function ($nested) use ($search): void {
                        $nested
                            ->where('page_key', 'like', "%{$search}%")
                            ->orWhere('title', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    });
                })
                ->orderBy('page_key')
                ->paginate($perPage)
                ->appends($request->query()),
        );
    }

    public function store(StoreSeoSettingRequest $request): SeoSettingResource
    {
        $validated = $request->validated();
        $validated['og_image'] = $this->fileUploadService->storePublic($request->file('og_image'), 'seo');

        return new SeoSettingResource(SeoSetting::query()->create($validated));
    }

    public function show(SeoSetting $seoSetting): SeoSettingResource
    {
        return new SeoSettingResource($seoSetting);
    }

    public function update(UpdateSeoSettingRequest $request, SeoSetting $seoSetting): SeoSettingResource
    {
        $validated = $request->validated();
        $validated['og_image'] = $this->fileUploadService->replacePublic($seoSetting->og_image, $request->file('og_image'), 'seo');

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
