<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="theme-color" content="#060118">
        <meta
            name="description"
            content="A premium dark-mode-first restaurant ordering PWA for browsing meals, placing pickup orders, and paying cash at the restaurant."
        >
        <meta property="og:title" content="{{ config('app.name') }}">
        <meta
            property="og:description"
            content="Browse the menu, order for pickup, and pay cash when you arrive. Mobile-first, installable, and ready for notification upgrades."
        >
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="Ember Table">
        <link rel="canonical" href="{{ url()->current() }}">
        <link rel="manifest" href="{{ asset('manifest.webmanifest') }}">
        <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
        <link rel="apple-touch-icon" href="{{ asset('icons/app-icon.svg') }}">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=sora:400,500,600,700,800|outfit:400,500,600,700,800" rel="stylesheet" />
        <title>{{ config('app.name') }}</title>
        <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "Restaurant",
                "name": "Ember Table",
                "servesCuisine": "Contemporary African Grill",
                "description": "Pickup-first restaurant ordering experience with cash payment at the premises.",
                "url": "{{ url('/') }}",
                "paymentAccepted": "Cash",
                "priceRange": "$$"
            }
        </script>

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
