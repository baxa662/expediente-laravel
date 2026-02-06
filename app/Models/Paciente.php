<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Paciente extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $guard = "paciente";

    protected $table = "pacientes";

    protected $primaryKey = "id_paciente";

    protected $hidden = [
        'password',
    ];
}
