# Frontend Foundation Report

## Current Direction

The frontend now follows the visual language supplied in the local `frontend_design` folder rather than the previous custom premium layout direction. The SPA still keeps the existing React ordering flow, local account behavior, notifications, PWA structure, and responsive navigation, but its presentation has been remapped to align with the provided theme style.

## Source Of Design Direction

Local reference inspected:
- `frontend_design/index.html`
- `frontend_design/assets/css/home_1_style.css`
- `frontend_design/assets/img/*`

Design patterns extracted from that theme:
- top utility strip plus formal navigation
- full-bleed hero slider with centered messaging
- darker framed special-menu section
- wider vertical spacing between sections
- stronger uppercase display typography
- textured and noisy background layers
- decorative vectors and patterned dividers
- darker restaurant-style content blocks with image-led sections

## Theme And Typography Changes

Updated in:
- [resources/js/styles/theme.css](/c:/xampp/htdocs/iddrissa/resources/js/styles/theme.css:1)
- [resources/js/styles/app.css](/c:/xampp/htdocs/iddrissa/resources/js/styles/app.css:1)
- [resources/views/app.blade.php](/c:/xampp/htdocs/iddrissa/resources/views/app.blade.php:1)

Changes made:
- switched display font to `Oswald`
- switched body font to `Josefin Sans`
- rebuilt dark and light theme palettes around warmer restaurant-compatible neutrals
- aligned font color, background color, primary color, secondary color, and accent color for both modes
- introduced theme textures, noise, border patterns, and formal section spacing

## Theme Assets Added

Copied from `frontend_design/assets/img` into public-serving paths:
- [public/assets/theme/body_bg.png](/c:/xampp/htdocs/iddrissa/public/assets/theme/body_bg.png:1)
- [public/assets/theme/noise.png](/c:/xampp/htdocs/iddrissa/public/assets/theme/noise.png:1)
- [public/assets/theme/menu_pattern.png](/c:/xampp/htdocs/iddrissa/public/assets/theme/menu_pattern.png:1)
- [public/assets/theme/about_shapes.png](/c:/xampp/htdocs/iddrissa/public/assets/theme/about_shapes.png:1)
- [public/assets/theme/reservation_bg.png](/c:/xampp/htdocs/iddrissa/public/assets/theme/reservation_bg.png:1)
- [public/assets/theme/reservation_imgs.png](/c:/xampp/htdocs/iddrissa/public/assets/theme/reservation_imgs.png:1)
- [public/assets/theme/vec1.svg](/c:/xampp/htdocs/iddrissa/public/assets/theme/vec1.svg:1)
- [public/assets/theme/vec2.svg](/c:/xampp/htdocs/iddrissa/public/assets/theme/vec2.svg:1)
- [public/assets/theme/vec3.svg](/c:/xampp/htdocs/iddrissa/public/assets/theme/vec3.svg:1)

## Major Frontend Areas Reworked

### Shell And Navigation

Updated:
- [resources/js/components/layout/DesktopHeader.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/layout/DesktopHeader.tsx:1)
- [resources/js/components/layout/TabletHeader.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/layout/TabletHeader.tsx:1)
- [resources/js/components/layout/MobileBottomNav.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/layout/MobileBottomNav.tsx:1)
- [resources/js/components/layout/SectionContainer.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/layout/SectionContainer.tsx:1)
- [resources/js/components/layout/AppShell.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/layout/AppShell.tsx:1)

Applied:
- utility top strip
- formal themed nav
- mobile-friendly sticky shell
- responsive spacing closer to the supplied design

### Hero

Updated:
- [resources/js/components/home/HeroSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/HeroSection.tsx:1)

Applied:
- full-height centered hero slider
- previous/next controls
- slide dots
- darker overlay treatment
- CTA cluster styled to match the new shell

### Popular And Menu

Updated:
- [resources/js/components/home/PopularGrillsSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/PopularGrillsSection.tsx:1)
- [resources/js/components/menu/FoodMenuSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/menu/FoodMenuSection.tsx:1)
- [resources/js/components/menu/FoodFilterTabs.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/menu/FoodFilterTabs.tsx:1)
- [resources/js/components/menu/FoodSearchInput.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/menu/FoodSearchInput.tsx:1)
- [resources/js/components/menu/FoodCard.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/menu/FoodCard.tsx:1)

Applied:
- feature-style grill section over dark image background
- darker framed menu wrapper inspired by the supplied theme
- two-column menu-list presentation for foods
- warmer controls and category tabs

### About, Pickup, Gallery, Reviews, Contact

Updated:
- [resources/js/components/home/AboutSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/AboutSection.tsx:1)
- [resources/js/components/home/PickupHowItWorksSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/PickupHowItWorksSection.tsx:1)
- [resources/js/components/home/GallerySection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/GallerySection.tsx:1)
- [resources/js/components/reviews/ReviewsSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/reviews/ReviewsSection.tsx:1)
- [resources/js/components/reviews/ReviewCard.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/reviews/ReviewCard.tsx:1)
- [resources/js/components/home/ContactSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/ContactSection.tsx:1)

