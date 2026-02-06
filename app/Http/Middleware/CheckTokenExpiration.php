<?php

namespace App\Http\Middleware;

use Closure;
use Laravel\Sanctum\PersonalAccessToken;

class CheckTokenExpiration
{
    public function handle($request, Closure $next)
    {
        $token = $request->user()?->currentAccessToken();

        if (! $token) {
            return response()->json(['message' => 'Token inválido mid'], 401);
        }

        $user = $request->user();

        // Si es paciente -> nunca expira
        if (method_exists($user, 'isPaciente') && $user->isPaciente()) {
            return $next($request);
        }

        // Si es user normal -> expira en X minutos
        $expiration = config('sanctum.expiration', 60);
        if ($expiration && $token->created_at->lte(now()->subMinutes($expiration))) {
            $token->delete(); // opcional
            return response()->json(['message' => 'Token expirado'], 401);
        }

        return $next($request);
    }
}
