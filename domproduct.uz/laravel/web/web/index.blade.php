@extends('web.layouts.app')

@section('title', 'DOM PRODUCT - Onlayn Market')
@section('description', 'DOM PRODUCT - eng yaxshi mahsulotlar, tez yetkazib berish, arzon narxlar. Onlayn xarid qiling!')
@section('keywords', 'dom product, onlayn market, mahsulotlar, sotib olish, yetkazib berish')

@section('content')
<!-- Hero Section -->
<section class="gradient-bg text-white py-16 md:py-24">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 slide-up">
                DOM PRODUCT
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-green-100 slide-up" style="animation-delay: 0.2s;">
                Eng yaxshi mahsulotlar, arzon narxlar, tez yetkazib berish
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center slide-up" style="animation-delay: 0.4s;">
                <a href="{{ route('web.products') }}" class="btn btn-secondary bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg">
                    Mahsulotlarni ko'rish
                </a>
                <a href="{{ route('web.categories') }}" class="btn btn-outline border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg">
                    Kategoriyalar
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Quick Categories -->
@if($categories->count() > 0)
<section class="py-16 -mt-8">
    <div class="container mx-auto px-4">
        <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">Kategoriyalar</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                @foreach($categories as $category)
                <a href="{{ route('web.categories.show', $category->id) }}"
                   class="group flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                    <div class="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                        @if($category->image)
                        <img src="{{ asset('storage/' . $category->image) }}"
                             alt="{{ $category->getName() }}"
                             class="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg">
                        @else
                        <svg class="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        @endif
                    </div>
                    <h3 class="text-sm md:text-base font-semibold text-center text-gray-800 group-hover:text-primary transition-colors">
                        {{ $category->getName() }}
                    </h3>
                </a>
                @endforeach
            </div>
            <div class="text-center mt-8">
                <a href="{{ route('web.categories') }}" class="btn btn-outline">
                    Barcha kategoriyalar
                </a>
            </div>
        </div>
    </div>
</section>
@endif

<!-- Best Sellers -->
@if($bestSellers->count() > 0)
<section class="py-16">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl md:text-3xl font-bold">Eng ko'p sotilgan</h2>
            <a href="{{ route('web.products', ['sort' => 'popular']) }}" class="text-primary hover:text-primary-dark font-semibold">
                Barchasini ko'rish →
            </a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @foreach($bestSellers as $product)
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                <div class="relative">
                    <a href="{{ route('web.products.show', $product->id) }}">
                        @if($product->images && count($product->images) > 0)
                        <img src="{{ asset('storage/' . $product->images[0]) }}"
                             alt="{{ $product->getName() }}"
                             class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
                        @else
                        <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        @endif
                    </a>
                    @if($product->sale_price)
                    <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -{{ round((($product->price - $product->sale_price) / $product->price) * 100) }}%
                    </div>
                    @endif
                    <button onclick="addToFavorites({{ $product->id }})"
                            class="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold mb-2 line-clamp-2">
                        <a href="{{ route('web.products.show', $product->id) }}" class="hover:text-primary transition-colors">
                            {{ $product->getName() }}
                        </a>
                    </h3>
                    <div class="flex items-center justify-between">
                        <div>
                            @if($product->sale_price)
                            <span class="text-lg font-bold text-primary">{{ number_format($product->sale_price, 0, '.', ' ') }} so'm</span>
                            <span class="text-sm text-gray-500 line-through ml-2">{{ number_format($product->price, 0, '.', ' ') }} so'm</span>
                            @else
                            <span class="text-lg font-bold text-primary">{{ number_format($product->price, 0, '.', ' ') }} so'm</span>
                            @endif
                        </div>
                        <button onclick="addToCart({{ $product->id }})"
                                class="btn btn-primary px-3 py-2 text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13v6a2 2 0 002 2h10a2 2 0 002-2v-6M7 13H5.4"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

