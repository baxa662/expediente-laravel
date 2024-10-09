<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Termwind\Components\Raw;

class PacienteController extends Controller
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
        $paciente = $request->all();
        $user = Auth::user();
        $idMedico = $user->id_medico ?? $user->id_usuario;

        $edad = date_diff(date_create(date('Y-m-d')), date_create($paciente['nacimiento']))->format('%Y');

        $insert = DB::table('pacientes')
            ->insert([
                'id_medico' => $idMedico,
                'nombres' => $paciente['nombres'],
                'apellidos' => $paciente['apellidos'],
                'sexo' => $paciente['sexo'],
                'edad' => $edad,
                'edo_civil' => $paciente['edoCivil'],
                'ocupacion' => $paciente['ocupacion'] ?? '',
                'fecha_inicio' => date('Y-m-d'),
                'email' => $paciente['correo'] ?? '',
                'nacimiento' => $paciente['nacimiento'],
                'alergias' => $paciente['alergias'] ?? '',
                'numero' => $paciente['celular'] ?? '',
                'ant_pat' => $paciente['antPat'] ?? '',
                'ant_per_no_pat' => $paciente['antNoPat'] ?? '',
                'ant_here' => $paciente['antHere'] ?? '',
                'area' => 1,
                'estado' => 1,
            ]);

        if ($insert) {
            return response()->json([
                'success' => true,
                'msg' => 'Se registro correctamente'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'msg' => 'Algo salio mal!'
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $id = $request->input('id');
        $user = Auth::user();
        $idMedico = $user->id_medico ?? $user->id_usuario;

        $paciente = DB::table('pacientes AS A')
            ->select('A.id_paciente as id', 'B.idSexo', 'nombres', 'apellidos', 'B.nombre as sexo', 'A.edad', 'C.nombre as edo_civil', 'A.ocupacion', 'A.fecha_inicio', 'A.email', 'A.nacimiento', 'A.alergias', 'A.numero', 'A.ant_pat', 'A.ant_per_no_pat', 'A.ant_here')
            ->leftJoin('paciente_sexo AS B', 'B.idSexo', 'A.sexo')
            ->leftJoin('paciente_edo_civil AS C', 'C.idEdoCivil', 'A.edo_civil')
            ->where('id_paciente', $id)
            ->where('id_medico', $idMedico)
            ->get();

        $medidas = DB::table('medidas')
            ->where('id_paciente', $id)
            ->orderBy('fecha', 'asc')
            ->where('estado', 1)
            ->get();


        if (!empty($paciente[0])) {
            $data = (object)[
                'paciente' => $paciente[0],
                'medidas' => $medidas,
            ];
            return response()->json($data, 200);
        }
        return response()->json([], 204);
    }

    public function showAll(Request $request)
    {
        $query = "%{$request->input('query')}%" ?? '%%';
        $limit = $request->input('limit') ?? 20;
        $offset = $request->input('offset') ?? 0;
        $user = Auth::user();
        $idMedico = $user->id_medico ?? $user->id_usuario;

        $pacientes = DB::table('pacientes')
            ->select(DB::raw('concat(apellidos," ",nombres) as nombresCom'), 'numero', 'id_paciente as id', 'pacientes.*')
            ->where(DB::raw('concat(apellidos, " ", nombres)'), 'LIKE', $query)
            ->orderBy('apellidos')
            ->limit($limit)
            ->offset($offset)
            ->where('estado', 1)
            ->where('id_medico', $idMedico)
            ->get();
        $allPacientes = DB::table('pacientes')
            ->select(DB::raw('concat(apellidos," ",nombres) as nombres'), 'numero')
            ->where(DB::raw('concat(apellidos, " ", nombres)'), 'LIKE', $query)
            ->orderBy('apellidos')
            ->where('estado', 1)
            ->where('id_medico', $idMedico)
            ->get();

        $allPages = count($allPacientes) / $limit;

        $page = ($offset / $limit) + 1;

        return response()->json([
            'success' => true,
            'data' => $pacientes,
            'page' => $page,
            'offset' => $offset,
            'limit' => $limit,
            'allPages' => ceil($allPages),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function edit(Paciente $paciente)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Paciente $paciente)
    {
        $paciente = $request->all();
        $user = Auth::user();
        $idMedico = $user->id_medico ?? $user->id_usuario;

        $edad = date_diff(date_create(date('Y-m-d')), date_create($paciente['nacimiento']))->format('%Y');

        $insert = DB::table('pacientes')
            ->where('id_paciente', $paciente['id'])
            ->where('id_medico', $idMedico)
            ->update([
                'nombres' => $paciente['nombres'],
                'apellidos' => $paciente['apellidos'],
                'sexo' => $paciente['sexo'],
                'edad' => $edad,
                'edo_civil' => $paciente['edoCivil'],
                'ocupacion' => $paciente['ocupacion'],
                'fecha_inicio' => date('Y-m-d'),
                'email' => $paciente['correo'],
                'nacimiento' => $paciente['nacimiento'],
                'alergias' => $paciente['alergias'],
                'numero' => $paciente['celular'],
                'ant_pat' => $paciente['antPat'],
                'ant_per_no_pat' => $paciente['antNoPat'],
                'ant_here' => $paciente['antHere'],
                'area' => 1,
                'estado' => 1,
            ]);

        if ($insert) {
            return response()->json([
                'success' => true,
                'msg' => 'Se actualizo correctamente'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'msg' => 'Algo salio mal!'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Paciente $paciente)
    {
        $id = $request->input('id');
        $user = Auth::user();
        $idMedico = $user->id_medico ?? $user->id_usuario;

        $delete = DB::table('pacientes')
            ->where('id_paciente', $id)
            ->where('id_medico', $idMedico)
            ->update([
                'estado' => 0,
                'fecha_baja' => date('Y-m-d')
            ]);
        if ($delete) {
            return response()->json('El paciente se ha eliminado', 200);
        } else {
            return response()->json('Ocurrio un error al borrar el paciente', 204);
        }
    }

    public function getSexos(Request $request)
    {
        $select = DB::table('paciente_sexo')
            ->select('idSexo as id', 'nombre as name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $select,
        ]);
    }

    public function getEdoCivil(Request $request)
    {
        $select = DB::table('paciente_edo_civil')
            ->select('idEdoCivil as id', 'nombre as name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $select,
        ]);
    }
}
