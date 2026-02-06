<?php

namespace App\Auth;

use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class CustomSanctumGuard extends \Laravel\Sanctum\Guard
{
    protected $request;

    public function __construct(AuthFactory $auth, $expiration, $provider = null, Request $request = null)
    {
        parent::__construct($auth, $expiration, $provider);
        $this->request = $request ?? request();
    }

    protected function hasValidAccessToken($token)
    {
        $accessToken = PersonalAccessToken::findToken($token);

        if (! $accessToken) {
            return false;
        }

        $user = $accessToken->tokenable;

        // ✅ Si el guard es "paciente", nunca expira
        if ($user && $user instanceof \App\Models\Paciente) {
            return true;
        }

        // ✅ Si es user normal, usar la expiración global (sanctum.php)
        $expiration = config('sanctum.expiration');

        if ($expiration && $accessToken->created_at->lte(now()->subMinutes($expiration))) {
            return false;
        }

        return true;
    }

    public function check()
    {
        return $this->hasValidAccessToken($this->request->bearerToken());
    }
}
