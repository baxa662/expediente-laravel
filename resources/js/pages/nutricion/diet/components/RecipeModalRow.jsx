import React, { useState } from "react";

export const RecipeModalRow = ({ recipe, onClick }) => {
    const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

    return (
        <div
            key={recipe.id}
            className="p-3 border rounded-lg hover:bg-base-100 cursor-pointer"
            onClick={async () => {
                setIsLoadingRecipe(true);
                await onClick(recipe);
                setIsLoadingRecipe(false);
            }}
        >
            {isLoadingRecipe ? (
                <div className="text-center">
                    <span className="loading loading-spinner"></span>
                </div>
            ) : (
                <>
                    <h3 className="font-semibold">{recipe.name}</h3>
                    <p className="text-sm text-gray-600">
                        Creado el:{" "}
                        {new Date(recipe.created_at).toLocaleDateString()}
                    </p>
                </>
            )}
        </div>
    );
};