<!-- New Products -->
@if($newProducts->count() > 0)
<section class="py-16 bg-gray-100">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl md:text-3xl font-bold">Yangi mahsulotlar</h2>
            <a href="{{ route('web.products', ['sort' => 'newest']) }}" class="text-primary hover:text-primary-dark font-semibold">
                Barchasini ko'rish →
            </a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @foreach($newProducts as $product)
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                <div class="relative">
                    <a href="{{ route('web.products.show', $product->id) }}">
                        @if($product->images && count($product->images) > 0)
                        <img src="{{ asset('storage/' . $product->images[0]) }}"
                             alt="{{ $product->getName() }}"
                             class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
                        @else
                        <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        @endif
                    </a>
                    <div class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Yangi
                    </div>
                    <button onclick="addToFavorites({{ $product->id }})"
                            class="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold mb-2 line-clamp-2">
                        <a href="{{ route('web.products.show', $product->id) }}" class="hover:text-primary transition-colors">
                            {{ $product->getName() }}
                        </a>
                    </h3>
                    <div class="flex items-center justify-between">
                        <div>
                            @if($product->sale_price)
                            <span class="text-lg font-bold text-primary">{{ number_format($product->sale_price, 0, '.', ' ') }} so'm</span>
                            <span class="text-sm text-gray-500 line-through ml-2">{{ number_format($product->price, 0, '.', ' ') }} so'm</span>
                            @else
                            <span class="text-lg font-bold text-primary">{{ number_format($product->price, 0, '.', ' ') }} so'm</span>
                            @endif
                        </div>
                        <button onclick="addToCart({{ $product->id }})"
                                class="btn btn-primary px-3 py-2 text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13v6a2 2 0 002 2h10a2 2 0 002-2v-6M7 13H5.4"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

<!-- Sale Products -->
@if($saleProducts->count() > 0)
<section class="py-16">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl md:text-3xl font-bold">Chegirmadagi mahsulotlar</h2>
            <a href="{{ route('web.products') }}" class="text-primary hover:text-primary-dark font-semibold">
                Barchasini ko'rish →
            </a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @foreach($saleProducts as $product)
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                <div class="relative">
                    <a href="{{ route('web.products.show', $product->id) }}">
                        @if($product->images && count($product->images) > 0)
                        <img src="{{ asset('storage/' . $product->images[0]) }}"
                             alt="{{ $product->getName() }}"
                             class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
                        @else
                        <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        @endif
                    </a>
                    <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -{{ round((($product->price - $product->sale_price) / $product->price) * 100) }}%
                    </div>
                    <button onclick="addToFavorites({{ $product->id }})"
                            class="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold mb-2 line-clamp-2">
                        <a href="{{ route('web.products.show', $product->id) }}" class="hover:text-primary transition-colors">
                            {{ $product->getName() }}
                        </a>
                    </h3>
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-lg font-bold text-primary">{{ number_format($product->sale_price, 0, '.', ' ') }} so'm</span>
                            <span class="text-sm text-gray-500 line-through ml-2">{{ number_format($product->price, 0, '.', ' ') }} so'm</span>
                        </div>
                        <button onclick="addToCart({{ $product->id }})"
                                class="btn btn-primary px-3 py-2 text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13v6a2 2 0 002 2h10a2 2 0 002-2v-6M7 13H5.4"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

<!-- Features -->
<section class="py-16 bg-secondary text-white">
    <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
                <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Tez yetkazib berish</h3>
                <p class="text-gray-300">24 soat ichida eshigingizgacha yetkazib beramiz</p>
            </div>
            <div class="text-center">
                <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Sifat kafolati</h3>
                <p class="text-gray-300">Faqat yuqori sifatli mahsulotlar</p>
            </div>
            <div class="text-center">
                <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Xavfsiz to'lov</h3>
                <p class="text-gray-300">Barcha to'lov turlari qo'llab-quvvatlanadi</p>
            </div>
        </div>
    </div>
</section>
@endsection

@push('scripts')
<script>
    // Add to cart function
    function addToCart(productId, quantity = 1) {
        showLoading();

        fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': window.csrfToken
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity
            })
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.success) {
                updateCartBadge();
                // Show success message
                showNotification(data.message, 'success');
            } else {
                showNotification(data.message, 'error');
            }
        })
        .catch(error => {
            hideLoading();
            handleAjaxError(error);
        });
    }

    // Add to favorites function
    function addToFavorites(productId) {
        if (!window.authUser) {
            window.location.href = '/login';
            return;
        }

        fetch(`/products/${productId}/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': window.csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success || data.status) {
                showNotification(data.message, 'success');
            } else {
                showNotification(data.message, 'error');
            }
        })
        .catch(error => {
            handleAjaxError(error);
        });
    }

    // Show notification function
    function showNotification(message, type = 'info') {
        // Simple alert for now, can be enhanced with toast notifications
        alert(message);
    }
</script>
@endpush
