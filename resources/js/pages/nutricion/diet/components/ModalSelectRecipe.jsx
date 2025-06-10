import React, { useState, useEffect } from "react";
import { Modal } from "../../../../components/Modal";
import RecipeServices from "../../../../services/RecipeServices";
import { IconButton } from "../../../../components/IconButton";

const ModalSelectRecipe = ({ onRecipeSelected }) => {
    const [showed, setShowed] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchRecipes = async () => {
        setLoading(true);
        const response = await RecipeServices.getRecipes({
            search: searchTerm,
        });
        if (response.success) {
            setRecipes(response.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRecipes();
    }, [searchTerm]);

    return (
        <>
            <IconButton
                icon={"restaurant_menu"}
                clase={"btn btn-primary"}
                onclick={() => setShowed(true)}
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
                            className="input input-bordered"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                        <div
                                            key={recipe.id}
                                            className="p-3 border rounded-lg hover:bg-base-100 cursor-pointer"
                                            onClick={() => {
                                                onRecipeSelected(recipe);
                                                setShowed(false);
                                            }}
                                        >
                                            <h3 className="font-semibold">
                                                {recipe.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Creado el:{" "}
                                                {new Date(
                                                    recipe.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
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
