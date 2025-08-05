<?php

namespace App\Models;

use App\Models\Time;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Recipe;
use Illuminate\Support\Facades\DB;

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
        return $this->hasMany(Time::class, 'idDiet', 'id');
    }

    public function getTimesWithRecipes()
    {
        $idDiet = $this->id;

        $times = $this->times()->with(['recipes' => function ($query) use ($idDiet) {}])->get();



        foreach ($times as $time) {
            $time->recipes = $time->recipes->map(function ($recipe) use ($time) {
                $recipe->ingredients = $recipe->finalIngredients($time->id, $this->id);
                return $recipe;
            });
        }

        return $times;
    }

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'nutrition_diet_recipe_ingredients', 'idDiet', 'idIngredient');
    }
}
