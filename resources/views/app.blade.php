<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="theme-color" content="#060118">
        <meta
            name="description"
            content="Order tender grilled chicken and goat from Dri Africain Traditional Grill LLC in Papillion, Nebraska. Pickup-only, cash-at-pickup traditional African grill."
        >
        <meta property="og:title" content="Dri Africain Traditional Grill LLC | Grilled Chicken & Goat in Papillion, NE">
        <meta
            property="og:description"
            content="Pickup-only African grill in Papillion, Nebraska serving tender grilled chicken and goat with cash payment at pickup."
        >
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="Dri Grill">
        <link rel="canonical" href="{{ url()->current() }}">
        <link rel="manifest" href="{{ asset('manifest.webmanifest') }}">
        <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
        <link rel="apple-touch-icon" href="{{ asset('icons/app-icon.svg') }}">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=josefin-sans:300,400,500,600,700|oswald:300,400,500,600,700" rel="stylesheet" />
        <title>Dri Africain Traditional Grill LLC | Grilled Chicken &amp; Goat in Papillion, NE</title>
        @php
            $restaurantSchema = [
                '@context' => 'https://schema.org',
                '@type' => ['Restaurant', 'FoodEstablishment', 'LocalBusiness'],
                'name' => 'Dri Africain Traditional Grill LLC',
                'servesCuisine' => 'Traditional African Grill',
                'description' => 'Pickup-only traditional African grilled chicken and grilled goat in Papillion, Nebraska.',
                'url' => url('/'),
                'address' => [
                    '@type' => 'PostalAddress',
                    'streetAddress' => '701 Golden Gate Circle',
                    'addressLocality' => 'Papillion',
                    'addressRegion' => 'NE',
                    'postalCode' => '68046',
                    'addressCountry' => 'US',
                ],
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
