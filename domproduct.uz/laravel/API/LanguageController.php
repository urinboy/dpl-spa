<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LanguageController extends Controller
{
    /**
     * Barcha tillarni ro'yxatini olish
     */
    public function index(Request $request)
    {
        try {
            $query = Language::query();

            // Faqat faol tillar
            if ($request->boolean('active_only')) {
                $query->active();
            }

            // Tartiblash
            $query->ordered();

            $languages = $query->get();

            return response()->json([
                'success' => true,
                'data' => $languages
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tillarni olishda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Yangi til qo'shish
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:100',
                'code' => 'required|string|max:5|unique:languages,code',
                'flag' => 'nullable|string|max:50',
                'is_active' => 'boolean',
                'is_default' => 'boolean',
                'sort_order' => 'integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validatsiya xatosi',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Agar yangi til asosiy bo'lsa, boshqalarini asosiy emas qilib qo'yamiz
            if ($request->boolean('is_default')) {
                Language::where('is_default', true)->update(['is_default' => false]);
            }

            $language = Language::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Til muvaffaqiyatli qo\'shildi',
                'data' => $language
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Til qo\'shishda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bitta tilning ma'lumotlarini olish
     */
    public function show($id)
    {
        try {
            $language = Language::with('translations')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $language
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Til topilmadi',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Tilni yangilash
     */
    public function update(Request $request, $id)
    {
        try {
            $language = Language::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:100',
                'code' => 'sometimes|required|string|max:5|unique:languages,code,' . $id,
                'flag' => 'nullable|string|max:50',
                'is_active' => 'boolean',
                'is_default' => 'boolean',
                'sort_order' => 'integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validatsiya xatosi',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Agar yangi til asosiy bo'lsa, boshqalarini asosiy emas qilib qo'yamiz
            if ($request->boolean('is_default')) {
                Language::where('id', '!=', $id)->update(['is_default' => false]);
            }

            $language->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Til muvaffaqiyatli yangilandi',
                'data' => $language->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tilni yangilashda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tilni o'chirish
     */
    public function destroy($id)
    {
        try {
            $language = Language::findOrFail($id);

            // Asosiy tilni o'chirishga ruxsat bermaymiz
            if ($language->is_default) {
                return response()->json([
                    'success' => false,
                    'message' => 'Asosiy tilni o\'chirish mumkin emas'
                ], 403);
            }

            $language->delete();

            return response()->json([
                'success' => true,
                'message' => 'Til muvaffaqiyatli o\'chirildi'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tilni o\'chirishda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Asosiy tilni olish
     */
    public function getDefault()
    {
        try {
            $language = Language::default()->first();

            if (!$language) {
                return response()->json([
                    'success' => false,
                    'message' => 'Asosiy til topilmadi'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $language
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Asosiy tilni olishda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
