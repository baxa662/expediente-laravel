<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class PaymentController extends Controller
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

    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'paymentType' => 'required',
                'amount' => 'required',
                'idCitaPayment' => 'required',
                'total' => 'total',
            ]
        );

        if (!$validator->fails()) {
            $data = $validator->validate();
            $payment = new Payment();
            $payment->id_cita = $data['idCitaPayment'];
            $payment->monto = $data['amount'];
            $payment->id_metodo = $data['paymentType'];
            $payment->save();

            return response()->json('El pago se guardo!', 200);
        }

        return response($validator->errors()->first(), Response::HTTP_BAD_REQUEST);
    }

    public function show(Request $request, $id = null)
    {
        $limit = $request->limit ?? 10;
        $offset = $request->offset;
        $idCita = $request->idCita;

        $sql = Payment::join('metodos_pago as B', 'pagos.id_metodo', 'B.id_metodo')
            ->join('citas as C', 'pagos.id_cita', 'C.id_cita')
            ->join('pacientes as D', 'C.id_paciente', 'D.id_paciente')
            ->select('pagos.monto', 'pagos.id_pago', 'pagos.concepto', 'B.metodo', 'pagos.created_at as fechaPago', DB::raw('CONCAT(D.nombres, " " , D.apellidos) as nombrePaciente'), 'C.fecha as fechaCita', 'C.hora as horaCita')
            ->where('D.id_medico', $this->idMedico);

        if (!empty($idCita)) {
            $sql->where('pagos.id_cita', $idCita);
        }

        if (!empty($id)) {
            $sql->where('pagos.id_pago', $id);
        }

        $sql2 = clone $sql;
        $count = $sql2->get()->count();
        $allPages = $count / $limit;
        $page = ($offset / $limit) + 1;

        if (!empty($limit) && $offset !== null) {
            $sql->limit($limit)->offset($offset);
        }

        $payments = $sql->orderBy('id_pago', 'DESC')->get();

        return response()->json([
            'success' => true,
            'data' => $payments,
            'page' => $page,
            'offset' => $offset,
            'limit' => $limit,
            'allPages' => ceil($allPages),
        ], 200);
    }

    function getTotalMount($day)
    {
        $totalMethods = DB::table('pagos as A')
            ->join('citas as B', 'A.id_cita', 'B.id_cita')
            ->join('metodos_pago as C', 'A.id_metodo', 'C.id_metodo')
            ->join('pacientes as D', 'B.id_paciente', 'D.id_paciente')
            ->select(DB::raw('SUM(monto) as total'), 'C.metodo')
            ->where('B.fecha', $day)
            ->where('D.id_medico', $this->idMedico)
            ->groupBy('A.id_metodo', 'C.metodo')
            ->get();

        $total = 0;

        foreach ($totalMethods as $key => $value) {
            $total += $value->total;
        }

        $totalMethods[] = [
            'total' => $total,
            'metodo' => 'Total'
        ];

        return response()->json([
            'success' => true,
            'data' => $totalMethods,
        ], 200);
    }
}
