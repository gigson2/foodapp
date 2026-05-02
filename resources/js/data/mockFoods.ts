import type { Food } from '@/types';

function createFoodArt(name: string, start: string, end: string) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${name}">
            <defs>
                <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${start}" />
                    <stop offset="100%" stop-color="${end}" />
                </linearGradient>
            </defs>
            <rect width="800" height="600" rx="48" fill="#060118" />
            <rect x="36" y="36" width="728" height="528" rx="40" fill="url(#g)" opacity="0.92" />
            <circle cx="604" cy="156" r="88" fill="rgba(255,255,255,0.12)" />
            <circle cx="228" cy="422" r="126" fill="rgba(0,0,0,0.16)" />
            <text x="72" y="468" fill="#ffffff" font-size="68" font-family="Outfit, sans-serif" font-weight="700">${name}</text>
            <text x="72" y="528" fill="rgba(255,255,255,0.82)" font-size="28" font-family="Outfit, sans-serif">Pickup-ready signature item</text>
        </svg>
    `.trim();

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const mockFoods: Food[] = [
    {
        id: 'food_ember_jollof',
        name: 'Ember Jollof Box',
        slug: 'ember-jollof-box',
        category: 'Rice Meals',
        description: 'Smoky jollof rice, charred chicken, sweet plantain, and a quick lime slaw.',
        image: createFoodArt('Ember Jollof Box', '#ff3333', '#97f50a'),
        price: 18.5,
        preparationTimeMinutes: 18,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
    },
    {
        id: 'food_fire_suya_rice',
        name: 'Fire Suya Rice',
        slug: 'fire-suya-rice',
        category: 'Rice Meals',
        description: 'Peppered rice with suya-spiced beef strips, onions, and a cooling herb sauce.',
        image: createFoodArt('Fire Suya Rice', '#ff0000', '#643bf7'),
        price: 19,
        preparationTimeMinutes: 20,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
    },
    {
        id: 'food_cedar_grill_wings',
        name: 'Cedar Grill Wings',
        slug: 'cedar-grill-wings',
        category: 'Grills',
        description: 'Sticky grilled wings brushed with tamarind glaze and finished with toasted lime.',
        image: createFoodArt('Cedar Grill Wings', '#ff6666', '#8b6cf9'),
        price: 15.5,
        preparationTimeMinutes: 16,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
    },
    {
        id: 'food_midnight_beef_skewers',
        name: 'Midnight Beef Skewers',
        slug: 'midnight-beef-skewers',
        category: 'Grills',
        description: 'Open-flame beef skewers with black pepper butter and grilled pepper relish.',
        image: createFoodArt('Midnight Beef Skewers', '#990000', '#3d0af5'),
        price: 21,
        preparationTimeMinutes: 22,
        isAvailable: true,
        isFeatured: false,
        isPopular: false,
    },
    {
        id: 'food_velvet_pepper_soup',
        name: 'Velvet Pepper Soup',
        slug: 'velvet-pepper-soup',
        category: 'Soups',
        description: 'Deep aromatic broth with goat meat, basil leaf, and warm spice oil.',
        image: createFoodArt('Velvet Pepper Soup', '#cc0000', '#3108c4'),
        price: 17,
        preparationTimeMinutes: 14,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
    },
    {
        id: 'food_harbor_seafood_broth',
        name: 'Harbor Seafood Broth',
        slug: 'harbor-seafood-broth',
        category: 'Soups',
        description: 'Rich prawn and fish broth with citrus leaf, herbs, and soft root vegetables.',
        image: createFoodArt('Harbor Seafood Broth', '#ff9999', '#00cc3d'),
        price: 20.5,
        preparationTimeMinutes: 19,
        isAvailable: true,
        isFeatured: false,
        isPopular: false,
    },
    {
        id: 'food_solar_hibiscus_chill',
        name: 'Solar Hibiscus Chill',
        slug: 'solar-hibiscus-chill',
        category: 'Drinks',
        description: 'House-brewed hibiscus, pineapple peel syrup, and cold citrus sparkle.',
        image: createFoodArt('Solar Hibiscus Chill', '#4c08f7', '#00ff4d'),
        price: 6.5,
        preparationTimeMinutes: 4,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
    },
    {
        id: 'food_tonight_chef_platter',
        name: 'Tonight Chef Platter',
        slug: 'tonight-chef-platter',
        category: 'Specials',
        description: 'A rotating chef platter with grilled protein, bright rice, and a market side.',
        image: createFoodArt('Tonight Chef Platter', '#97f50a', '#ff3333'),
        price: 24,
        preparationTimeMinutes: 24,
        isAvailable: true,
        isFeatured: true,
        isPopular: false,
    },
];
