<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\DocsController; // Disabled - controller doesn't exist
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\LanguageController;

// Web Controllers
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ProductController;
use App\Http\Controllers\Web\CategoryController;
use App\Http\Controllers\Web\AuthController as WebAuthController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\CartController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*
|--------------------------------------------------------------------------
| Customer-Facing Web Routes
|--------------------------------------------------------------------------
*/
Route::name('web.')->group(function () {
    // Main pages
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/search', [HomeController::class, 'search'])->name('search');
    Route::get('/about', [HomeController::class, 'about'])->name('about');
    Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
    Route::get('/terms', [HomeController::class, 'terms'])->name('terms');
    Route::get('/privacy', [HomeController::class, 'privacy'])->name('privacy');

    // Categories
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::get('/{id}', [CategoryController::class, 'show'])->name('show');
        Route::get('/api/tree', [CategoryController::class, 'tree'])->name('tree');
        Route::get('/api/popular', [CategoryController::class, 'popular'])->name('popular');
        Route::get('/api/search', [CategoryController::class, 'search'])->name('search');
    });

    // Products
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/{id}', [ProductController::class, 'show'])->name('show');
        Route::get('/{id}/quick-view', [ProductController::class, 'quickView'])->name('quick-view');
        Route::get('/{id}/variants', [ProductController::class, 'getVariants'])->name('variants');
        Route::post('/{id}/favorites', [ProductController::class, 'addToFavorites'])->name('favorites.toggle');
    });

    // Authentication
    Route::prefix('auth')->name('auth.')->group(function () {
        // Guest routes
        Route::middleware('guest')->group(function () {
            Route::get('/login', [WebAuthController::class, 'showLogin'])->name('login.form');
            Route::post('/login', [WebAuthController::class, 'login'])->name('login');
            Route::get('/register', [WebAuthController::class, 'showRegister'])->name('register.form');
            Route::post('/register', [WebAuthController::class, 'register'])->name('register');
            Route::get('/forgot-password', [WebAuthController::class, 'showForgotPassword'])->name('forgot-password.form');
            Route::post('/forgot-password', [WebAuthController::class, 'forgotPassword'])->name('forgot-password');
        });

        // Auth routes
        Route::post('/logout', [WebAuthController::class, 'logout'])->name('logout');
        Route::get('/check', [WebAuthController::class, 'checkAuth'])->name('check');
    });

    // Simplified auth routes
    Route::get('/login', [WebAuthController::class, 'showLogin'])->name('login');
    Route::get('/register', [WebAuthController::class, 'showRegister'])->name('register');
    Route::post('/logout', [WebAuthController::class, 'logout'])->name('logout');

    // Profile (Auth required)
    Route::middleware('auth')->prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');
        Route::get('/edit', [ProfileController::class, 'edit'])->name('edit');
        Route::post('/update', [ProfileController::class, 'update'])->name('update');
        Route::post('/change-password', [ProfileController::class, 'changePassword'])->name('change-password');
        Route::get('/orders', [ProfileController::class, 'orders'])->name('orders');
        Route::get('/favorites', [ProfileController::class, 'favorites'])->name('favorites');
        Route::get('/addresses', [ProfileController::class, 'addresses'])->name('addresses');
        Route::get('/api/data', [ProfileController::class, 'getUserData'])->name('data');
    });

    // Cart
    Route::prefix('cart')->name('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/add', [CartController::class, 'add'])->name('add');
        Route::post('/update', [CartController::class, 'update'])->name('update');
        Route::post('/remove', [CartController::class, 'remove'])->name('remove');
        Route::post('/clear', [CartController::class, 'clear'])->name('clear');
        Route::get('/count', [CartController::class, 'count'])->name('count');
        Route::get('/contents', [CartController::class, 'contents'])->name('contents');
    });
});

/*
|--------------------------------------------------------------------------
| Admin Redirect Routes
|--------------------------------------------------------------------------
*/
Route::get('/home', function () {
    return redirect()->route('web.home');
})->name('home.page');

// Global logout route
Route::post('/logout', [\App\Http\Controllers\Admin\AuthController::class, 'logout'])->name('global.logout')->middleware('auth');

