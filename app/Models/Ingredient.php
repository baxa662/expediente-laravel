<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Ingredient extends Model
{
    use HasFactory;
    protected $table = 'nutrition_ingredients';
    protected $primaryKey = 'id';


    public function category(): HasOne
    {
        return $this->hasOne(Category::class, 'id', 'idGroup');
    }

    public function nutrients(): BelongsToMany
    {
        return $this->belongsToMany(Nutrient::class, 'nutrition_ingredient_nutrient', 'idIngredient', 'idNutrient');
    }

    public function unit(): HasOne
    {
        return $this->hasOne(ingredientUnit::class, 'id', 'idUnit');
    }
}
