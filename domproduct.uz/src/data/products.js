// Продукты
export const allProducts = [
  {
    id: 1,
    name: 'product_1_name',
    price: 25000,
    originalPrice: 30000,
    image: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Product+1',
    category: 'vegetables',
    brand: 'EcoFarm',
    description: 'product_1_description',
    rating: 4.8,
    inStock: true,
    createdAt: '2024-01-15',
    tags: ['organic', 'fresh']
  },
  {
    id: 2,
    name: 'product_2_name',
    price: 18000,
    originalPrice: 22000,
    image: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Product+2',
    category: 'vegetables',
    brand: 'GreenGarden',
    description: 'product_2_description',
    rating: 4.5,
    inStock: true,
    createdAt: '2024-01-12',
    tags: ['fresh', 'local']
  },
  {
    id: 3,
    name: 'product_3_name',
    price: 28000,
    originalPrice: 32000,
    image: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Product+3',
    category: 'beverages',
    brand: 'PureJuice',
    description: 'product_3_description',
    rating: 4.6,
    inStock: false,
    createdAt: '2024-01-10',
    tags: ['healthy', 'natural']
  },
  {
    id: 4,
    name: 'product_4_name',
    price: 15000,
    originalPrice: 18000,
    image: 'https://via.placeholder.com/400x300/f97316/ffffff?text=Product+4',
    category: 'fruits',
    brand: 'FreshFruit',
    description: 'product_4_description',
    rating: 4.7,
    inStock: true,
    createdAt: '2024-01-08',
    tags: ['sweet', 'vitamin']
  },
  {
    id: 5,
    name: 'product_5_name',
    price: 12000,
    originalPrice: 15000,
    image: 'https://via.placeholder.com/400x300/06b6d4/ffffff?text=Product+5',
    category: 'grains',
    brand: 'QualityGrain',
    description: 'product_5_description',
    rating: 4.4,
    inStock: true,
    createdAt: '2024-01-05',
    tags: ['organic', 'healthy']
  },
  {
    id: 6,
    name: 'product_6_name',
    price: 35000,
    originalPrice: 40000,
    image: 'https://via.placeholder.com/400x300/84cc16/ffffff?text=Product+6',
    category: 'meat',
    brand: 'PremiumMeat',
    description: 'product_6_description',
    rating: 4.9,
    inStock: true,
    createdAt: '2024-01-02',
    tags: ['fresh', 'premium']
  },
  {
    id: 7,
    name: 'product_7_name',
    price: 22000,
    originalPrice: 26000,
    image: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Product+7',
    category: 'dairy',
    brand: 'FreshDairy',
    description: 'product_7_description',
    rating: 4.3,
    inStock: true,
    createdAt: '2023-12-30',
    tags: ['natural', 'calcium']
  },
  {
    id: 8,
    name: 'product_8_name',
    price: 8000,
    originalPrice: 10000,
    image: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Product+8',
    category: 'bakery',
    brand: 'BakeFresh',
    description: 'product_8_description',
    rating: 4.2,
    inStock: true,
    createdAt: '2023-12-28',
    tags: ['fresh', 'traditional']
  },
  {
    id: 9,
    name: 'product_9_name',
    price: 45000,
    originalPrice: 50000,
    image: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=Product+9',
    category: 'seafood',
    brand: 'OceanFresh',
    description: 'product_9_description',
    rating: 4.8,
    inStock: false,
    createdAt: '2023-12-25',
    tags: ['premium', 'omega3']
  },
  {
    id: 10,
    name: 'product_10_name',
    price: 14000,
    originalPrice: 16000,
    image: 'https://via.placeholder.com/400x300/14b8a6/ffffff?text=Product+10',
    category: 'fruits',
    brand: 'GardenFresh',
    description: 'product_10_description',
    rating: 4.5,
    inStock: true,
    createdAt: '2023-12-22',
    tags: ['sweet', 'healthy']
  },
  {
    id: 11,
    name: 'product_11_name',
    price: 16000,
    originalPrice: 19000,
    image: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Product+11',
    category: 'vegetables',
    brand: 'EcoFarm',
    description: 'product_11_description',
    rating: 4.4,
    inStock: true,
    createdAt: '2023-12-20',
    tags: ['organic', 'fresh']
  },
  {
    id: 12,
    name: 'product_12_name',
    price: 32000,
    originalPrice: 36000,
    image: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=Product+12',
    category: 'meat',
    brand: 'PremiumMeat',
    description: 'product_12_description',
    rating: 4.7,
    inStock: true,
    createdAt: '2023-12-18',
    tags: ['premium', 'fresh']
  }
];

// Фильтрованные продукты по категориям
export const products = {
  vegetables: allProducts.filter(product => product.category === 'vegetables'),
  fruits: allProducts.filter(product => product.category === 'fruits'),
  meat: allProducts.filter(product => product.category === 'meat'),
  dairy: allProducts.filter(product => product.category === 'dairy'),
  beverages: allProducts.filter(product => product.category === 'beverages'),
  grains: allProducts.filter(product => product.category === 'grains'),
  bakery: allProducts.filter(product => product.category === 'bakery'),
  seafood: allProducts.filter(product => product.category === 'seafood')
};

export default allProducts;

// Get products by category
export const getProductsByCategory = (categorySlug) => {
  if (!categorySlug) return [];
  return allProducts.filter(product => product.category === categorySlug);
};

// Get featured products
export const getFeaturedProducts = (limit = 8) => {
  return allProducts.filter(product => product.rating >= 4.5).slice(0, limit);
};

// Get products by search query
export const searchProducts = (query) => {
  if (!query) return [];
  const searchTerm = query.toLowerCase();
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};
