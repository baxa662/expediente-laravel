<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    private $idMedico = 0;

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
        try {
            $categorias = DB::table('nutrition_ingredients_category')
                ->where('idMedico', $this->idMedico)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categorias
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
            ], 200);
            //throw $th;
        }
    }
}
