<?php

namespace App\Models;

use App\Models\Time;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Recipe;

class Diet extends Model
{
    use HasFactory;

    protected $table = 'nutrition_diet';

    public function recipes()
    {
        return $this->belongsToMany(Recipe::class, 'nutrition_diet_recipe', 'idDiet', 'idRecipe')
            ->withPivot('idTime');
    }

    public function times()
    {
        return $this->hasMany(Time::class, 'idDiet', 'id')
            ->with(['recipes' => function ($query) {
                $query->with(['ingredients' => function ($query) {
                    $query->withPivot('equivalent');
                    $query->join('nutrition_unit as nu', 'nutrition_ingredients.idUnit', 'nu.id')
                        ->select('nutrition_ingredients.id', 'nutrition_ingredients.name', 'nutrition_recipe_ingredient.equivalent', 'nutrition_ingredients.portionUnit', 'nutrition_ingredients.portionQuantity', 'nu.name as unit');
                }]);
            }]);
    }
}