/*
|--------------------------------------------------------------------------
| Test Routes (Development Only)
|--------------------------------------------------------------------------
*/
Route::get('/test-auth', function () {
    return view('test-auth');
});

/*
|--------------------------------------------------------------------------
| Language Routes
|--------------------------------------------------------------------------
*/
Route::prefix('language')->name('language.')->group(function () {
    Route::get('/switch/{locale}', [LanguageController::class, 'switchLanguage'])->name('switch');
    Route::get('/current', [LanguageController::class, 'getCurrentLanguage'])->name('current');
    Route::get('/translations', [LanguageController::class, 'getTranslations'])->name('translations');
});

Route::get('/about', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| Admin Authentication Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    // Login routes (accessible for guests only)
    Route::middleware(['guest', 'redirect.if.admin'])->group(function () {
        Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    });

    // Logout route (accessible for authenticated users only)
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');
});

/*
|--------------------------------------------------------------------------
| Authentication Routes - DISABLED (Controllers don't exist)
|--------------------------------------------------------------------------
*/
// require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Admin Panel Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/api/stats', [DashboardController::class, 'apiStats'])->name('api.stats');

    // User Management
    Route::resource('users', UserController::class);
    Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
    Route::patch('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
    Route::post('users/bulk-action', [UserController::class, 'bulkAction'])->name('users.bulk');

    // Category Management
    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);
    Route::post('categories/{category}/upload-image', [\App\Http\Controllers\Admin\CategoryController::class, 'uploadImage'])->name('categories.upload-image');
    Route::post('categories/{category}/toggle-status', [\App\Http\Controllers\Admin\CategoryController::class, 'toggleStatus'])->name('categories.toggle-status');

    // Product Management
    Route::resource('products', \App\Http\Controllers\Admin\ProductController::class);
    Route::post('products/{product}/upload-images', [\App\Http\Controllers\Admin\ProductController::class, 'uploadImages'])->name('products.upload-images');
    Route::get('products/low-stock', [\App\Http\Controllers\Admin\ProductController::class, 'lowStock'])->name('products.low-stock');

    // Order Management
    Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class)->only(['index', 'show', 'edit', 'update']);
    Route::patch('orders/{order}/status', [\App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::get('orders/export', [\App\Http\Controllers\Admin\OrderController::class, 'export'])->name('orders.export');

    // Profile Management
    Route::get('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');

    // Settings (Admin only)
    Route::get('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::put('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
    Route::post('settings/clear-cache', [\App\Http\Controllers\Admin\SettingsController::class, 'clearCache'])->name('settings.clear-cache');
    Route::post('settings/optimize', [\App\Http\Controllers\Admin\SettingsController::class, 'optimize'])->name('settings.optimize');
    Route::get('settings/backup', [\App\Http\Controllers\Admin\SettingsController::class, 'backup'])->name('settings.backup');

    // Languages Management
    Route::resource('languages', \App\Http\Controllers\Admin\LanguagesController::class);
    Route::patch('languages/{language}/toggle-status', [\App\Http\Controllers\Admin\LanguagesController::class, 'toggleStatus'])->name('languages.toggle-status');
    Route::patch('languages/{language}/set-default', [\App\Http\Controllers\Admin\LanguagesController::class, 'setDefault'])->name('languages.set-default');
    Route::post('languages/bulk-action', [\App\Http\Controllers\Admin\LanguagesController::class, 'bulkAction'])->name('languages.bulk-action');

    // Language switching
    Route::get('/language/{locale}', [LanguageController::class, 'switchLanguage'])->name('language.switch');
});

/*
|--------------------------------------------------------------------------
| API Documentation Routes - DISABLED (Controller doesn't exist)
|--------------------------------------------------------------------------
*/
/*
Route::prefix('docs')->name('docs.')->group(function () {
    Route::get('/', [DocsController::class, 'index'])->name('index');
    Route::get('/getting-started', [DocsController::class, 'gettingStarted'])->name('getting-started');
    Route::get('/authentication', [DocsController::class, 'authentication'])->name('authentication');
    Route::get('/endpoints/{section}', [DocsController::class, 'endpoints'])->name('endpoints');
    Route::get('/api-tester', [DocsController::class, 'apiTester'])->name('api-tester');
});
*/
