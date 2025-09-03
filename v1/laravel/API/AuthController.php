<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Ro'yxatdan o'tish
     */
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        $token = $user->createToken('api_token')->plainTextToken;
        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Login
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $credentials['email'])->first();
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['success' => false, 'message' => 'Login yoki parol xato'], 401);
        }
        $token = $user->createToken('api_token')->plainTextToken;
        $user->update(['last_login_at' => now()]);
        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Chiqildi']);
    }

    /**
     * Authenticated user info
     */
    public function me(Request $request)
    {
        return response()->json(['success' => true, 'user' => $request->user()]);
    }

    /**
     * Foydalanuvchi location va address ma'lumotlarini yangilash
     */
    public function updateLocation(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
        ]);
        $user->update($data);
        return response()->json(['success' => true, 'user' => $user->fresh()]);
    }
}
