import React from "react";
import IngredientRow from "./IngredientRow";

const RecipeRow = ({ recipe }) => {
    return (
        <details className="collapse bg-base-100 border-base-300 border">
            <summary className="collapse-title font-semibold">
                {recipe.name}
            </summary>
            <div className="collapse-content text-sm">
                <ul className="list bg-base-100 rounded-box shadow-md">
                    <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
                        Ingredientes
                    </li>

                    {recipe.ingredients.map((ingredient, index) => {
                        return (
                            <IngredientRow
                                ingredient={ingredient}
                                key={index}
                            />
                        );
                    })}
                </ul>
            </div>
        </details>
    );
};

export default RecipeRow;
