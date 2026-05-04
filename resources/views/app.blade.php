<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @php
            $fallbackIconPath = 'icons/app_ico.png';
            $appIconUrl = asset($fallbackIconPath);
            $companySettings = null;
            $seoSettings = null;

            try {
                if (\Illuminate\Support\Facades\Schema::hasTable('company_settings')) {
                    $companySettings = \App\Models\CompanySetting::query()->first();
                }
            } catch (\Throwable $exception) {
                $companySettings = null;
            }

            try {
                if (\Illuminate\Support\Facades\Schema::hasTable('seo_settings')) {
                    $seoSettings = \App\Models\SeoSetting::query()->where('page_key', 'home')->first();
                }
            } catch (\Throwable $exception) {
                $seoSettings = null;
            }

            $resolveBrandAsset = static fn (?string $path, string $fallback) => filled($path) ? url($path) : $fallback;
            $faviconUrl = $resolveBrandAsset($companySettings?->favicon, $appIconUrl);
            $logoUrl = $resolveBrandAsset($companySettings?->logo, $appIconUrl);
            $appleTouchIconUrl = asset('icons/apple-touch-icon.png');
            $companyName = filled($companySettings?->company_name) ? $companySettings->company_name : config('app.name', 'Dri Foods');
            $companyAddress = filled($companySettings?->address) ? $companySettings->address : 'Pickup address coming soon';
            $companyPhone = filled($companySettings?->phone) ? $companySettings->phone : null;
            $companyEmail = filled($companySettings?->email) ? $companySettings->email : null;
            $companyHours = $companySettings?->opening_hours ?? null;
            $companyDescription = filled($companySettings?->about)
                ? $companySettings->about
                : (filled($companySettings?->tagline) ? $companySettings->tagline : 'Pickup-only traditional African grill ordering PWA with cash payment at pickup.');

            // SEO overrides from SeoSetting (page_key = 'home')
            $seoTitle = filled($seoSettings?->title) ? $seoSettings->title : $companyName;
            $seoDescription = filled($seoSettings?->description) ? $seoSettings->description : $companyDescription;
            $seoKeywords = filled($seoSettings?->keywords) ? $seoSettings->keywords : null;
            $seoOgImage = filled($seoSettings?->og_image) ? url($seoSettings->og_image) : $logoUrl;
            $seoSchema = !empty($seoSettings?->schema_json) ? $seoSettings->schema_json : null;
        @endphp
        <meta name="theme-color" content="#060118">
        <meta name="application-name" content="Dri Foods">
        <meta name="format-detection" content="telephone=no">
        <meta name="description" content="{{ $seoDescription }}">
        @if ($seoKeywords)
        <meta name="keywords" content="{{ $seoKeywords }}">
        @endif
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ $seoOgImage }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="{{ $seoOgImage }}">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="Dri Foods">
        <link rel="canonical" href="{{ url()->current() }}">
        <link rel="manifest" href="{{ asset('manifest.webmanifest') }}">
        <link rel="icon" href="{{ $faviconUrl }}" sizes="any">
        <link rel="shortcut icon" href="{{ $faviconUrl }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ $appleTouchIconUrl }}">
        <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('icons/app-icon-192.png') }}">
        <link rel="icon" type="image/png" sizes="512x512" href="{{ asset('icons/app-icon-512.png') }}">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=josefin-sans:300,400,500,600,700|oswald:300,400,500,600,700" rel="stylesheet" />
        <title>{{ $seoTitle }}</title>
        @php
            $restaurantSchema = $seoSchema ?? [
                '@context' => 'https://schema.org',
                '@type' => ['Restaurant', 'FoodEstablishment', 'LocalBusiness'],
                'name' => $companyName,
                'servesCuisine' => 'Traditional African Grill',
                'description' => $companyDescription,
                'url' => url('/'),
                'address' => [
                    '@type' => 'PostalAddress',
                    'streetAddress' => $companyAddress,
                    'addressCountry' => 'US',
                ],
                ...($companyPhone ? ['telephone' => $companyPhone] : []),
                ...($companyEmail ? ['email' => $companyEmail] : []),
                ...($companyHours ? ['openingHoursSpecification' => $companyHours] : []),
                'paymentAccepted' => 'Cash',
                'currenciesAccepted' => 'USD',
                'priceRange' => '$$',
            ];
        @endphp
        <script type="application/ld+json">@json($restaurantSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)</script>
        <style>
            :root {
                --theme-body-bg-url: url('{{ asset('assets/theme/body_bg.png') }}');
                --theme-noise-url: url('{{ asset('assets/theme/noise.png') }}');
                --theme-vec1-url: url('{{ asset('assets/theme/vec1.svg') }}');
            }
        </style>

        <script>
            (() => {
                const root = document.documentElement;
                const savedPreference = window.localStorage.getItem('restaurant-theme');
                const theme = savedPreference === 'light' ? 'light' : 'dark';

                root.classList.remove('light', 'dark');
                root.classList.add(theme);
                root.dataset.theme = theme;
            })();
        </script>

        @if (file_exists(public_path('hot')))
            @viteReactRefresh
        @endif

        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/main.tsx'])
        @endif
    </head>
    <body class="antialiased">
        <div id="app"></div>
        <noscript>
            <div style="padding: 2rem; color: #f7efe4; background: #120f0d;">
                This application requires JavaScript to render the ordering experience.
            </div>
        </noscript>
    </body>
</html>
