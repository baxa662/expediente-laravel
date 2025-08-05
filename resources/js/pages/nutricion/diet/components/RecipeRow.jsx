import React, { useState } from "react";
import IngredientRow from "./IngredientRow";
import { IconButton } from "../../../../components/IconButton";
import DietServices from "../../../../services/DietServices";

const RecipeRow = ({
    recipe,
    idDiet,
    idTime,
    onSaveIngredient,
    onDeleteRecipe,
}) => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const handleDeleteRecipe = async (idRecipe, idTime) => {
        setLoadingDelete(true);
        const success = await DietServices.removeRecipeFromDiet(
            idDiet,
            idRecipe,
            idTime
        );
        setLoadingDelete(false);
        onDeleteRecipe(success);
    };

    return (
        <details className="collapse bg-base-100 border-base-300 border">
            <summary className="collapse-title font-semibold">
                <div className="flex justify-between items-center">
                    <div>{recipe.name}</div>
                    <IconButton
                        icon="delete"
                        clase="link-error"
                        onclick={() => handleDeleteRecipe(recipe.id, idTime)}
                        isLoading={loadingDelete}
                    />
                </div>
            </summary>
            <div className="collapse-content text-sm">
                <ul className="list bg-base-100 rounded-box shadow-md">
                    <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
                        Ingredientes
                    </li>

                    {recipe.ingredients?.map((ingredient, index) => {
                        return (
                            <IngredientRow
                                ingredient={ingredient}
                                key={index}
                                idRecipe={recipe.id}
                                idTime={idTime}
                                idDiet={idDiet}
                                onSave={onSaveIngredient}
                            />
                        );
                    })}
                </ul>
            </div>
        </details>
    );
};

export default RecipeRow;
