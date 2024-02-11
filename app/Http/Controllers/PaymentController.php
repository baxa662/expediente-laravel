<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class PaymentController extends Controller
{
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
}
