<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotaController extends Controller
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
    public function create(Request $request)
    {
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

        $insert = DB::table('notas')
            ->insert([
                'id_paciente' => $data['id_paciente'],
                'nota' => $data['nota'],
                'fecha_not' => date('Y-m-d'),
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

    public function showAll(Request $request)
    {
        $idPaciente = $request->input('idPaciente');

        $notas = DB::table('notas')
            ->where('id_paciente', $idPaciente)
            ->orderBy('fecha_not', 'desc')
            ->orderBy('id_nota', 'desc')
            ->get();

        return response()->json($notas, 200);
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
        $data = $request->all();

        $update = DB::table('notas')
            ->where('id_nota', $data['idNota'])
            ->where('id_paciente', $data['id_paciente'])
            ->update([
                'nota' => $data['nota']
            ]);

        if ($update) {
            return response()->json(true, 200);
        } else {
            return response()->json(false, 204);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $nota = Nota::destroy($id);
        if ($nota == 1) {
            return response()->json('La nota se elimino', 200);
        } else {
            return response()->json(false, 204);
        }
    }
}
