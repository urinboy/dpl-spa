<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    use HasFactory;

    protected $fillable = [
        'key', 'value', 'language_id', 'group'
    ];

    // Til bilan bog'lanish
    public function language()
    {
        return $this->belongsTo(Language::class);
    }

    // Guruh bo'yicha filter
    public function scopeByGroup($query, $group)
    {
        return $query->where('group', $group);
    }

    // Til bo'yicha filter
    public function scopeByLanguage($query, $languageCode)
    {
        return $query->whereHas('language', function ($q) use ($languageCode) {
            $q->where('code', $languageCode);
        });
    }

    // Kalit bo'yicha qidirish
    public function scopeByKey($query, $key)
    {
        return $query->where('key', $key);
    }

    // Til va kalitga qarab tarjima olish
    public static function getTranslation($key, $languageCode = 'uz')
    {
        return self::byKey($key)
            ->byLanguage($languageCode)
            ->value('value') ?? $key;
    }

    // Barcha tarjimalarni til bo'yicha olish
    public static function getAllTranslations($languageCode = 'uz', $group = null)
    {
        $query = self::byLanguage($languageCode);

        if ($group) {
            $query = $query->byGroup($group);
        }

        return $query->pluck('value', 'key')->toArray();
    }
}
