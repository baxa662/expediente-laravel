<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    //Obtener usuarios
    public function showAll(Request $request)
    {
        $user = Auth::user();
        $idMedico = $user->id_medico ?? $user->id_usuario;
        $users = Usuario::join('permisos as B', 'B.rolid', 'usuarios.rolid')
            ->selectRaw('usuarios.*, B.rol')
            ->where('id_medico', $idMedico)
            ->where('estado', 1)
            ->get();

        return response($users, Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'surname' => 'required',
                'email' => 'required|email|unique:usuarios',
                'password' => 'required|min:8',
                'rol' => 'required',
                'celNumber' => 'min:10|numeric',
            ]
        );


        if (!$validator->fails()) {
            $data = $validator->validate();

            $user = Auth::user();
            $idMedico = $user->id_medico ?? $user->id_usuario;

            $user = new Usuario();
            $user->nombre = $data['name'];
            $user->apellido = $data['surname'];
            $user->telefono = $data['celNumber'];
            $user->email = $data['email'];
            $user->password = Hash::make($data['password']);

            // Only allow Admins (rolid 1) to set roles. 
            // Others get default role (e.g., 2 for generic staff) or error.
            if (Auth::user()->rolid == 1) {
                 $user->rolid = $data['rol'];
            } else {
                 $user->rolid = 2; // Default or safe fallback
            }

            $user->id_medico = $idMedico;
            $user->save();
            return response(true, Response::HTTP_ACCEPTED);
        }
        return response($validator->errors()->first(), Response::HTTP_BAD_REQUEST);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'surname' => 'required',
                'email' => 'required|email',
                'rol' => 'required',
                'celNumber' => 'min_digits:10|numeric',
            ]
        );

        if (!$validator->fails()) {
            $data = $validator->validate();
            $user = Usuario::find($id);
            $user->nombre = $data['name'];
            $user->apellido = $data['surname'];
            $user->telefono = $data['celNumber'];
            $user->email = $data['email'];
            
            // Only allow Admins to update role
            if (Auth::user()->rolid == 1) {
                $user->rolid = $data['rol'];
            }

            $user->save();
            return response(true, Response::HTTP_ACCEPTED);
        }

        return response($validator->errors()->first(), Response::HTTP_BAD_REQUEST);
    }

    function destroy($id)
    {
        $user = Usuario::find($id);
        $user->estado = 0;
        $user->save();

        return response(true, Response::HTTP_ACCEPTED);
    }

    public function resetPassword(Request $request, $id)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'password' => 'required',
            ]
        );

        if (!$validator->fails()) {
            $data = $validator->validate();
            $user = Usuario::find($id);
            $hash = Hash::make($data['password']);
            $user->password = $hash;
            $user->save();

            return response(true, Response::HTTP_ACCEPTED);
        }

        return response(true, Response::HTTP_BAD_REQUEST);
    }
}
