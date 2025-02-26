<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ingredientUnit extends Model
{
    use HasFactory;

    protected $table = 'nutrition_unit';
    protected $primaryKey = 'id';
}
