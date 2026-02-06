<?php

namespace App\Http\Controllers;

use App\Mail\VerificationEmail;
use App\Models\Paciente;
use App\Models\Usuario;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], Response::HTTP_BAD_REQUEST);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if (!empty($user) && $user->estado == 1) {
                $user->tokens()->delete();
                // Token expira en 1 día para usuarios regulares/administradores
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



    public function loginPaciente(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], Response::HTTP_BAD_REQUEST);
        }

        $credentials = $request->only('email', 'password');
        $credentials['estado'] = 1;

        if (Auth::guard('paciente')->attempt($credentials)) {
            $user = Auth::guard('paciente')->user();
            if (!empty($user) && $user->estado == 1) {
                $user->tokens()->delete();
                // Token sin expiración para pacientes
                $token = $user->createToken('userApp', ['*'], null)->plainTextToken;
                $token = "$token";
                return response(["user" => $user, "token" => $token, 'success' => true], Response::HTTP_OK);
            }
            return response(["msg" => "Credenciales no validas"], Response::HTTP_ACCEPTED);
        } else {
            return response(["msg" => "Credenciales no validas"], Response::HTTP_ACCEPTED);
        }
    }


    public function sendVerifyEmailPaciente(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], Response::HTTP_BAD_REQUEST);
        }

        $user = Paciente::find($request->id);

        if (empty($user)) {
            return response([
                'success' => false,
                'message' => 'Usuario no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        // Generar un código de verificación de 6 dígitos
        $verificationCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Guardar el código de verificación en la base de datos (puedes ajustar esto según tu modelo)
        $user->verification_code = $verificationCode;
        $user->verification_code_expires_at = now()->addHours(24); // Caduca en 24 horas
        $user->save();

        try {
            // Enviar el correo de verificación
            Mail::to($user->email)->send(
                new VerificationEmail($verificationCode, $user->nombres ?? 'Usuario')
            );

            return response([
                'success' => true,
                'message' => 'Correo de verificación enviado correctamente',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de verificación: ' . $e->getMessage());

            return response([
                'success' => false,
                'message' => 'Error al enviar el correo de verificación',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Verifica el código de verificación y actualiza la contraseña del paciente
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function verifyAndSetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'verification_code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], Response::HTTP_BAD_REQUEST);
        }

        $user = Paciente::where('email', $request->email)->where('verification_code', $request->verification_code)->first();

        if (empty($user)) {
            return response([
                'success' => false,
                'message' => 'Usuario no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        // Verificar si el código de verificación coincide y no ha expirado
        if ($user->verification_code !== $request->verification_code) {
            return response([
                'success' => false,
                'message' => 'Código de verificación inválido',
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (now()->gt($user->verification_code_expires_at)) {
            return response([
                'success' => false,
                'message' => 'El código de verificación ha expirado',
            ], Response::HTTP_UNAUTHORIZED);
        }

        try {
            // Actualizar la contraseña
            $user->password = Hash::make($request->password);

            // Limpiar el código de verificación
            $user->verification_code = null;
            $user->verification_code_expires_at = null;

            $user->save();

            return response([
                'success' => true,
                'message' => 'Contraseña actualizada exitosamente',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error al actualizar la contraseña: ' . $e->getMessage());

            return response([
                'success' => false,
                'message' => 'Error al actualizar la contraseña',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
