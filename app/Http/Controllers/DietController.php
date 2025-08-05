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
        $diet = Diet::find($id);
        $diet->times = $diet->getTimesWithRecipes();
        return response()->json(['success' => true, 'data' => $diet]);
    }

    public function addRecipeToDiet(Request $request, $dietId, $idTime)
    {
        $diet = Diet::find($dietId);
        $recipe = Recipe::with('ingredients')->find($request->id);
        $diet->recipes()->attach($recipe, ['idTime' => $idTime]);

        // foreach ($recipe->ingredients as $ingredient) {
        //     $diet->ingredients()->attach($ingredient, ['idTime' => $idTime, 'equivalent' => $ingredient->pivot->equivalent, 'idRecipe' => $recipe->id]);
        // }

        return response()->json(['success' => true, 'msg' => 'Receta agregada exitosamente']);
    }

    public function addIngredientToDiet(Request $request, $dietId)
    {
        DB::table('nutrition_diet_recipe_ingredients')->updateOrInsert([
            'idDiet' => $dietId,
            'idRecipe' => $request->idRecipe,
            'idIngredient' => $request->idIngredient,
            'idTime' => $request->idTime,
        ], [
            'equivalent' => $request->equivalent,
        ]);

        return response()->json(['success' => true, 'msg' => 'Ingrediente actualizado exitosamente']);
    }

    public function addTimeToDiet(Request $request, $dietId)
    {
        $time = new Time();
        $time->label = $request->name;
        $time->idDiet = $dietId;
        $time->save();

        return response()->json(['success' => true, 'msg' => 'Tiempo agregado exitosamente']);
    }

    public function removeTimeFromDiet($idDiet, $timeId)
    {
        $time = Time::find($timeId);
        $time->delete();

        return response()->json(['success' => true, 'msg' => 'Tiempo eliminado exitosamente']);
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

    public function removeRecipeFromDiet(Request $request, $dietId, $idTime)
    {
        $recipeId = $request->recipeId;

        $this->removeIngredientsFromDiet($dietId, $recipeId, $idTime);

        $delete = DB::table('nutrition_diet_recipe')
            ->where('idDiet', $dietId)
            ->where('idRecipe', $recipeId)
            ->where('idTime', $idTime)
            ->delete();

        if ($delete) {
            return response()->json(['success' => true, 'msg' => 'Receta eliminada exitosamente']);
        }

        return response()->json(['success' => false, 'msg' => 'Receta no eliminada']);
    }

    public function removeIngredientsFromDiet($dietId, $recipeId, $idTime)
    {
        DB::table('nutrition_diet_recipe_ingredients')
            ->where('idDiet', $dietId)
            ->where('idRecipe', $recipeId)
            ->where('idTime', $idTime)
            ->delete();
    }
}
