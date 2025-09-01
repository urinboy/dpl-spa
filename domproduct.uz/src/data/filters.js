// Mahsulot filtrlash uchun yangi data tuzilmalari
export const filterOptions = {
    categories: [
        { id: 'all', name: 'all_categories', icon: '🏠' },
        { id: 'electronics', name: 'electronics', icon: '📱' },
        { id: 'clothing', name: 'clothing', icon: '👕' },
        { id: 'home', name: 'home_garden', icon: '🏡' },
        { id: 'sports', name: 'sports', icon: '⚽' },
        { id: 'books', name: 'books', icon: '📚' },
        { id: 'toys', name: 'toys', icon: '🧸' },
    ],
    
    brands: [
        { id: 'samsung', name: 'Samsung' },
        { id: 'apple', name: 'Apple' },
        { id: 'xiaomi', name: 'Xiaomi' },
        { id: 'nike', name: 'Nike' },
        { id: 'adidas', name: 'Adidas' },
        { id: 'zara', name: 'Zara' },
        { id: 'h&m', name: 'H&M' },
    ],
    
    priceRanges: [
        { id: 'all', name: 'all_prices', min: 0, max: Infinity },
        { id: 'under100', name: 'under_100k', min: 0, max: 100000 },
        { id: '100to500', name: '100k_to_500k', min: 100000, max: 500000 },
        { id: '500to1m', name: '500k_to_1m', min: 500000, max: 1000000 },
        { id: 'over1m', name: 'over_1m', min: 1000000, max: Infinity },
    ],
    
    sortOptions: [
        { id: 'default', name: 'sort_default' },
        { id: 'price_asc', name: 'sort_price_low_high' },
        { id: 'price_desc', name: 'sort_price_high_low' },
        { id: 'name_asc', name: 'sort_name_a_z' },
        { id: 'name_desc', name: 'sort_name_z_a' },
        { id: 'rating', name: 'sort_rating' },
        { id: 'newest', name: 'sort_newest' },
    ],
    
    ratings: [
        { id: 'all', name: 'all_ratings', value: 0 },
        { id: '4plus', name: '4_stars_plus', value: 4 },
        { id: '3plus', name: '3_stars_plus', value: 3 },
        { id: '2plus', name: '2_stars_plus', value: 2 },
        { id: '1plus', name: '1_star_plus', value: 1 },
    ]
};

// To'lov usullari
export const paymentMethods = [
    {
        id: 'cash',
        name: 'cash_on_delivery',
        icon: '💵',
        description: 'pay_when_delivered',
        available: true,
        processingFee: 0
    },
    {
        id: 'card',
        name: 'bank_card',
        icon: '💳',
        description: 'visa_mastercard',
        available: true,
        processingFee: 0
    },
    {
        id: 'click',
        name: 'click',
        icon: '📱',
        description: 'click_description',
        available: true,
        processingFee: 0
    },
    {
        id: 'payme',
        name: 'payme',
        icon: '💎',
        description: 'payme_description',
        available: true,
        processingFee: 0
    },
    {
        id: 'uzcard',
        name: 'uzcard',
        icon: '💳',
        description: 'uzcard_description',
        available: true,
        processingFee: 0
    }
];

// Yetkazib berish variantlari
export const deliveryOptions = [
    {
        id: 'standard',
        name: 'standard_delivery',
        icon: '🚚',
        description: '3_5_business_days',
        price: 25000,
        estimatedDays: { min: 3, max: 5 },
        available: true
    },
    {
        id: 'express',
        name: 'express_delivery',
        icon: '⚡',
        description: '1_2_business_days',
        price: 50000,
        estimatedDays: { min: 1, max: 2 },
        available: true
    },
    {
        id: 'same_day',
        name: 'same_day_delivery',
        icon: '🏃',
        description: 'order_before_2pm',
        price: 75000,
        estimatedDays: { min: 0, max: 0 },
        available: false // Bu vaqtincha o'chirilgan
    },
    {
        id: 'pickup',
        name: 'store_pickup',
        icon: '🏪',
        description: 'pickup_from_store',
        price: 0,
        estimatedDays: { min: 1, max: 2 },
        available: true
    }
];

// Buyurtma statuslari
export const orderStatuses = [
    {
        id: 'pending',
        name: 'order_pending',
        icon: '⏳',
        color: '#f59e0b',
        description: 'order_being_processed'
    },
    {
        id: 'confirmed',
        name: 'order_confirmed',
        icon: '✅',
        color: '#10b981',
        description: 'order_confirmed_desc'
    },
    {
        id: 'preparing',
        name: 'order_preparing',
        icon: '📦',
        color: '#3b82f6',
        description: 'order_being_prepared'
    },
    {
        id: 'shipped',
        name: 'order_shipped',
        icon: '🚚',
        color: '#8b5cf6',
        description: 'order_on_the_way'
    },
    {
        id: 'delivered',
        name: 'order_delivered',
        icon: '🎉',
        color: '#059669',
        description: 'order_delivered_desc'
    },
    {
        id: 'cancelled',
        name: 'order_cancelled',
        icon: '❌',
        color: '#ef4444',
        description: 'order_cancelled_desc'
    }
];
