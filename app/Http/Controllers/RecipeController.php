<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RecipeController extends Controller
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

    public function show(Request $request)
    {
        $limit = $request->limit ?? 10;
        $offset = $request->offset ?? 0;
        $nameQuery = $request->name;

        $sql = Recipe::select('id', 'name')
            ->take($limit)
            ->offset($offset)
            ->where('idMedico', $this->idMedico);

        if (!empty($nameQuery)) {
            $sql->where('name', "LIKE", "%$nameQuery%");
        }

        $recipes = $sql->get();

        return response()->json([
            'success' => true,
            'data' => $recipes,
            'msg' => "Receta creada exitosamente!"
        ], 200);
    }


    public function save(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $recipe = new Recipe();
        $recipe->name = $request->name;
        $recipe->idMedico = $this->idMedico;
        $recipe->save();

        return response()->json([
            'success' => true,
            'data' => $recipe,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $recipe = Recipe::findOrFail($id);
        if ($recipe->idMedico != $this->idMedico) {
            return response()->json([
                'success' => false,
                'msg' => 'Unauthorized'
            ], 403);
        }

        $recipe->name = $request->name;
        $recipe->save();

        return response()->json([
            'success' => true,
            'data' => $recipe,
        ], 200);
    }

    public function destroy($id)
    {
        $recipe = Recipe::findOrFail($id);
        if ($recipe->idMedico != $this->idMedico) {
            return response()->json([
                'success' => false,
                'msg' => 'Unauthorized'
            ], 403);
        }

        $recipe->delete();

        return response()->json([
            'success' => true,
            'msg' => 'La receta fue eliminada exitosamente!'
        ], 200);
    }

    public function addIngredientToRecipe(Request $request)
    {
        $request->validate([
            'idRecipe' => 'required|int',
            'idIngredient' => 'required|int',
            'equivalent' => 'required'
        ]);

        DB::table('nutrition_recipe_ingredient')
            ->insert([
                'idRecipe' => $request->idRecipe,
                'idIngredient' => $request->idIngredient,
                'equivalent' => $request->equivalent,
            ]);

        return response()->json([
            'success' => true,
            'msg' => 'Ingrediente añadido a la receta exitosamente!'
        ], 200);
    }

    public function updateIngredientInRecipe(Request $request)
    {
        $request->validate([
            'idRecipe' => 'required|int',
            'idIngredient' => 'required|int',
            'equivalent' => 'required'
        ]);

        DB::table('nutrition_recipe_ingredient')
            ->where('idRecipe', $request->idRecipe)
            ->where('idIngredient', $request->idIngredient)
            ->update([
                'equivalent' => $request->equivalent,
            ]);

        return response()->json([
            'success' => true,
            'msg' => 'Ingrediente actualizado en la receta exitosamente!'
        ], 200);
    }

    public function deleteIngredientFromRecipe(Request $request)
    {
        $request->validate([
            'idRecipe' => 'required|int',
            'idIngredient' => 'required|int',
        ]);

        DB::table('nutrition_recipe_ingredient')
            ->where('idRecipe', $request->idRecipe)
            ->where('idIngredient', $request->idIngredient)
            ->delete();

        return response()->json([
            'success' => true,
            'msg' => 'Ingrediente eliminado de la receta exitosamente!'
        ], 200);
    }

    public function getRecipeDetail($id)
    {
        $recipe = Recipe::with(['ingredients' => function ($query) {
            $query->join('nutrition_unit as nu', 'nutrition_ingredients.idUnit', 'nu.id')
                ->select('nutrition_ingredients.id', 'nutrition_ingredients.name', 'nutrition_recipe_ingredient.equivalent', 'nutrition_ingredients.portionUnit', 'nutrition_ingredients.portionQuantity', 'nu.name as unit');
        }])->findOrFail($id);

        if ($recipe->idMedico != $this->idMedico) {
            return response()->json([
                'success' => false,
                'msg' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $recipe,
        ], 200);
    }
}
