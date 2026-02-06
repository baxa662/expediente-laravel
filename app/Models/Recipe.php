<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;
use Illuminate\Support\Facades\DB;

class Recipe extends Model
{
    use HasFactory;

    protected $table = 'nutrition_recipe';

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'nutrition_recipe_ingredient', 'idRecipe', 'idIngredient')
            ->withPivot('equivalent');
    }

    public function ingredientsDiet()
    {
        return $this->belongsToMany(Ingredient::class, 'nutrition_diet_recipe_ingredients', 'idRecipe', 'idIngredient')
            ->withPivot('idDiet', 'idTime', 'equivalent');
    }

    public function finalIngredients($idTime, $idDiet)
    {
        return $this->belongsToMany(Ingredient::class, 'nutrition_recipe_ingredient', 'idRecipe', 'idIngredient')
            ->withPivot('equivalent')
            ->join('nutrition_unit as nu', 'nutrition_ingredients.idUnit', '=', 'nu.id')
            ->leftJoin('nutrition_diet_recipe_ingredients as ndri', function ($join) use ($idTime, $idDiet) {
                $join->on('nutrition_recipe_ingredient.idRecipe', '=', 'ndri.idRecipe')
                    ->on('nutrition_recipe_ingredient.idIngredient', '=', 'ndri.idIngredient')
                    ->where('ndri.idTime', '=', $idTime)
                    ->where('ndri.idDiet', '=', $idDiet);
            })
            ->selectRaw('COALESCE(ndri.equivalent, nutrition_recipe_ingredient.equivalent) as equivalent, nutrition_ingredients.*, nu.name as unit')
            ->get();
    }
}
