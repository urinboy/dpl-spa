<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        $categories = Category::where('status', 'active')
            ->whereNull('parent_id')
            ->with(['children' => function($query) {
                $query->where('status', 'active');
            }])
            ->withCount(['products' => function($query) {
                $query->where('status', 'active');
            }])
            ->get();

        return view('web.categories.index', compact('categories'));
    }

    /**
     * Display the specified category and its products
     */
    public function show($id, Request $request)
    {
        $category = Category::where('status', 'active')->findOrFail($id);

        $sort = $request->get('sort', 'newest');
        $priceMin = $request->get('price_min');
        $priceMax = $request->get('price_max');
        $perPage = $request->get('per_page', 20);

        // Kategoriya va uning bolalaridan mahsulotlar
        $categoryIds = [$id];
        $childCategories = Category::where('parent_id', $id)->where('status', 'active')->pluck('id')->toArray();
        $categoryIds = array_merge($categoryIds, $childCategories);

        $products = Product::where('status', 'active')
            ->whereIn('category_id', $categoryIds);

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

        // Breadcrumb uchun kategoriya yo'li
        $breadcrumbs = [];
        $currentCategory = $category;
        while ($currentCategory) {
            array_unshift($breadcrumbs, $currentCategory);
            $currentCategory = $currentCategory->parent;
        }

        // Bola kategoriyalar
        $childCategories = Category::where('parent_id', $id)
            ->where('status', 'active')
            ->withCount(['products' => function($query) {
                $query->where('status', 'active');
            }])
            ->get();

        // Narx oralig'i
        $priceRange = Product::where('status', 'active')
            ->whereIn('category_id', $categoryIds)
            ->selectRaw('MIN(price) as min, MAX(price) as max')
            ->first();

        return view('web.categories.show', compact(
            'category',
            'products',
            'breadcrumbs',
            'childCategories',
            'sort',
            'priceMin',
            'priceMax',
            'priceRange'
        ));
    }

    /**
     * Get category tree as JSON (for AJAX)
     */
    public function tree()
    {
        $categories = Category::where('status', 'active')
            ->whereNull('parent_id')
            ->with(['children' => function($query) {
                $query->where('status', 'active')
                      ->withCount(['products' => function($q) {
                          $q->where('status', 'active');
                      }]);
            }])
            ->withCount(['products' => function($query) {
                $query->where('status', 'active');
            }])
            ->get();

        return response()->json($categories->map(function($category) {
            return [
                'id' => $category->id,
                'name' => $category->getName(),
                'slug' => $category->slug,
                'image' => $category->image ? asset('storage/' . $category->image) : null,
                'products_count' => $category->products_count,
                'children' => $category->children->map(function($child) {
                    return [
                        'id' => $child->id,
                        'name' => $child->getName(),
                        'slug' => $child->slug,
                        'products_count' => $child->products_count,
                    ];
                })
            ];
        }));
    }

    /**
     * Get popular categories
     */
    public function popular()
    {
        $categories = Category::where('status', 'active')
            ->withCount(['products' => function($query) {
                $query->where('status', 'active');
            }])
            ->orderBy('products_count', 'desc')
            ->limit(8)
            ->get();

        return response()->json($categories->map(function($category) {
            return [
                'id' => $category->id,
                'name' => $category->getName(),
                'slug' => $category->slug,
                'image' => $category->image ? asset('storage/' . $category->image) : null,
                'products_count' => $category->products_count,
            ];
        }));
    }

    /**
     * Search categories
     */
    public function search(Request $request)
    {
        $query = $request->get('q');

        if (!$query) {
            return response()->json([]);
        }

        $currentLocale = app()->getLocale();
        $categories = Category::where('status', 'active')
            ->where("name->{$currentLocale}", 'LIKE', "%{$query}%")
            ->withCount(['products' => function($q) {
                $q->where('status', 'active');
            }])
            ->limit(10)
            ->get();

        return response()->json($categories->map(function($category) {
            return [
                'id' => $category->id,
                'name' => $category->getName(),
                'slug' => $category->slug,
                'products_count' => $category->products_count,
            ];
        }));
    }
}
