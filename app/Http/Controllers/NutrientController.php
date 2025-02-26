<?php

namespace App\Http\Controllers;

use App\Models\Nutrient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NutrientController extends Controller
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

    function show($idNutrient = 0)
    {
        $nutrients = Nutrient::where('idMedico', $this->idMedico)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $nutrients
        ], 200);
    }
}
