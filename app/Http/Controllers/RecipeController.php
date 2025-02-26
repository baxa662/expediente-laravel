<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
}
