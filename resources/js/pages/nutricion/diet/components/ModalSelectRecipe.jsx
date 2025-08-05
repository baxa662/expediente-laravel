import React, { useState } from "react";
import { Modal } from "../../../../components/Modal";
import RecipeServices from "../../../../services/RecipeServices";
import { IconButton } from "../../../../components/IconButton";
import debounce from "../../../../helpers/Debounce";
import { RecipeModalRow } from "./RecipeModalRow";

const ModalSelectRecipe = ({ onRecipeSelected, time }) => {
    const [showed, setShowed] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

    const fetchRecipes = async (searchTerm) => {
        setLoading(true);
        const response = await RecipeServices.getRecipes({
            name: searchTerm,
        });
        if (response.success) {
            setRecipes(response.data);
        }
        setLoading(false);
    };

    const debouncedFetchRecipes = debounce(fetchRecipes, 500);

    const handleSearch = (searchTerm) => {
        debouncedFetchRecipes(searchTerm);
    };

    const showModalRecipes = () => {
        fetchRecipes();
        setShowed(true);
    };

    return (
        <>
            <IconButton
                icon={"restaurant_menu"}
                clase={"btn btn-primary"}
                onclick={() => showModalRecipes()}
            >
                Seleccionar Receta
            </IconButton>

            <Modal
                isChecked={showed}
                setIsChecked={setShowed}
                title="Seleccionar Receta"
            >
                <div className="space-y-4">
                    <div className="form-control">
                        <input
                            type="text"
                            placeholder="Buscar receta..."
                            className="input input-bordered w-full"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center">
                            <span className="loading loading-spinner"></span>
                        </div>
                    ) : (
                        <div className="overflow-y-auto max-h-[400px]">
                            {recipes.length === 0 ? (
                                <p className="text-center text-gray-500">
                                    No se encontraron recetas
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {recipes.map((recipe) => (
                                        <RecipeModalRow
                                            recipe={recipe}
                                            onClick={async (recipe) => {
                                                await onRecipeSelected(
                                                    recipe,
                                                    time.id
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default ModalSelectRecipe;