Applied:
- offset image/story layout in about
- darker step-process section
- more theme-consistent gallery framing
- slider-like review controls and stronger testimonial layout
- reservation-band-inspired contact/pickup section adapted to our pickup-only business

## App Behavior Preserved

Not changed conceptually:
- dark mode default with manual light mode toggle
- pickup-only and cash-only ordering
- local customer identity
- local order storage
- review gating and pending review architecture
- in-app notifications
- PWA install and offline structure

## Verification

Passed after the redesign:
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- `php artisan view:cache`
- `php artisan test`

## Notes

- Vite build reports that `/assets/theme/*` public asset URLs remain runtime-resolved. This is expected because they are served from Laravel `public/`.
- The main JS chunk still exceeds the default Vite warning threshold, but the build passes successfully.

## Latest Adjustments

Updated:
- [resources/js/components/home/GallerySection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/GallerySection.tsx:1)
- [resources/js/components/common/Modal.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/common/Modal.tsx:1)
- [resources/js/components/common/BottomSheet.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/common/BottomSheet.tsx:1)
- [resources/js/components/menu/FoodOrderModal.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/menu/FoodOrderModal.tsx:1)
- [resources/js/components/ordering/CustomerDetailsModal.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/ordering/CustomerDetailsModal.tsx:1)
- [resources/js/components/reviews/LeaveReviewModal.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/reviews/LeaveReviewModal.tsx:1)
- [resources/js/components/home/ContactSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/ContactSection.tsx:1)
- [resources/js/components/home/PickupHowItWorksSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/PickupHowItWorksSection.tsx:1)
- [resources/js/components/layout/AppShell.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/layout/AppShell.tsx:1)
- [resources/js/components/pwa/FirstVisitPromptModal.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/pwa/FirstVisitPromptModal.tsx:1)
- [resources/js/utils/phone.ts](/c:/xampp/htdocs/iddrissa/resources/js/utils/phone.ts:1)
- [resources/js/utils/location.ts](/c:/xampp/htdocs/iddrissa/resources/js/utils/location.ts:1)

Applied:
- normalized gallery tile aspect ratios and object positioning so the real food images fit their containers more consistently
- reduced modal visual height and made modal bodies scroll instead of stretching past the viewport
- changed account/order/review phone handling to USA formatting with normalized storage-ready identity values
- added first-visit notification and install prompts using the native Notifications API, `beforeinstallprompt`, localStorage dismissal flags, and the existing service worker/PWA hook layer
- improved top-menu hover states with theme-matched shade treatment in dark and light modes
- added stronger themed input borders/backgrounds for light mode and dark mode
- made pickup locations open a confirmation prompt before launching map directions
- updated ordering copy to reflect Friday pre-orders, Saturday preparation/pickup hours, and the 9:00 PM Saturday ordering cutoff

## Live Data Connection Status

Updated:
- [resources/js/services/publicService.ts](/c:/xampp/htdocs/iddrissa/resources/js/services/publicService.ts:1)
- [resources/js/types/company.ts](/c:/xampp/htdocs/iddrissa/resources/js/types/company.ts:1)
- [resources/js/types/index.ts](/c:/xampp/htdocs/iddrissa/resources/js/types/index.ts:1)
- [resources/js/components/layout/AppShell.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/layout/AppShell.tsx:1)
- [resources/js/components/home/HeroSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/HeroSection.tsx:1)
- [resources/js/components/home/AboutSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/AboutSection.tsx:1)
- [resources/js/components/home/ContactSection.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/home/ContactSection.tsx:1)
- [resources/js/components/menu/FoodOrderModal.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/menu/FoodOrderModal.tsx:1)
- [resources/js/components/ordering/OrderSuccessModal.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/ordering/OrderSuccessModal.tsx:1)

Connected to database-backed APIs:
- public foods now come from `GET /api/foods`
- public categories now come from `GET /api/categories`
- company name, address, phone, about copy, tagline, and opening hours now come from `GET /api/company-settings`

Still frontend-local or static for now:
- approved/pending reviews are still from local mock/localStorage because there is no review schema yet
- gallery composition is still static and not curated from the database
- some hero/editorial fallback copy still exists in components when company settings are missing
- local customer identity and local order history are still mock-device storage, not backend-authenticated customer records

Recommended next backend data additions if you want zero static public content:
1. add a `reviews` table, model, seeder, public approved reviews endpoint, and admin approval workflow
2. add a `homepage_sections` or richer `company_settings` content model for hero slides, service badges, gallery ordering, and trust copy
3. move local customer/order identity into real customer auth and customer order APIs on the frontend

## Next Recommendation

If this direction is now closer to what you want, the next pass should focus on:
1. tuning tablet and mobile spacing against the new theme
2. redesigning the order modal and account modal to match the same visual language
3. adding section reveal animations closer to the supplied theme
4. refining light-theme contrast section by section
