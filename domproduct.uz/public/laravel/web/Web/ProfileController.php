<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display user profile
     */
    public function index()
    {
        $user = auth()->user();

        // User statistikasi
        $stats = [
            'orders_count' => 0, // Bu yerda order model bo'lsa hisoblanadi
            'favorites_count' => $user->favoriteProducts ? $user->favoriteProducts->count() : 0,
            'total_spent' => 0, // Bu yerda orderlar bo'yicha hisoblanadi
            'loyalty_points' => 0, // Bu yerda loyalty system bo'lsa
        ];

        return view('web.profile.index', compact('user', 'stats'));
    }

    /**
     * Show edit profile form
     */
    public function edit()
    {
        $user = auth()->user();
        return view('web.profile.edit', compact('user'));
    }

    /**
     * Update user profile
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'name.required' => 'Ism familiya kiritish majburiy',
            'email.required' => 'Email manzil kiritish majburiy',
            'email.email' => 'To\'g\'ri email manzil kiriting',
            'email.unique' => 'Bu email manzil allaqachon foydalanilmoqda',
            'avatar.image' => 'Avatar rasm bo\'lishi kerak',
            'avatar.mimes' => 'Avatar jpeg, png, jpg yoki gif formatida bo\'lishi kerak',
            'avatar.max' => 'Avatar hajmi 2MB dan oshmasligi kerak',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Ma\'lumotlarni to\'g\'ri kiriting',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->name = $request->name;
            $user->email = $request->email;
            $user->phone = $request->phone;

            // Avatar yuklash
            if ($request->hasFile('avatar')) {
                // Eski avatarni o'chirish
                if ($user->avatar) {
                    Storage::disk('public')->delete($user->avatar);
                }

                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $user->avatar = $avatarPath;
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profil muvaffaqiyatli yangilandi',
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Profilni yangilashda xatolik yuz berdi',
            ], 500);
        }
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'current_password.required' => 'Joriy parol kiritish majburiy',
            'password.required' => 'Yangi parol kiritish majburiy',
            'password.min' => 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak',
            'password.confirmed' => 'Parol tasdig\'i mos kelmaydi',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Ma\'lumotlarni to\'g\'ri kiriting',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();

        // Joriy parolni tekshirish
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Joriy parol noto\'g\'ri',
                'errors' => [
                    'current_password' => ['Joriy parol noto\'g\'ri']
                ]
            ], 422);
        }

        try {
            $user->password = Hash::make($request->password);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Parol muvaffaqiyatli yangilandi'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Parolni yangilashda xatolik yuz berdi',
            ], 500);
        }
    }

    /**
     * Show user orders
     */
    public function orders()
    {
        $user = auth()->user();

        // Bu yerda order model bo'lsa orders ni olish kerak
        $orders = collect(); // Hozircha bo'sh collection

        return view('web.profile.orders', compact('orders'));
    }

    /**
     * Show user favorites
     */
    public function favorites()
    {
        $user = auth()->user();
        $favorites = $user->favoriteProducts()->where('status', 'active')->paginate(12);

        return view('web.profile.favorites', compact('favorites'));
    }

    /**
     * Show user addresses
     */
    public function addresses()
    {
        $user = auth()->user();

        // Bu yerda address model bo'lsa addresses ni olish kerak
        $addresses = collect(); // Hozircha bo'sh collection

        return view('web.profile.addresses', compact('addresses'));
    }

    /**
     * Get user data for API
     */
    public function getUserData()
    {
        $user = auth()->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'language' => $user->language ?: 'uz',
                'created_at' => $user->created_at->format('d.m.Y'),
            ],
            'stats' => [
                'orders_count' => 0, // Bu yerda order model bo'lsa hisoblanadi
                'favorites_count' => $user->favoriteProducts ? $user->favoriteProducts->count() : 0,
                'total_spent' => 0, // Bu yerda orderlar bo'yicha hisoblanadi
                'loyalty_points' => 0, // Bu yerda loyalty system bo'lsa
                'pending_orders' => 0,
                'unread_notifications' => 0,
            ]
        ]);
    }
}
