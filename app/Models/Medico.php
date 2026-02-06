<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Medico extends Authenticatable
{

    use HasApiTokens, HasFactory, Notifiable;

    protected $guard = "medico";

    protected $primaryKey = 'id_medico';

    protected $fillable = [
        'nombre',
        'contrasena',
    ];

    protected $hidden = [
        'password',
    ];
}
