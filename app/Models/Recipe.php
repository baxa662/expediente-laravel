<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $table = 'nutrition_recipe';

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'nutrition_recipe_ingredient', 'idRecipe', 'idIngredient')
            ->withPivot('equivalent');
    }
}