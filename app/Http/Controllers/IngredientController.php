<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class IngredientController extends Controller
{
    private $idMedico = null;

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
        $query = $request->input('query');

        try {
            $ingredientsSql =  DB::table('nutrition_ingredients as ni')
                ->join('nutrition_ingredients_category as nic', 'nic.id', 'ni.idGroup')
                ->join('nutrition_unit as nu', 'ni.idUnit', 'nu.id')
                ->select('ni.id', 'ni.name', 'nic.name as category', 'nu.name as unit', 'ni.portionUnit', 'ni.portionQuantity')
                ->where('ni.idMedico', $this->idMedico)
                ->where('ni.state', 1);

            if (!empty($query)) {
                $ingredientsSql->where('ni.name', 'LIKE', "%$query%");
            }

            $ingredients = $ingredientsSql->get()->toArray();

            return response()->json([
                'success' => true,
                'data' => $ingredients
            ], 200);
        } catch (\Throwable $th) {
            Log::error("Error Ingrediente", ['error' => $th->getMessage()]);
            return response()->json([
                'success' => false,
                'msg' => 'Ocurrio un error al obtener los datos'
            ], 200);
        }
    }

    public function getIngredientDetail($idIngredient)
    {
        try {
            $ingredient = Ingredient::with(['nutrients' => function ($query) {
                $query->select('nutrition_nutrients.*', 'nutrition_ingredient_nutrient.amount');
            }, 'unit'])->with(['category' => function ($query) {
                $query->select('nutrition_ingredients_category.name', 'nutrition_ingredients_category.id');
            }])->find($idIngredient);

            if (!$ingredient) {
                return response()->json([
                    'success' => false,
                    'msg' => 'Ingrediente no encontrado'
                ], 200);
            }

            return response()->json([
                'success' => true,
                'data' => $ingredient
            ], 200);
        } catch (\Throwable $th) {
            Log::error("Error al obtener el detalle del ingrediente", ['error' => $th->getMessage()]);
            return response()->json([
                'success' => false,
                'msg' => 'Ocurrió un error al obtener el detalle del ingrediente'
            ], 200);
        }
    }

    public function save(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required'
            ]);

            $name = $request->name;
            $ingredient = new Ingredient();
            $ingredient->name = $name;
            $ingredient->idGroup = $request->category;
            $ingredient->idMedico = $this->idMedico;

            $ingredient->save();

            return response()->json([
                'success' => true,
                'data' => [
                    'idIngredient' => $ingredient->id,
                ],
                'msg' => 'El alimento se agrego correctamente!'
            ], 200);
        } catch (\Throwable $th) {
            dd($th);
            return response()->json([
                'success' => false,
                'msg' => 'Ocurrio un error al crear el Alimento!'
            ], 200);
        }
    }

    public function setNutrient(Request $request)
    {
        $request->validate([
            'idIngredient' => 'required',
            'idNutrient' => 'required',
            'amount' => 'required',
        ]);

        $idIngredient = $request->idIngredient;
        $idNutrient = $request->idNutrient;
        $amount = $request->amount;

        try {
            $insert =  DB::table('nutrition_ingredient_nutrient')
                ->insert([
                    'idIngredient' => $idIngredient,
                    'idNutrient' => $idNutrient,
                    'amount' => $amount,
                    'idMedico' => $this->idMedico
                ]);

            return response()->json([
                'success' => true,
                'msg' => 'Se asigno correctamente'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Ingrediente Error: ', ['error' => $th]);
            return response()->json([
                'success' => false,
                'msg' => 'Ocurrio un error en la asignacion del nutriente'
            ], 200);
        }
    }

    public function delete($idIngredient)
    {
        try {
            DB::transaction(function () use ($idIngredient) {
                DB::table('nutrition_ingredient_nutrient')
                    ->where('idIngredient', $idIngredient)
                    ->delete();

                Ingredient::where('id', $idIngredient)->delete();
            });

            return response()->json([
                'success' => true,
                'msg' => 'Ingrediente y sus nutrientes eliminados correctamente'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error al eliminar el ingrediente', ['error' => $th->getMessage()]);
            return response()->json([
                'success' => false,
                'msg' => 'Ocurrió un error al eliminar el ingrediente'
            ], 200);
        }
    }

    public function update(Request $request, $idIngredient)
    {
        $request->validate([
            'name' => 'required',
            'category' => 'required',
            'portionQuantity' => 'required',
            'idUnit' => 'required',
            'portionUnit' => 'required',
        ]);

        $nutrients = $request->input('nutrients', []);

        try {
            $ingredient = Ingredient::find($idIngredient);

            $ingredient->name = $request->name;
            $ingredient->idGroup = $request->category;
            $ingredient->portionQuantity = $request->portionQuantity;
            $ingredient->idUnit = $request->idUnit;
            $ingredient->portionUnit = $request->portionUnit;

            $ingredient->save();
        } catch (\Throwable $th) {
            Log::error('Error al actualizar el ingrediente', ['error' => $th->getMessage()]);
            return response()->json([
                'success' => false,
                'msg' => 'Ocurrió un error al actualizar el ingrediente'
            ], 200);
        }

        foreach ($nutrients as $nutrient) {
            DB::table('nutrition_ingredient_nutrient')->updateOrInsert(
                [
                    'idIngredient' => $idIngredient,
                    'idNutrient' => $nutrient['id'],
                    'idMedico' => $this->idMedico
                ],
                [
                    'amount' => $nutrient['amount']
                ]
            );
        }

        return response()->json([
            'success' => true,
            'msg' => 'El ingrediente se actualizó correctamente!'
        ], 200);
    }

    public function deleteNutrient(Request $request)
    {
        $request->validate([
            'idIngredient' => 'required',
            'idNutrient' => 'required',
        ]);

        $idIngredient = $request->idIngredient;
        $idNutrient = $request->idNutrient;

        try {
            DB::table('nutrition_ingredient_nutrient')
                ->where('idIngredient', $idIngredient)
                ->where('idNutrient', $idNutrient)
                ->delete();

            return response()->json([
                'success' => true,
                'msg' => 'Nutriente eliminado correctamente'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error al eliminar el nutriente', ['error' => $th->getMessage()]);
            return response()->json([
                'success' => false,
                'msg' => 'Ocurrió un error al eliminar el nutriente'
            ], 200);
        }
    }
}
