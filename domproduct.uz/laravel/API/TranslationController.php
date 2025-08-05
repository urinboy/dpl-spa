<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Translation;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TranslationController extends Controller
{
    /**
     * Barcha tarjimalarni olish
     */
    public function index(Request $request)
    {
        try {
            $query = Translation::with('language');

            // Til bo'yicha filter
            if ($request->has('language_code')) {
                $query->byLanguage($request->language_code);
            }

            // Guruh bo'yicha filter
            if ($request->has('group')) {
                $query->byGroup($request->group);
            }

            // Sahifalash
            $perPage = $request->get('per_page', 50);
            $translations = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $translations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarjimalarni olishda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Yangi tarjima qo'shish
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'key' => 'required|string|max:200',
                'value' => 'required|string',
                'language_id' => 'required|exists:languages,id',
                'group' => 'nullable|string|max:50'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validatsiya xatosi',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Takrorlanish tekshiruvi
            $exists = Translation::where('key', $request->key)
                ->where('language_id', $request->language_id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bu kalit uchun tarjima allaqachon mavjud'
                ], 409);
            }

            $translation = Translation::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Tarjima muvaffaqiyatli qo\'shildi',
                'data' => $translation->load('language')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarjima qo\'shishda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bitta tarjimani olish
     */
    public function show($id)
    {
        try {
            $translation = Translation::with('language')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $translation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarjima topilmadi',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Tarjimani yangilash
     */
    public function update(Request $request, $id)
    {
        try {
            $translation = Translation::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'key' => 'sometimes|required|string|max:200',
                'value' => 'sometimes|required|string',
                'language_id' => 'sometimes|required|exists:languages,id',
                'group' => 'nullable|string|max:50'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validatsiya xatosi',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Takrorlanish tekshiruvi (o'zi bundan mustasno)
            if ($request->has('key') || $request->has('language_id')) {
                $key = $request->get('key', $translation->key);
                $languageId = $request->get('language_id', $translation->language_id);

                $exists = Translation::where('key', $key)
                    ->where('language_id', $languageId)
                    ->where('id', '!=', $id)
                    ->exists();

                if ($exists) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Bu kalit uchun tarjima allaqachon mavjud'
                    ], 409);
                }
            }

            $translation->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Tarjima muvaffaqiyatli yangilandi',
                'data' => $translation->fresh('language')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarjimani yangilashda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tarjimani o'chirish
     */
    public function destroy($id)
    {
        try {
            $translation = Translation::findOrFail($id);
            $translation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tarjima muvaffaqiyatli o\'chirildi'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarjimani o\'chirishda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Til bo'yicha barcha tarjimalarni olish (frontend uchun)
     */
    public function getByLanguage($languageCode)
    {
        try {
            $language = Language::where('code', $languageCode)->first();

            if (!$language) {
                return response()->json([
                    'success' => false,
                    'message' => 'Til topilmadi'
                ], 404);
            }

            $translations = Translation::getAllTranslations($languageCode);

            return response()->json([
                'success' => true,
                'language' => $language,
                'translations' => $translations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarjimalarni olishda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Guruh bo'yicha tarjimalarni olish
     */
    public function getByGroup($languageCode, $group)
    {
        try {
            $language = Language::where('code', $languageCode)->first();

            if (!$language) {
                return response()->json([
                    'success' => false,
                    'message' => 'Til topilmadi'
                ], 404);
            }

            $translations = Translation::getAllTranslations($languageCode, $group);

            return response()->json([
                'success' => true,
                'language' => $language,
                'group' => $group,
                'translations' => $translations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarjimalarni olishda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bir nechta tarjimani bir vaqtda qo'shish/yangilash
     */
    public function bulkUpsert(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'language_id' => 'required|exists:languages,id',
                'translations' => 'required|array',
                'translations.*.key' => 'required|string|max:200',
                'translations.*.value' => 'required|string',
                'translations.*.group' => 'nullable|string|max:50'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validatsiya xatosi',
                    'errors' => $validator->errors()
                ], 422);
            }

            $languageId = $request->language_id;
            $translations = $request->translations;
            $created = 0;
            $updated = 0;

            foreach ($translations as $translationData) {
                $existing = Translation::where('key', $translationData['key'])
                    ->where('language_id', $languageId)
                    ->first();

                if ($existing) {
                    $existing->update([
                        'value' => $translationData['value'],
                        'group' => $translationData['group'] ?? null
                    ]);
                    $updated++;
                } else {
                    Translation::create([
                        'key' => $translationData['key'],
                        'value' => $translationData['value'],
                        'language_id' => $languageId,
                        'group' => $translationData['group'] ?? null
                    ]);
                    $created++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Tarjimalar muvaffaqiyatli saqlandi",
                'statistics' => [
                    'created' => $created,
                    'updated' => $updated,
                    'total' => $created + $updated
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tarjimalarni saqlashda xatolik yuz berdi',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
