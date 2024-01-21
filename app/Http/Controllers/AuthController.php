<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if (!empty($user) && $user->estado == 1) {
                $token = $user->createToken('tokenUser', ['*'], Carbon::now()->addDays(1))->plainTextToken;
                $userPermission = base64_encode($user->rolid);
                $token = "$userPermission.$token";
                return response(["token" => $token, 'success' => true], Response::HTTP_OK);
            }
            return response(["msg" => "Credenciales no validas"], Response::HTTP_ACCEPTED);
        } else {
            return response(["msg" => "Credenciales no validas"], Response::HTTP_ACCEPTED);
        }
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if (!empty($user)) {
            $user->currentAccessToken()->delete();

            return response([], Response::HTTP_OK);
        } else {
            return response([], Response::HTTP_NO_CONTENT);
        }
    }

    public function register(Request $request)
    {
        $user = new Usuario();
        $user->nombre = 'Juan';
        $user->apellido = 'Aviles';
        $user->telefono = '5549372600';
        $user->edad = '24';
        $user->email = 'prueba@gmail.com';
        $user->password = Hash::make('12345');
        $user->rolid = '1';
        $user->save();

        return response($user, Response::HTTP_ACCEPTED);
    }
}
