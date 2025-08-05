<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    /**
     * Show cart page
     */
    public function index()
    {
        $cart = $this->getCart();
        $cartItems = $this->getCartItems($cart);
        $totals = $this->calculateTotals($cartItems);

        return view('web.cart.index', compact('cartItems', 'totals'));
    }

    /**
     * Add product to cart
     */
    public function add(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);

        $product = Product::where('status', 'active')->find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Mahsulot topilmadi'
            ], 404);
        }

        if ($product->quantity < $quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Yetarli miqdorda mahsulot mavjud emas'
            ], 400);
        }

        $cart = $this->getCart();

        // Agar mahsulot savatchada bo'lsa, miqdorni qo'shamiz
        if (isset($cart[$productId])) {
            $newQuantity = $cart[$productId]['quantity'] + $quantity;

            if ($product->quantity < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Yetarli miqdorda mahsulot mavjud emas'
                ], 400);
            }

            $cart[$productId]['quantity'] = $newQuantity;
        } else {
            $cart[$productId] = [
                'product_id' => $productId,
                'quantity' => $quantity,
                'added_at' => now()->toISOString()
            ];
        }

        $this->saveCart($cart);

        $cartCount = $this->getCartCount();

        return response()->json([
            'success' => true,
            'message' => 'Mahsulot savatchaga qo\'shildi',
            'cart_count' => $cartCount
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);

        $product = Product::where('status', 'active')->find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Mahsulot topilmadi'
            ], 404);
        }

        if ($quantity <= 0) {
            return $this->remove($request);
        }

        if ($product->quantity < $quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Yetarli miqdorda mahsulot mavjud emas'
            ], 400);
        }

        $cart = $this->getCart();

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] = $quantity;
            $this->saveCart($cart);

            $cartItems = $this->getCartItems($cart);
            $totals = $this->calculateTotals($cartItems);

            return response()->json([
                'success' => true,
                'message' => 'Savatcha yangilandi',
                'cart_count' => $this->getCartCount(),
                'totals' => $totals
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Mahsulot savatchada topilmadi'
        ], 404);
    }

    /**
     * Remove product from cart
     */
    public function remove(Request $request)
    {
        $productId = $request->input('product_id');
        $cart = $this->getCart();

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            $this->saveCart($cart);

            return response()->json([
                'success' => true,
                'message' => 'Mahsulot savatchadan olib tashlandi',
                'cart_count' => $this->getCartCount()
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Mahsulot savatchada topilmadi'
        ], 404);
    }

    /**
     * Clear entire cart
     */
    public function clear()
    {
        Session::forget('cart');

        return response()->json([
            'success' => true,
            'message' => 'Savatcha tozalandi',
            'cart_count' => 0
        ]);
    }

    /**
     * Get cart count
     */
    public function count()
    {
        $count = $this->getCartCount();

        return response()->json([
            'cart_count' => $count
        ]);
    }

    /**
     * Get cart contents for API
     */
    public function contents()
    {
        $cart = $this->getCart();
        $cartItems = $this->getCartItems($cart);
        $totals = $this->calculateTotals($cartItems);

        return response()->json([
            'cart_items' => $cartItems->map(function($item) {
                return [
                    'product_id' => $item['product']->id,
                    'name' => $item['product']->getName(),
                    'price' => $item['product']->price,
                    'sale_price' => $item['product']->sale_price,
                    'quantity' => $item['quantity'],
                    'image' => $item['product']->images ? asset('storage/' . $item['product']->images[0]) : asset('images/no-image.jpg'),
                    'total' => $item['total']
                ];
            }),
            'totals' => $totals
        ]);
    }

    /**
     * Get cart from session
     */
    private function getCart()
    {
        return Session::get('cart', []);
    }

    /**
     * Save cart to session
     */
    private function saveCart($cart)
    {
        Session::put('cart', $cart);
    }

    /**
     * Get cart items with product details
     */
    private function getCartItems($cart)
    {
        if (empty($cart)) {
            return collect();
        }

        $productIds = array_keys($cart);
        $products = Product::whereIn('id', $productIds)->where('status', 'active')->get()->keyBy('id');

        return collect($cart)->map(function($item, $productId) use ($products) {
            if (!isset($products[$productId])) {
                return null;
            }

            $product = $products[$productId];
            $price = $product->sale_price ?: $product->price;
            $total = $price * $item['quantity'];

            return [
                'product' => $product,
                'quantity' => $item['quantity'],
                'price' => $price,
                'total' => $total,
                'added_at' => $item['added_at'] ?? null
            ];
        })->filter(); // Remove null items
    }

    /**
     * Calculate cart totals
     */
    private function calculateTotals($cartItems)
    {
        $subtotal = $cartItems->sum('total');
        $shipping = 0; // Bu yerda shipping logikasi bo'ladi
        $tax = 0; // Bu yerda tax logikasi bo'ladi
        $total = $subtotal + $shipping + $tax;

        return [
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => $total,
            'formatted_subtotal' => number_format($subtotal, 0, '.', ' ') . ' so\'m',
            'formatted_shipping' => number_format($shipping, 0, '.', ' ') . ' so\'m',
            'formatted_tax' => number_format($tax, 0, '.', ' ') . ' so\'m',
            'formatted_total' => number_format($total, 0, '.', ' ') . ' so\'m',
        ];
    }

    /**
     * Get total cart items count
     */
    private function getCartCount()
    {
        $cart = $this->getCart();
        return array_sum(array_column($cart, 'quantity'));
    }
}
