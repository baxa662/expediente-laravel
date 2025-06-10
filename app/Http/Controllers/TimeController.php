<?php

namespace App\Http\Controllers;

use App\Models\Time;
use Illuminate\Http\Request;

class TimeController extends Controller
{
    public function index()
    {
        $times = Time::all();
        return response()->json(['success' => true, 'data' => $times]);
    }

    public function addRecipeToTime(Request $request)
    {
        $timeId = $request->input('timeId');
        $recipeId = $request->input('recipeId');
        $time = Time::findOrFail($timeId);
        $time->recipes()->attach($recipeId);
        return response()->json(['success' => true]);
    }

    public function removeRecipeFromTime(Request $request)
    {
        $timeId = $request->input('timeId');
        $recipeId = $request->input('recipeId');
        $time = Time::findOrFail($timeId);
        $time->recipes()->detach($recipeId);
        return response()->json(['success' => true]);
    }
}
