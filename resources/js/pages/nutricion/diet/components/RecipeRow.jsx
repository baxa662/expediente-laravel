import React from "react";
import IngredientRow from "./IngredientRow";

const RecipeRow = ({ recipe }) => {
    return (
        <details class="collapse bg-base-100 border-base-300 border">
            <summary class="collapse-title font-semibold">
                {recipe.name}
            </summary>
            <div class="collapse-content text-sm">
                <ul class="list bg-base-100 rounded-box shadow-md">
                    <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
                        Ingredientes
                    </li>

                    {recipe.ingredients.map((ingredient) => {
                        return <IngredientRow ingredient={ingredient} />;
                    })}
                </ul>
            </div>
        </details>
    );
};

export default RecipeRow;
