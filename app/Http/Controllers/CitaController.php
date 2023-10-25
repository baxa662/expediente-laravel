<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CitaController extends Controller
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
        $idPaciente = $request->idPaciente;
        $servicios = $request->servicios;
        $fecha = $request->fecha;

        if (!empty($idPaciente) && !empty($servicios)) {

            $cita = new Cita();
            $cita->id_paciente = $idPaciente;
            $cita->fecha = date('Y-m-d', strtotime($fecha));
            $cita->hora = date('H:i:s', strtotime($fecha));
            $cita->save();

            $idCita = $cita->id_cita;
            $serviciosInsert = [];
            foreach ($servicios as $key => $servicio) {
                $serviciosInsert[$key] = [
                    'idCita' => $idCita,
                    'idServicio' => $servicio,
                ];
            }


            DB::table('citas_servicio')
                ->insert($serviciosInsert);

            return response()->json('Cita agendada', 200);
        } else {
            return response()->json('Todos los campoos son obligatorios', 204);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $day = $request->day;
        $month = $request->month;
        $year = $request->year;
        $date = date("$year-$month-$day");
        $user = Auth::user();
        $idMedico = $user->id_medico ?? $user->id_usuario;

        $citas = DB::table('citas AS A')
            ->select('A.id_cita', 'A.hora', DB::raw('CONCAT(B.nombres, " " ,B.apellidos) as pacientes'), DB::raw('GROUP_CONCAT(" " ,C.nombre, " ") as servicio'), 'A.fecha')
            ->join('pacientes AS B', 'A.id_paciente', '=', 'B.id_paciente')
            ->join('citas_servicio as D', 'A.id_cita', 'D.idCita')
            ->join('servicios AS C', 'C.id_servicio', '=', 'D.idServicio')
            ->where('A.fecha', $date)
            ->where('A.estado', 1)
            ->where('B.id_medico', $idMedico)
            ->orderBy('A.hora', 'ASC')
            ->groupByRaw('A.id_cita, A.hora, A.fecha, B.nombres, B.apellidos')
            ->get();

        foreach ($citas as $key => $value) {
            $citas[$key]->hora = date('H:i', strtotime($value->hora));
        }

        return response()->json($citas, 200);
    }

    public function showAll(Request $request)
    {
        $idMedico = $request->idMedico;
        $month = $request->month;
        $year = $request->year;
        $user = Auth::user();
        $idMedico = $user->id_medico ?? $user->id_usuario;

        $citas = DB::table('citas AS A')
            ->selectRaw('COUNT(id_cita) as total, DAY(fecha) as dia, MONTH(fecha) as month')
            ->join('pacientes AS B', 'A.id_paciente', '=', 'B.id_paciente')
            ->where('id_medico', $idMedico)
            ->whereRaw("MONTH(fecha) = $month")
            ->whereRaw("YEAR(fecha) = $year")
            ->where('A.estado', 1)
            ->where('B.id_medico', $idMedico)
            ->groupBy('fecha')
            ->get();

        return response()->json($citas, 200);
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
    public function update(Request $request, $id)
    {
        $newDate = $request->input('newDate');

        $cita = Cita::find($id);
        $cita->fecha = date('Y-m-d', strtotime($newDate));
        $cita->hora = date('H:i:s', strtotime($newDate));
        $cita->save();

        return response()->json('La cita se ha reagendado', 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $cita = Cita::find($id);
        $cita->estado = 2;
        $cita->save();

        return response()->json('La cita ha sido cancelada!', 200);
    }
}
