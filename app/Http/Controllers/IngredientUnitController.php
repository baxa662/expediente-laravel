<?php

namespace App\Http\Controllers;

use App\Models\ingredientUnit;
use Illuminate\Http\Request;

class IngredientUnitController extends Controller
{
    public function show()
    {
        $units = ingredientUnit::all();

        return response()->json([
            'success' => true,
            'data' => $units
        ], 200);
    }
}
