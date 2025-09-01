<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Language;
use App\Models\Translation;

class TranslationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Tillarni olish
        $uzbek = Language::where('code', 'uz')->first();
        $english = Language::where('code', 'en')->first();
        $russian = Language::where('code', 'ru')->first();

        if (!$uzbek || !$english || !$russian) {
            $this->command->error('Languages not found! Run LanguageSeeder first.');
            return;
        }

        // Asosiy tarjimalar
        $translations = [
            // General
            'welcome' => [
                'uz' => 'Xush kelibsiz',
                'en' => 'Welcome',
                'ru' => 'Добро пожаловать'
            ],
            'hello' => [
                'uz' => 'Salom',
                'en' => 'Hello',
                'ru' => 'Привет'
            ],
            'goodbye' => [
                'uz' => 'Xayr',
                'en' => 'Goodbye',
                'ru' => 'До свидания'
            ],
            'yes' => [
                'uz' => 'Ha',
                'en' => 'Yes',
                'ru' => 'Да'
            ],
            'no' => [
                'uz' => 'Yo\'q',
                'en' => 'No',
                'ru' => 'Нет'
            ],
            'save' => [
                'uz' => 'Saqlash',
                'en' => 'Save',
                'ru' => 'Сохранить'
            ],
            'cancel' => [
                'uz' => 'Bekor qilish',
                'en' => 'Cancel',
                'ru' => 'Отмена'
            ],
            'delete' => [
                'uz' => 'O\'chirish',
                'en' => 'Delete',
                'ru' => 'Удалить'
            ],
            'edit' => [
                'uz' => 'Tahrirlash',
                'en' => 'Edit',
                'ru' => 'Редактировать'
            ],
            'add' => [
                'uz' => 'Qo\'shish',
                'en' => 'Add',
                'ru' => 'Добавить'
            ],

            // Menu
            'menu.home' => [
                'uz' => 'Bosh sahifa',
                'en' => 'Home',
                'ru' => 'Главная'
            ],
            'menu.categories' => [
                'uz' => 'Kategoriyalar',
                'en' => 'Categories',
                'ru' => 'Категории'
            ],
            'menu.products' => [
                'uz' => 'Mahsulotlar',
                'en' => 'Products',
                'ru' => 'Продукты'
            ],
            'menu.cart' => [
                'uz' => 'Savatcha',
                'en' => 'Cart',
                'ru' => 'Корзина'
            ],
            'menu.orders' => [
                'uz' => 'Buyurtmalar',
                'en' => 'Orders',
                'ru' => 'Заказы'
            ],
            'menu.profile' => [
                'uz' => 'Profil',
                'en' => 'Profile',
                'ru' => 'Профиль'
            ],

            // Auth
            'auth.login' => [
                'uz' => 'Kirish',
                'en' => 'Login',
                'ru' => 'Войти'
            ],
            'auth.register' => [
                'uz' => 'Ro\'yxatdan o\'tish',
                'en' => 'Register',
                'ru' => 'Регистрация'
            ],
            'auth.logout' => [
                'uz' => 'Chiqish',
                'en' => 'Logout',
                'ru' => 'Выйти'
            ],
            'auth.email' => [
                'uz' => 'Email',
                'en' => 'Email',
                'ru' => 'Email'
            ],
            'auth.password' => [
                'uz' => 'Parol',
                'en' => 'Password',
                'ru' => 'Пароль'
            ],
            'auth.first_name' => [
                'uz' => 'Ism',
                'en' => 'First Name',
                'ru' => 'Имя'
            ],
            'auth.last_name' => [
                'uz' => 'Familiya',
                'en' => 'Last Name',
                'ru' => 'Фамилия'
            ],
            'auth.phone' => [
                'uz' => 'Telefon',
                'en' => 'Phone',
                'ru' => 'Телефон'
            ],

            // Product related
            'product.breakfast' => [
                'uz' => 'Nonushta',
                'en' => 'Breakfast',
                'ru' => 'Завтрак'
            ],
            'product.lunch' => [
                'uz' => 'Tushlik',
                'en' => 'Lunch',
                'ru' => 'Обед'
            ],
            'product.dinner' => [
                'uz' => 'Kechki ovqat',
                'en' => 'Dinner',
                'ru' => 'Ужин'
            ],
            'product.pizza' => [
                'uz' => 'Pitsa',
                'en' => 'Pizza',
                'ru' => 'Пицца'
            ],
            'product.burger' => [
                'uz' => 'Burger',
                'en' => 'Burger',
                'ru' => 'Бургер'
            ],
            'product.drinks' => [
                'uz' => 'Ichimliklar',
                'en' => 'Drinks',
                'ru' => 'Напитки'
            ],
            'product.desserts' => [
                'uz' => 'Shirinliklar',
                'en' => 'Desserts',
                'ru' => 'Десерты'
            ],

            // Order
            'order.total' => [
                'uz' => 'Jami',
                'en' => 'Total',
                'ru' => 'Итого'
            ],
            'order.delivery' => [
                'uz' => 'Yetkazib berish',
                'en' => 'Delivery',
                'ru' => 'Доставка'
            ],
            'order.pickup' => [
                'uz' => 'Olib ketish',
                'en' => 'Pickup',
                'ru' => 'Самовывоз'
            ],
            'order.status' => [
                'uz' => 'Holati',
                'en' => 'Status',
                'ru' => 'Статус'
            ],
            'order.pending' => [
                'uz' => 'Kutilmoqda',
                'en' => 'Pending',
                'ru' => 'Ожидание'
            ],
            'order.confirmed' => [
                'uz' => 'Tasdiqlangan',
                'en' => 'Confirmed',
                'ru' => 'Подтверждён'
            ],
            'order.preparing' => [
                'uz' => 'Tayyorlanmoqda',
                'en' => 'Preparing',
                'ru' => 'Готовится'
            ],
            'order.delivered' => [
                'uz' => 'Yetkazildi',
                'en' => 'Delivered',
                'ru' => 'Доставлен'
            ],

            // Address
            'address.city' => [
                'uz' => 'Shahar',
                'en' => 'City',
                'ru' => 'Город'
            ],
            'address.district' => [
                'uz' => 'Tuman',
                'en' => 'District',
                'ru' => 'Район'
            ],
            'address.street' => [
                'uz' => 'Ko\'cha',
                'en' => 'Street',
                'ru' => 'Улица'
            ],
            'address.house' => [
                'uz' => 'Uy',
                'en' => 'House',
                'ru' => 'Дом'
            ]
        ];

        foreach ($translations as $key => $values) {
            // Guruhni aniqlash
            $group = 'general';
            if (strpos($key, '.') !== false) {
                $group = explode('.', $key)[0];
            }

            // Har bir til uchun tarjima yaratish
            foreach ($values as $langCode => $value) {
                $language = null;
                switch ($langCode) {
                    case 'uz':
                        $language = $uzbek;
                        break;
                    case 'en':
                        $language = $english;
                        break;
                    case 'ru':
                        $language = $russian;
                        break;
                }

                if ($language) {
                    Translation::updateOrCreate(
                        [
                            'key' => $key,
                            'language_id' => $language->id
                        ],
                        [
                            'value' => $value,
                            'group' => $group
                        ]
                    );
                }
            }
        }

        $this->command->info('Translations seeded successfully!');
    }
}
