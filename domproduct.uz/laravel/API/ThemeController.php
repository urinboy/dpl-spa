<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function toggle(Request $request)
    {
        $theme = $request->input('theme', 'light');

        // Validate theme
        if (!in_array($theme, ['light', 'dark'])) {
            $theme = 'light';
        }

        // Store theme in session
        $request->session()->put('theme', $theme);

        return response()->json([
            'success' => true,
            'theme' => $theme,
            'message' => __('admin.theme_changed')
        ]);
    }

    public function getCurrent(Request $request)
    {
        $theme = $request->session()->get('theme', 'light');

        return response()->json([
            'theme' => $theme
        ]);
    }
}
