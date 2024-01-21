<?php

namespace App\Http\Controllers;

use App\Models\Medida;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class MedidaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $insert = DB::table('medidas')
            ->insert([
                'altura' => $data['altura'],
                'peso' => $data['peso'],
                'imc' => $data['imc'],
                'gc' => $data['grasa_corporal'],
                'msc' => $data['musculo'],
                'kcal' => $data['kilocalorias'],
                'ec' => $data['edad_corporal'],
                'gv' => $data['grasa_visceral'],
                'fecha' => $data['fecha'],
                'id_paciente' => $data['id_paciente'],
            ]);

        if ($insert) {
            return response()->json(true, 200);
        } else {
            return response()->json(false, 204);
        }
    }

    public function storeV2(Request $request)
    {
        $data = $request->all();

        $porGracaCorporal =  ($data['grasa_corporal'] * 100) / $data['peso'];
        $porMasaMusculo =  ($data['masa_musculoes'] * 100) / $data['peso'];

        $insert = DB::table('medidas')
            ->insert([
                'id_paciente' => $data['id_paciente'],
                'altura' => $data['altura'],
                'peso' => $data['peso'],
                'imc' => $data['imc'],
                'gc' => $data['grasa_corporal'],
                'gv' => $data['grasa_visceral'],
                'kcal' => $data['tasa_metabolica'],
                'fecha' => $data['fecha'],
                'msc' => $data['masa_musculoes'],
                'grasaCorporalPor' => round($porGracaCorporal),
                'masaMusculoesPor' => round($porMasaMusculo),
                'masaLibreGrasa' => $data['masa_libre'],
                'obesidadPor' => $data['por_obesidad']
            ]);

        if ($insert) {
            return response()->json(true, 200);
        } else {
            return response()->json(false, 204);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $medida = Medida::find($request->id_medidas);
        $medida->altura = $request->altura;
        $medida->ec = $request->edad_corporal;
        $medida->fecha = $request->fecha;
        $medida->gv = $request->grasa_visceral;
        $medida->gc = $request->grasa_corporal;
        $medida->imc = $request->imc;
        $medida->kcal = $request->kilocalorias;
        $medida->msc = $request->musculo;
        $medida->peso = $request->peso;
        $medida->save();
        return response()->json(true, 200);
    }

    public function updateV2(Request $request)
    {
        $porGracaCorporal =  ($request->grasa_corporal * 100) / $request->peso;
        $porMasaMusculo =  ($request->masa_musculoes * 100) / $request->peso;

        $medida = Medida::find($request->id_medidas);
        $medida->altura = $request->altura;
        $medida->fecha = $request->fecha;
        $medida->gv = $request->grasa_visceral;
        $medida->gc = $request->grasa_corporal;
        $medida->imc = $request->imc;
        $medida->kcal = $request->tasa_metabolica;
        $medida->msc = $request->masa_musculoes;
        $medida->peso = $request->peso;
        $medida->grasaCorporalPor = round($porGracaCorporal);
        $medida->masaMusculoesPor = round($porMasaMusculo);
        $medida->masaLibreGrasa = $request->masa_libre;
        $medida->obesidadPor = $request->por_obesidad;
        $medida->save();
        return response()->json(true, 200);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $medida = Medida::find($id);
        $medida->estado = 0;
        $response = $medida->save();
        if ($response) {
            return response()->json('El registro fue removido exitosamente!', 200);
        } else {
            return response()->json('No se encontro el registro!', 204);
        }
    }
}
