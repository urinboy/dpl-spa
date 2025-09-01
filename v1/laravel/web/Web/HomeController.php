<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Display the homepage
     */
    public function index()
    {
        // Eng ko'p sotilgan mahsulotlar
        $bestSellers = Product::where('status', 'active')
            ->orderBy('views', 'desc')
            ->limit(8)
            ->get();

        // Yangi mahsulotlar
        $newProducts = Product::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        // Aksiya mahsulotlari (chegirmada)
        $saleProducts = Product::where('status', 'active')
            ->whereNotNull('sale_price')
            ->where('sale_price', '>', 0)
            ->limit(8)
            ->get();

        // Asosiy kategoriyalar
        $categories = Category::where('status', 'active')
            ->whereNull('parent_id')
            ->limit(8)
            ->get();

        return view('web.index', compact(
            'bestSellers',
            'newProducts',
            'saleProducts',
            'categories'
        ));
    }

    /**
     * Search products
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        $categoryId = $request->get('category');
        $sort = $request->get('sort', 'relevance');
        $perPage = $request->get('per_page', 20);

        $products = Product::where('status', 'active');

        // Qidiruv bo'yicha filter
        if ($query) {
            $currentLocale = app()->getLocale();
            $products->where(function($q) use ($query, $currentLocale) {
                $q->where("name->{$currentLocale}", 'LIKE', "%{$query}%")
                  ->orWhere("description->{$currentLocale}", 'LIKE', "%{$query}%")
                  ->orWhere('sku', 'LIKE', "%{$query}%");
            });
        }

        // Kategoriya bo'yicha filter
        if ($categoryId) {
            $products->where('category_id', $categoryId);
        }

        // Saralash
        switch ($sort) {
            case 'price_low':
                $products->orderBy('price', 'asc');
                break;
            case 'price_high':
                $products->orderBy('price', 'desc');
                break;
            case 'newest':
                $products->orderBy('created_at', 'desc');
                break;
            case 'popular':
                $products->orderBy('views', 'desc');
                break;
            default:
                $products->orderBy('created_at', 'desc');
        }

        $products = $products->paginate($perPage);
        $categories = Category::where('status', 'active')->get();

        return view('web.search', compact('products', 'categories', 'query', 'categoryId', 'sort'));
    }

    /**
     * About page
     */
    public function about()
    {
        return view('web.about');
    }

    /**
     * Contact page
     */
    public function contact()
    {
        return view('web.contact');
    }

    /**
     * Terms page
     */
    public function terms()
    {
        return view('web.terms');
    }

    /**
     * Privacy page
     */
    public function privacy()
    {
        return view('web.privacy');
    }
}
