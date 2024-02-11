<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethods;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PaymentMethodsController extends Controller
{
    public function show($id = null)
    {
        $sql = PaymentMethods::select('id_metodo as id', 'metodo as name')
            ->where('estado', 1);

        if (!empty($id)) {
            $sql->where('id_metodo', $id);
        }

        $paymentMethods = $sql->get();

        return response()->json($paymentMethods, Response::HTTP_OK);
    }
}
