export const tags = [
    {
        id: 1,
        slug: 'promo',
        icon: '/images/filter_promo.svg',
        iconClass: 'fas fa-percent',
        translations: {
            uz: 'Aksiyalar',
            ru: 'Акции',
            en: 'Promotions'
        }
    },
    {
        id: 2,
        slug: 'top',
        icon: '/images/filter_top.svg',
        iconClass: 'fas fa-star',
        translations: {
            uz: 'Top',
            ru: 'Топ',
            en: 'Top'
        }
    },
    {
        id: 3,
        slug: 'new',
        icon: '/images/filter_new.svg',
        iconClass: 'fas fa-sparkles',
        translations: {
            uz: 'Yangiliklar',
            ru: 'Новинки',
            en: 'New'
        }
    },
    {
        id: 4,
        slug: 'premium',
        icon: '/images/filter_premium.svg',
        iconClass: 'fas fa-crown',
        translations: {
            uz: 'Premium',
            ru: 'Премиум',
            en: 'Premium'
        }
    },
    {
        id: 5,
        slug: 'bestseller',
        icon: '/images/filter_bestseller.svg',
        iconClass: 'fas fa-fire',
        translations: {
            uz: 'Ommabop',
            ru: 'Хиты продаж',
            en: 'Bestseller'
        }
    },
    {
        id: 6,
        slug: 'eco',
        icon: '/images/filter_eco.svg',
        iconClass: 'fas fa-leaf',
        translations: {
            uz: 'Ekologik',
            ru: 'Эко',
            en: 'Eco'
        }
    }
];

// Featured tags for home page
export const featuredTags = tags.slice(0, 4);
