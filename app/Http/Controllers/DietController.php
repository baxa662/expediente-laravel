<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Diet;
use App\Models\Recipe;
use App\Models\Ingredient;
use App\Models\Time;
use Illuminate\Support\Facades\DB;

class DietController extends Controller
{
    private $idMedico;

    function __construct()
    {
        $this->middleware(function ($request, $next) {
            $user = Auth::user();
            $this->idMedico = $user->id_medico ?? $user->id_usuario;

            return $next($request);
        });
    }

    public function index(Request $request)
    {
        $diets = Diet::where('name', 'like', '%' . $request->name . '%')
            ->where('idMedico', $this->idMedico)
            ->get();
        return response()->json(['success' => true, 'data' => $diets]);
    }

    public function store(Request $request)
    {
        $diet = new Diet();
        $diet->name = $request->name;
        $diet->idMedico = $this->idMedico;
        $diet->save();

        return response()->json(['success' => true, 'msg' => 'Dieta creada exitosamente']);
    }

    public function update(Request $request, $id)
    {
        $diet = Diet::find($id);
        $diet->name = $request->name;
        $diet->save();

        return response()->json(['success' => true, 'msg' => 'Dieta actualizada exitosamente']);
    }

    public function destroy(Request $request)
    {
        $diet = Diet::find($request->id);
        $diet->delete();

        return response()->json(['success' => true, 'msg' => 'Dieta eliminada exitosamente']);
    }

    public function getDietDetail($id)
    {
        $diet = Diet::with('times')->find($id);
        return response()->json(['success' => true, 'data' => $diet]);
    }

    public function addRecipeToDiet(Request $request, $dietId)
    {
        $diet = Diet::find($dietId);
        $recipe = Recipe::find($request->id);
        $diet->recipes()->attach($recipe, ['idTime' => $request->time]);

        return response()->json(['success' => true, 'msg' => 'Receta agregada exitosamente']);
    }

    public function addIngredientToDiet(Request $request, $dietId)
    {
        $diet = Diet::find($dietId);
        $ingredient = Ingredient::find($request->id);
        $diet->ingredients()->attach($ingredient, ['time' => $request->time]);

        return response()->json(['success' => true, 'msg' => 'Ingrediente agregado exitosamente']);
    }

    public function addTimeToDiet(Request $request, $dietId)
    {
        $time = new Time();
        $time->label = $request->name;
        $time->idDiet = $dietId;
        $time->save();

        return response()->json(['success' => true, 'msg' => 'Tiempo agregado exitosamente']);
    }


    public function saveRecipeToDiet(Request $request)
    {
        $dietId = $request->idDiet;
        $recipeId = $request->idRecipe;
        $timeId = $request->idTime;

        DB::table('nutrition_diet_recipe')->insert([
            'idDiet' => $dietId,
            'idRecipe' => $recipeId,
            'idTime' => $timeId,
        ]);

        return response()->json(['success' => true, 'msg' => 'Receta guardada exitosamente']);
    }
}
