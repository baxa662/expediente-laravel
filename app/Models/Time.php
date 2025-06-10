<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Recipe;
use App\Models\Diet;

class Time extends Model
{
    use HasFactory;

    protected $table = 'nutrition_diet_time';

    public function diet()
    {
        return $this->belongsTo(Diet::class, 'idDiet', 'id');
    }

    public function recipes()
    {
        return $this->belongsToMany(Recipe::class, 'nutrition_diet_recipe', 'idTime', 'idRecipe');
    }
}
