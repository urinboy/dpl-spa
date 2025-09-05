export const categories = [
  {
    id: 1,
    parent_id: null,
    slug: 'vegetables',
    sort_order: 1,
    icon: '🥕',
    image: '/images/categories/vegetables.jpg',
    is_active: true,
    translations: {
      uz: {
        name: 'Sabzavotlar',
        description: 'Yangi va sifatli sabzavotlar',
        meta_title: 'Sabzavotlar - Pomidor, Bodring, Kartoshka va boshqalar',
        meta_description: 'Eng yangi va sifatli sabzavotlar: pomidor, bodring, kartoshka, sabzi, piyoz va boshqa sabzavotlar'
      },
      en: {
        name: 'Vegetables',
        description: 'Fresh and quality vegetables',
        meta_title: 'Vegetables - Tomato, Cucumber, Potato and others',
        meta_description: 'Fresh and quality vegetables: tomato, cucumber, potato, carrot, onion and other vegetables'
      },
      ru: {
        name: 'Овощи',
        description: 'Свежие и качественные овощи',
        meta_title: 'Овощи - Помидоры, Огурцы, Картофель и другие',
        meta_description: 'Свежие и качественные овощи: помидоры, огурцы, картофель, морковь, лук и другие овощи'
      }
    },
    children: [
      {
        id: 11,
        parent_id: 1,
        slug: 'tomato',
        sort_order: 1,
        icon: '🍅',
        is_active: true,
        translations: {
          uz: { name: 'Pomidor', description: 'Turli navdagi yangi pomidor' },
          en: { name: 'Tomato', description: 'Various types of fresh tomatoes' },
          ru: { name: 'Помидоры', description: 'Различные виды свежих помидоров' }
        }
      },
      {
        id: 12,
        parent_id: 1,
        slug: 'cucumber',
        sort_order: 2,
        icon: '🥒',
        is_active: true,
        translations: {
          uz: { name: 'Bodring', description: 'Yangi va mazali bodring' },
          en: { name: 'Cucumber', description: 'Fresh and tasty cucumbers' },
          ru: { name: 'Огурцы', description: 'Свежие и вкусные огурцы' }
        }
      },
      {
        id: 13,
        parent_id: 1,
        slug: 'potato',
        sort_order: 3,
        icon: '🥔',
        is_active: true,
        translations: {
          uz: { name: 'Kartoshka', description: 'Sifatli kartoshka turlari' },
          en: { name: 'Potato', description: 'Quality potato varieties' },
          ru: { name: 'Картофель', description: 'Качественные сорта картофеля' }
        }
      },
      {
        id: 14,
        parent_id: 1,
        slug: 'carrot',
        sort_order: 4,
        icon: '🥕',
        is_active: true,
        translations: {
          uz: { name: 'Sabzi', description: 'Yangi va shirali sabzi' },
          en: { name: 'Carrot', description: 'Fresh and juicy carrots' },
          ru: { name: 'Морковь', description: 'Свежая и сочная морковь' }
        }
      },
      {
        id: 15,
        parent_id: 1,
        slug: 'onion',
        sort_order: 5,
        icon: '🧅',
        is_active: true,
        translations: {
          uz: { name: 'Piyoz', description: 'Turli navdagi piyoz' },
          en: { name: 'Onion', description: 'Various types of onions' },
          ru: { name: 'Лук', description: 'Различные виды лука' }
        }
      },
      {
        id: 16,
        parent_id: 1,
        slug: 'pepper',
        sort_order: 6,
        icon: '🌶️',
        is_active: true,
        translations: {
          uz: { name: 'Qalampir', description: 'Achchiq va shirin qalampir' },
          en: { name: 'Pepper', description: 'Hot and sweet peppers' },
          ru: { name: 'Перец', description: 'Острый и сладкий перец' }
        }
      },
      {
        id: 17,
        parent_id: 1,
        slug: 'eggplant',
        sort_order: 7,
        icon: '🍆',
        is_active: true,
        translations: {
          uz: { name: 'Baqlajon', description: 'Yangi baqlajon mahsulotlari' },
          en: { name: 'Eggplant', description: 'Fresh eggplant products' },
          ru: { name: 'Баклажан', description: 'Свежие баклажанные продукты' }
        }
      },
      {
        id: 18,
        parent_id: 1,
        slug: 'cabbage',
        sort_order: 8,
        icon: '🥬',
        is_active: true,
        translations: {
          uz: { name: 'Karam', description: 'Turli turdagi karam' },
          en: { name: 'Cabbage', description: 'Various types of cabbage' },
          ru: { name: 'Капуста', description: 'Различные виды капусты' }
        }
      }
    ]
  },
  {
    id: 2,
    parent_id: null,
    slug: 'fruits',
    sort_order: 2,
    icon: '🍎',
    image: '/images/categories/fruits.jpg',
    is_active: true,
    translations: {
      uz: {
        name: 'Mevalar',
        description: 'Yangi va mazali mevalar',
        meta_title: 'Mevalar - Olma, Uzum, Shaftoli va boshqalar',
        meta_description: 'Eng yangi va mazali mevalar: olma, uzum, shaftoli, o\'rik, banan va boshqa mevalar'
      },
      en: {
        name: 'Fruits',
        description: 'Fresh and delicious fruits',
        meta_title: 'Fruits - Apple, Grape, Peach and others',
        meta_description: 'Fresh and delicious fruits: apple, grape, peach, apricot, banana and other fruits'
      },
      ru: {
        name: 'Фрукты',
        description: 'Свежие и вкусные фрукты',
        meta_title: 'Фрукты - Яблоки, Виноград, Персики и другие',
        meta_description: 'Свежие и вкусные фрукты: яблоки, виноград, персики, абрикосы, бананы и другие фрукты'
      }
    },
    children: [
      {
        id: 21,
        parent_id: 2,
        slug: 'apple',
        sort_order: 1,
        icon: '🍎',
        is_active: true,
        translations: {
          uz: { name: 'Olma', description: 'Turli navdagi shirin olma' },
          en: { name: 'Apple', description: 'Various types of sweet apples' },
          ru: { name: 'Яблоки', description: 'Различные сорта сладких яблок' }
        }
      },
      {
        id: 22,
        parent_id: 2,
        slug: 'grape',
        sort_order: 2,
        icon: '🍇',
        is_active: true,
        translations: {
          uz: { name: 'Uzum', description: 'Mazali va shirali uzum' },
          en: { name: 'Grape', description: 'Delicious and juicy grapes' },
          ru: { name: 'Виноград', description: 'Вкусный и сочный виноград' }
        }
      },
      {
        id: 23,
        parent_id: 2,
        slug: 'peach',
        sort_order: 3,
        icon: '🍑',
        is_active: true,
        translations: {
          uz: { name: 'Shaftoli', description: 'Shirin va yumshoq shaftoli' },
          en: { name: 'Peach', description: 'Sweet and soft peaches' },
          ru: { name: 'Персики', description: 'Сладкие и мягкие персики' }
        }
      },
      {
        id: 24,
        parent_id: 2,
        slug: 'apricot',
        sort_order: 4,
        icon: '🍊',
        is_active: true,
        translations: {
          uz: { name: 'O\'rik', description: 'Mazali va foydali o\'rik' },
          en: { name: 'Apricot', description: 'Delicious and healthy apricots' },
          ru: { name: 'Абрикосы', description: 'Вкусные и полезные абрикосы' }
        }
      },
      {
        id: 25,
        parent_id: 2,
        slug: 'banana',
        sort_order: 5,
        icon: '🍌',
        is_active: true,
        translations: {
          uz: { name: 'Banan', description: 'Tropik banan mevalari' },
          en: { name: 'Banana', description: 'Tropical banana fruits' },
          ru: { name: 'Бананы', description: 'Тропические банановые фрукты' }
        }
      },
      {
        id: 26,
        parent_id: 2,
        slug: 'orange',
        sort_order: 6,
        icon: '🍊',
        is_active: true,
        translations: {
          uz: { name: 'Apelsin', description: 'Vitamin C ga boy apelsin' },
          en: { name: 'Orange', description: 'Vitamin C rich oranges' },
          ru: { name: 'Апельсины', description: 'Богатые витамином C апельсины' }
        }
      },
      {
        id: 27,
        parent_id: 2,
        slug: 'pear',
        sort_order: 7,
        icon: '🍐',
        is_active: true,
        translations: {
          uz: { name: 'Nok', description: 'Shirin va suvli nok' },
          en: { name: 'Pear', description: 'Sweet and watery pears' },
          ru: { name: 'Груши', description: 'Сладкие и сочные груши' }
        }
      },
      {
        id: 28,
        parent_id: 2,
        slug: 'strawberry',
        sort_order: 8,
        icon: '🍓',
        is_active: true,
        translations: {
          uz: { name: 'Qulupnay', description: 'Shirin qulupnay rezvorlari' },
          en: { name: 'Strawberry', description: 'Sweet strawberry berries' },
          ru: { name: 'Клубника', description: 'Сладкие ягоды клубники' }
        }
      }
    ]
  },
  {
    id: 3,
    parent_id: null,
    slug: 'seasonal',
    sort_order: 3,
    icon: '🌸',
    image: '/images/categories/seasonal.jpg',
    is_active: true,
    translations: {
      uz: {
        name: 'Mavsumiy mahsulotlar',
        description: 'Har bir mavsum uchun maxsus mahsulotlar',
        meta_title: 'Mavsumiy mahsulotlar - Bahor, Yoz, Kuz, Qish',
        meta_description: 'Mavsumiy mahsulotlar: bahor ko\'katlari, yoz mevalari, kuz hosili, qish saqlash mahsulotlari'
      },
      en: {
        name: 'Seasonal Products',
        description: 'Special products for each season',
        meta_title: 'Seasonal Products - Spring, Summer, Autumn, Winter',
        meta_description: 'Seasonal products: spring greens, summer fruits, autumn harvest, winter storage products'
      },
      ru: {
        name: 'Сезонные продукты',
        description: 'Специальные продукты для каждого сезона',
        meta_title: 'Сезонные продукты - Весна, Лето, Осень, Зима',
        meta_description: 'Сезонные продукты: весенняя зелень, летние фрукты, осенний урожай, зимние продукты хранения'
      }
    },
    children: [
      {
        id: 31,
        parent_id: 3,
        slug: 'spring',
        sort_order: 1,
        icon: '🌱',
        is_active: true,
        translations: {
          uz: { name: 'Bahor mahsulotlari', description: 'Bahor mavsumi uchun yangi mahsulotlar' },
          en: { name: 'Spring Products', description: 'Fresh products for spring season' },
          ru: { name: 'Весенние продукты', description: 'Свежие продукты для весеннего сезона' }
        }
      },
      {
        id: 32,
        parent_id: 3,
        slug: 'summer',
        sort_order: 2,
        icon: '☀️',
        is_active: true,
        translations: {
          uz: { name: 'Yoz mahsulotlari', description: 'Yoz mavsumi uchun issiq mahsulotlar' },
          en: { name: 'Summer Products', description: 'Hot season products for summer' },
          ru: { name: 'Летние продукты', description: 'Продукты жаркого сезона для лета' }
        }
      },
      {
        id: 33,
        parent_id: 3,
        slug: 'autumn',
        sort_order: 3,
        icon: '🍂',
        is_active: true,
        translations: {
          uz: { name: 'Kuz hosili', description: 'Kuz mavsumi hosil mahsulotlari' },
          en: { name: 'Autumn Harvest', description: 'Autumn season harvest products' },
          ru: { name: 'Осенний урожай', description: 'Продукты осеннего урожая' }
        }
      },
      {
        id: 34,
        parent_id: 3,
        slug: 'winter',
        sort_order: 4,
        icon: '❄️',
        is_active: true,
        translations: {
          uz: { name: 'Qish mahsulotlari', description: 'Qish uchun saqlangan mahsulotlar' },
          en: { name: 'Winter Products', description: 'Stored products for winter' },
          ru: { name: 'Зимние продукты', description: 'Сохраненные продукты для зимы' }
        }
      }
    ]
  },
  {
    id: 4,
    parent_id: null,
    slug: 'greens',
    sort_order: 4,
    icon: '🌿',
    image: '/images/categories/greens.jpg',
    is_active: true,
    translations: {
      uz: {
        name: 'Ko\'katlar',
        description: 'Yangi va vitamin bilan boy ko\'katlar',
        meta_title: 'Ko\'katlar - Ismaloq, Jambil, Raybon va boshqalar',
        meta_description: 'Eng yangi ko\'katlar: ismaloq, jambil, raybon, na\'matak, ukrop va boshqa vitamin boy ko\'katlar'
      },
      en: {
        name: 'Greens',
        description: 'Fresh and vitamin rich greens',
        meta_title: 'Greens - Spinach, Dill, Parsley and others',
        meta_description: 'Fresh greens: spinach, dill, parsley, mint, cilantro and other vitamin rich greens'
      },
      ru: {
        name: 'Зелень',
        description: 'Свежая и богатая витаминами зелень',
        meta_title: 'Зелень - Шпинат, Укроп, Петрушка и другие',
        meta_description: 'Свежая зелень: шпинат, укроп, петрушка, мята, кинза и другая богатая витаминами зелень'
      }
    },
    children: [
      {
        id: 41,
        parent_id: 4,
        slug: 'spinach',
        sort_order: 1,
        icon: '🥬',
        is_active: true,
        translations: {
          uz: { name: 'Ismaloq', description: 'Temir ga boy ismaloq barglari' },
          en: { name: 'Spinach', description: 'Iron rich spinach leaves' },
          ru: { name: 'Шпинат', description: 'Богатые железом листья шпината' }
        }
      },
      {
        id: 42,
        parent_id: 4,
        slug: 'dill',
        sort_order: 2,
        icon: '🌱',
        is_active: true,
        translations: {
          uz: { name: 'Jambil', description: 'Xushbo\'y jambil ko\'kati' },
          en: { name: 'Dill', description: 'Fragrant dill greens' },
          ru: { name: 'Укроп', description: 'Ароматная зелень укропа' }
        }
      },
      {
        id: 43,
        parent_id: 4,
        slug: 'parsley',
        sort_order: 3,
        icon: '🌿',
        is_active: true,
        translations: {
          uz: { name: 'Raybon', description: 'Mazali raybon barglari' },
          en: { name: 'Parsley', description: 'Tasty parsley leaves' },
          ru: { name: 'Петрушка', description: 'Вкусные листья петрушки' }
        }
      },
      {
        id: 44,
        parent_id: 4,
        slug: 'mint',
        sort_order: 4,
        icon: '🌿',
        is_active: true,
        translations: {
          uz: { name: 'Na\'matak', description: 'Sovuq na\'matak barglari' },
          en: { name: 'Mint', description: 'Cool mint leaves' },
          ru: { name: 'Мята', description: 'Прохладные листья мяты' }
        }
      },
      {
        id: 45,
        parent_id: 4,
        slug: 'cilantro',
        sort_order: 5,
        icon: '🌿',
        is_active: true,
        translations: {
          uz: { name: 'Kashnich', description: 'Xushbo\'y kashnich ko\'kati' },
          en: { name: 'Cilantro', description: 'Fragrant cilantro greens' },
          ru: { name: 'Кинза', description: 'Ароматная зелень кинзы' }
        }
      },
      {
        id: 46,
        parent_id: 4,
        slug: 'lettuce',
        sort_order: 6,
        icon: '🥬',
        is_active: true,
        translations: {
          uz: { name: 'Salat', description: 'Yangi salat barglari' },
          en: { name: 'Lettuce', description: 'Fresh lettuce leaves' },
          ru: { name: 'Салат', description: 'Свежие листья салата' }
        }
      },
      {
        id: 47,
        parent_id: 4,
        slug: 'basil',
        sort_order: 7,
        icon: '🌿',
        is_active: true,
        translations: {
          uz: { name: 'Rayhon', description: 'Xushbo\'y rayhon barglari' },
          en: { name: 'Basil', description: 'Fragrant basil leaves' },
          ru: { name: 'Базилик', description: 'Ароматные листья базилика' }
        }
      }
    ]
  },
  {
    id: 5,
    parent_id: null,
    slug: 'field-crops',
    sort_order: 5,
    icon: '🌾',
    image: '/images/categories/field-crops.jpg',
    is_active: true,
    translations: {
      uz: {
        name: 'Poliz ekinlari',
        description: 'Don va boshqa poliz ekinlari',
        meta_title: 'Poliz ekinlari - Bug\'doy, Arpa, Guruch va boshqalar',
        meta_description: 'Yuqori sifatli poliz ekinlari: bug\'doy, arpa, guruch, makkajo\'xori, kungaboqar va boshqa don ekinlari'
      },
      en: {
        name: 'Field Crops',
        description: 'Grains and other field crops',
        meta_title: 'Field Crops - Wheat, Barley, Rice and others',
        meta_description: 'High quality field crops: wheat, barley, rice, corn, sunflower and other grain crops'
      },
      ru: {
        name: 'Полевые культуры',
        description: 'Зерновые и другие полевые культуры',
        meta_title: 'Полевые культуры - Пшеница, Ячмень, Рис и другие',
        meta_description: 'Высококачественные полевые культуры: пшеница, ячмень, рис, кукуруза, подсолнечник и другие зерновые культуры'
      }
    },
    children: [
      {
        id: 51,
        parent_id: 5,
        slug: 'wheat',
        sort_order: 1,
        icon: '🌾',
        is_active: true,
        translations: {
          uz: { name: 'Bug\'doy', description: 'Yuqori sifatli bug\'doy donlari' },
          en: { name: 'Wheat', description: 'High quality wheat grains' },
          ru: { name: 'Пшеница', description: 'Высококачественные зерна пшеницы' }
        }
      },
      {
        id: 52,
        parent_id: 5,
        slug: 'barley',
        sort_order: 2,
        icon: '🌾',
        is_active: true,
        translations: {
          uz: { name: 'Arpa', description: 'Sog\'lom arpa ekinlari' },
          en: { name: 'Barley', description: 'Healthy barley crops' },
          ru: { name: 'Ячмень', description: 'Здоровые культуры ячменя' }
        }
      },
      {
        id: 53,
        parent_id: 5,
        slug: 'rice',
        sort_order: 3,
        icon: '🍚',
        is_active: true,
        translations: {
          uz: { name: 'Guruch', description: 'Sifatli guruch donlari' },
          en: { name: 'Rice', description: 'Quality rice grains' },
          ru: { name: 'Рис', description: 'Качественные зерна риса' }
        }
      },
      {
        id: 54,
        parent_id: 5,
        slug: 'corn',
        sort_order: 4,
        icon: '🌽',
        is_active: true,
        translations: {
          uz: { name: 'Makkajo\'xori', description: 'Shirin makkajo\'xori' },
          en: { name: 'Corn', description: 'Sweet corn' },
          ru: { name: 'Кукуруза', description: 'Сладкая кукуруза' }
        }
      },
      {
        id: 55,
        parent_id: 5,
        slug: 'sunflower',
        sort_order: 5,
        icon: '🌻',
        is_active: true,
        translations: {
          uz: { name: 'Kungaboqar', description: 'Kungaboqar urug\'lari' },
          en: { name: 'Sunflower', description: 'Sunflower seeds' },
          ru: { name: 'Подсолнечник', description: 'Семена подсолнечника' }
        }
      },
      {
        id: 56,
        parent_id: 5,
        slug: 'chickpea',
        sort_order: 6,
        icon: '🫘',
        is_active: true,
        translations: {
          uz: { name: 'No\'xat', description: 'Protein boy no\'xat' },
          en: { name: 'Chickpea', description: 'Protein rich chickpea' },
          ru: { name: 'Нут', description: 'Богатый белком нут' }
        }
      },
      {
        id: 57,
        parent_id: 5,
        slug: 'mung-bean',
        sort_order: 7,
        icon: '🫘',
        is_active: true,
        translations: {
          uz: { name: 'Mosh', description: 'Foydali mosh ekinlari' },
          en: { name: 'Mung Bean', description: 'Beneficial mung bean crops' },
          ru: { name: 'Маш', description: 'Полезные культуры маша' }
        }
      },
      {
        id: 58,
        parent_id: 5,
        slug: 'bean',
        sort_order: 8,
        icon: '🫘',
        is_active: true,
        translations: {
          uz: { name: 'Loviya', description: 'Turli turdagi loviya' },
          en: { name: 'Bean', description: 'Various types of beans' },
          ru: { name: 'Фасоль', description: 'Различные виды фасоли' }
        }
      }
    ]
  }
];

// Helper functions for working with categories
export const getMainCategories = () => {
  return categories.filter(cat => cat.parent_id === null && cat.is_active);
};

export const getSubCategories = (parentId) => {
  const category = categories.find(cat => cat.id === parentId);
  return category?.children?.filter(child => child.is_active) || [];
};

export const getCategoryBySlug = (slug) => {
  // First check main categories
  const mainCategory = categories.find(cat => cat.slug === slug);
  if (mainCategory) return mainCategory;
  
  // Then check subcategories
  for (const category of categories) {
    if (category.children) {
      const subCategory = category.children.find(child => child.slug === slug);
      if (subCategory) return subCategory;
    }
  }
  return null;
};

export const getCategoryTranslation = (category, lang = 'uz') => {
  return category.translations[lang] || category.translations.uz;
};

export const getAllCategories = () => {
  const allCategories = [];
  categories.forEach(category => {
    if (category.is_active) {
      allCategories.push(category);
      if (category.children) {
        category.children.forEach(child => {
          if (child.is_active) {
            allCategories.push(child);
          }
        });
      }
    }
  });
  return allCategories;
};

// Featured categories for home page (main categories only)
export const featuredCategories = getMainCategories().slice(0, 8);