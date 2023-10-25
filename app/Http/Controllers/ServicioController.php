<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ServicioController extends Controller
{
    public function showAll(Request $request)
    {
        $query = "%{$request->input('query')}%" ?? '%%';
        $limit = $request->input('limit') ?? 20;
        $offset = $request->input('offset') ?? 0;
        $user = Auth::user();
        $idMedico = $user->id_medico ?? $user->id_usuario;

        $services = DB::table('servicios')
            ->where('nombre', 'LIKE', $query)
            ->where('id_medico', $idMedico)
            ->where('status', 1)
            ->limit($limit)
            ->offset($offset)
            ->get()
            ->toArray();
        $allServices = DB::table('servicios')
            ->where('id_medico', $idMedico)
            ->where('status', 1)
            ->get()
            ->toArray();


        $allPages = count($allServices) / $limit;

        $page = ($offset / $limit) + 1;

        return response()->json([
            'success' => true,
            'data' => $services,
            'page' => $page,
            'offset' => $offset,
            'limit' => $limit,
            'allPages' => ceil($allPages),
        ]);
    }

    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required',
            'price' => 'required|numeric',
        ]);

        if ($validation->fails()) {
            return response()->json($validation->errors()->first(), Response::HTTP_BAD_REQUEST);
        }

        $data = $request->all();
        $service = Servicio::find($id);
        $service->nombre = $data['name'];
        $service->costo = $data['price'];
        $service->save();

        return response()->json(true, Response::HTTP_ACCEPTED);
    }

    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required',
            'price' => 'required|numeric',
        ]);

        if ($validation->fails()) {
            return response()->json($validation->errors()->first(), Response::HTTP_BAD_REQUEST);
        }
        $user = Auth::user();
        $idMedico = $user->id_medico ?? $user->id_usuario;

        $data = $request->all();
        $service = new Servicio();
        $service->nombre = $data['name'];
        $service->costo = $data['price'];
        $service->id_medico = $idMedico;
        $service->save();

        return response()->json(true, Response::HTTP_ACCEPTED);
    }

    function destroy($id)
    {
        $user = Servicio::find($id);
        $user->status = 0;
        $user->save();

        return response(true, Response::HTTP_ACCEPTED);
    }
}
