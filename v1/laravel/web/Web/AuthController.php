<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Show login form
     */
    public function showLogin()
    {
        if (auth()->check()) {
            return redirect()->route('web.profile');
        }

        return view('web.auth.login');
    }

    /**
     * Handle login request
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:6',
        ], [
            'email.required' => 'Email manzil kiritish majburiy',
            'email.email' => 'To\'g\'ri email manzil kiriting',
            'password.required' => 'Parol kiritish majburiy',
            'password.min' => 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $credentials = $request->only('email', 'password');
        $remember = $request->has('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            $user = Auth::user();

            // Redirect to intended page or profile
            $redirectTo = $request->input('redirect_to', route('web.profile'));

            return response()->json([
                'success' => true,
                'message' => 'Muvaffaqiyatli tizimga kirdingiz',
                'redirect' => $redirectTo,
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Email yoki parol noto\'g\'ri',
            'errors' => [
                'email' => ['Email yoki parol noto\'g\'ri']
            ]
        ], 422);
    }

    /**
     * Show registration form
     */
    public function showRegister()
    {
        if (auth()->check()) {
            return redirect()->route('web.profile');
        }

        return view('web.auth.register');
    }

    /**
     * Handle registration request
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
            'language' => 'nullable|string|max:5',
            'terms' => 'accepted',
        ], [
            'name.required' => 'Ism familiya kiritish majburiy',
            'email.required' => 'Email manzil kiritish majburiy',
            'email.email' => 'To\'g\'ri email manzil kiriting',
            'email.unique' => 'Bu email manzil allaqachon ro\'yxatdan o\'tgan',
            'password.required' => 'Parol kiritish majburiy',
            'password.min' => 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
            'password.confirmed' => 'Parol tasdig\'i mos kelmaydi',
            'terms.accepted' => 'Foydalanish shartlarini qabul qilishingiz kerak',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Ma\'lumotlarni to\'g\'ri kiriting',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'language' => $request->language ?: 'uz',
                'email_verified_at' => now(), // Auto verify for now
            ]);

            Auth::login($user, true);

            return response()->json([
                'success' => true,
                'message' => 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz',
                'redirect' => route('web.profile'),
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ro\'yxatdan o\'tishda xatolik yuz berdi',
                'errors' => [
                    'general' => ['Ro\'yxatdan o\'tishda xatolik yuz berdi']
                ]
            ], 500);
        }
    }

    /**
     * Handle logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Muvaffaqiyatli chiqib ketdingiz',
                'redirect' => route('web.home')
            ]);
        }

        return redirect()->route('web.home')->with('success', 'Muvaffaqiyatli chiqib ketdingiz');
    }

    /**
     * Show forgot password form
     */
    public function showForgotPassword()
    {
        return view('web.auth.forgot-password');
    }

    /**
     * Handle forgot password request
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Email manzil kiritish majburiy',
            'email.email' => 'To\'g\'ri email manzil kiriting',
            'email.exists' => 'Bu email manzil ro\'yxatdan o\'tmagan',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Ma\'lumotlarni to\'g\'ri kiriting',
                'errors' => $validator->errors()
            ], 422);
        }

        // Bu yerda password reset logikasi bo'ladi
        // Hozircha simple response qaytaramiz

        return response()->json([
            'success' => true,
            'message' => 'Parolni tiklash uchun email yuborildi'
        ]);
    }

    /**
     * Check authentication status
     */
    public function checkAuth()
    {
        if (auth()->check()) {
            $user = auth()->user();
            return response()->json([
                'authenticated' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ]
            ]);
        }

        return response()->json([
            'authenticated' => false
        ]);
    }
}
