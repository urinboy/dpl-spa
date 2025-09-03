<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request)
    {
        $categoryId = $request->get('category');
        $sort = $request->get('sort', 'newest');
        $priceMin = $request->get('price_min');
        $priceMax = $request->get('price_max');
        $perPage = $request->get('per_page', 20);

        $products = Product::where('status', 'active');

        // Kategoriya filtri
        if ($categoryId) {
            $category = Category::find($categoryId);
            if ($category) {
                // Asosiy kategoriya va uning bolalari
                $categoryIds = [$categoryId];
                $childCategories = Category::where('parent_id', $categoryId)->pluck('id')->toArray();
                $categoryIds = array_merge($categoryIds, $childCategories);

                $products->whereIn('category_id', $categoryIds);
            }
        }

        // Narx filtri
        if ($priceMin) {
            $products->where('price', '>=', $priceMin);
        }
        if ($priceMax) {
            $products->where('price', '<=', $priceMax);
        }

        // Saralash
        switch ($sort) {
            case 'price_low':
                $products->orderBy('price', 'asc');
                break;
            case 'price_high':
                $products->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $products->orderBy('name->'.app()->getLocale(), 'asc');
                break;
            case 'name_desc':
                $products->orderBy('name->'.app()->getLocale(), 'desc');
                break;
            case 'popular':
                $products->orderBy('views', 'desc');
                break;
            case 'newest':
            default:
                $products->orderBy('created_at', 'desc');
                break;
        }

        $products = $products->paginate($perPage);

        // Kategoriyalar
        $categories = Category::where('status', 'active')
            ->whereNull('parent_id')
            ->with('children')
            ->get();

        // Narx oralig'i
        $priceRange = Product::where('status', 'active')->selectRaw('MIN(price) as min, MAX(price) as max')->first();

        return view('web.products.index', compact(
            'products',
            'categories',
            'categoryId',
            'sort',
            'priceMin',
            'priceMax',
            'priceRange'
        ));
    }

    /**
     * Display the specified product
     */
    public function show($id)
    {
        $product = Product::where('status', 'active')->findOrFail($id);

        // Ko'rishlar sonini oshirish
        $product->increment('views');

        // O'xshash mahsulotlar
        $relatedProducts = Product::where('status', 'active')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(8)
            ->get();

        // Kategoriya yo'li
        $breadcrumbs = [];
        $category = $product->category;
        while ($category) {
            array_unshift($breadcrumbs, $category);
            $category = $category->parent;
        }

        return view('web.products.show', compact('product', 'relatedProducts', 'breadcrumbs'));
    }

    /**
     * Add product to favorites (requires authentication)
     */
    public function addToFavorites(Request $request, $id)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Tizimga kirishingiz kerak'], 401);
        }

        $product = Product::findOrFail($id);
        $user = auth()->user();

        // Sevimlilar jadvalidagi bog'lanishni tekshirish
        $exists = $user->favoriteProducts()->where('product_id', $id)->exists();

        if ($exists) {
            $user->favoriteProducts()->detach($id);
            return response()->json(['message' => 'Sevimlilardan olib tashlandi', 'status' => 'removed']);
        } else {
            $user->favoriteProducts()->attach($id);
            return response()->json(['message' => 'Sevimlilarga qo\'shildi', 'status' => 'added']);
        }
    }

    /**
     * Get product quick view data
     */
    public function quickView($id)
    {
        $product = Product::where('status', 'active')->findOrFail($id);

        return response()->json([
            'id' => $product->id,
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->price,
            'sale_price' => $product->sale_price,
            'formatted_price' => number_format($product->price, 0, '.', ' ') . ' so\'m',
            'formatted_sale_price' => $product->sale_price ? number_format($product->sale_price, 0, '.', ' ') . ' so\'m' : null,
            'images' => $product->images ? array_map(function($image) {
                return asset('storage/' . $image);
            }, $product->images) : [asset('images/no-image.jpg')],
            'in_stock' => $product->quantity > 0,
            'quantity' => $product->quantity,
            'unit' => $product->getFormattedUnit(),
            'category' => $product->category ? $product->category->getName() : null,
        ]);
    }

    /**
     * Get product variants (for future use)
     */
    public function getVariants($id)
    {
        $product = Product::findOrFail($id);

        // Bu yerda product variantlari logikasi bo'ladi
        // Hozircha bo'sh array qaytaramiz
        return response()->json([
            'variants' => []
        ]);
    }
}
