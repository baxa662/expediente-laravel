import React, { useState, useEffect } from "react";
import DietServices from "../../../services/DietServices";
import RecipeServices from "../../../services/RecipeServices";
import IngredientService from "../../../services/IngredientService";
import { useParams } from "react-router-dom";
import PaginatedTable from "../../../components/global/PaginatedTable";
import ModalSelectRecipe from "./components/ModalSelectRecipe";
import { IconButton } from "../../../components/IconButton";
import ModalAddTime from "./components/ModalAddTime";
import AlertModal from "../../../components/global/AlertModal";
import Tab from "../../../components/Tab";
import IngredientRow from "./components/IngredientRow";
import RecipeRow from "./components/RecipeRow";

const DietDetail = () => {
    const [diet, setDiet] = useState({});
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [newRecipe, setNewRecipe] = useState({ id: "", time: "desayuno" });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [alertTitle, setAlertTitle] = useState("Success");
    const [newIngredient, setNewIngredient] = useState({
        id: "",
        time: "desayuno",
    });

    const { id } = useParams();

    const onSubmitTime = async (data) => {
        const response = await DietServices.addTimeToDiet(id, data);

        if (response.success) {
            setShowAlert(true);
            setAlertMessage(response.msg);
            setAlertType("success");
            setAlertTitle("Success");
            getDietDetail();
        } else {
            setShowAlert(true);
            setAlertMessage(response.msg);
            setAlertType("error");
            setAlertTitle("Error");
        }
    };

    const getDietDetail = async () => {
        const response = await DietServices.getDietDetail(id);
        if (response.success) {
            setDiet(response.data);
        }
    };

    const handleRemoveTime = async (timeId) => {
        const response = await DietServices.removeTimeFromDiet(id, timeId);
        if (response.success) {
            setShowAlert(true);
            setAlertMessage(response.msg);
            setAlertType("success");
            setAlertTitle("Success");
            getDietDetail();
        } else {
            setShowAlert(true);
            setAlertMessage(response.msg);
            setAlertType("error");
            setAlertTitle("Error");
        }
    };

    useEffect(() => {
        const fetchDiet = async () => {
            const response = await DietServices.getDietDetail(id);
            if (response.success) {
                setDiet(response.data);
            }
        };
        if (!diet.id) {
            fetchDiet();
        }

        const fetchRecipes = async () => {
            const response = await RecipeServices.getRecipes({});
            if (response.success) {
                setRecipes(response.data);
            }
        };

        if (!recipes.length) {
            fetchRecipes();
        }

        const fetchIngredients = async () => {
            const response = await IngredientService.getIngredient({});
            if (response.success) {
                setIngredients(response.data);
            }
        };
        if (!ingredients.length) {
            fetchIngredients();
        }
    }, [id]);

    const handleAddRecipe = async () => {
        const response = await DietServices.addRecipeToDiet(id, newRecipe);
        if (response.success) {
            // Buscar la receta seleccionada para mostrar su nombre
            const selectedRecipe = recipes.find((r) => r.id === newRecipe.id);
            setDiet((prevDiet) => ({
                ...prevDiet,
                recipes: [
                    ...prevDiet.recipes,
                    {
                        id: newRecipe.id,
                        name: selectedRecipe?.name || "Receta no encontrada",
                        time: newRecipe.time,
                    },
                ],
            }));
        }
    };

    const handleRemoveRecipe = async (recipeId) => {
        const response = await DietServices.removeRecipeFromDiet(id, recipeId);
        if (response.success) {
            setDiet((prevDiet) => ({
                ...prevDiet,
                recipes: prevDiet.recipes.filter(
                    (recipe) => recipe.id !== recipeId
                ),
            }));
        }
    };

    const handleAddIngredient = async () => {
        const response = await DietServices.addIngredientToDiet(
            id,
            newIngredient
        );
        if (response.success) {
            setDiet((prevDiet) => ({
                ...prevDiet,
                ingredients: [...prevDiet.ingredients, newIngredient],
            }));
        }
    };

    return (
        <div className="lg:w-[90vw]">
            <div className="card shadow-md">
                <div className="card-body">
                    <div className="text-xl font-bold">{diet.name}</div>
                </div>
            </div>

            <div className="card shadow-md mt-4">
                <div className="card-body">
                    <div className="flex justify-between">
                        <div className="text-xl font-bold">
                            Recetas de la Dieta
                        </div>
                        <div className="flex gap-2">
                            <div>
                                <ModalAddTime
                                    onSubmitTime={onSubmitTime}
                                    dietId={id}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="tabs tabs-lift" role="tablist">
                        {diet.times && diet.times.length > 0 ? (
                            diet.times.map((time, index) => (
                                <Tab
                                    name="tabRecipes"
                                    label={time.label}
                                    checked={index === 0}
                                >
                                    <div className="flex justify-end">
                                        <ModalSelectRecipe
                                            onSubmitRecipe={handleAddRecipe}
                                            dietId={id}
                                            time={time}
                                        />
                                        <IconButton
                                            icon="delete"
                                            onclick={() =>
                                                handleRemoveTime(time.id)
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {time.recipes &&
                                        time.recipes.length > 0 ? (
                                            time.recipes.map((recipe) => (
                                                <RecipeRow recipe={recipe} />
                                            ))
                                        ) : (
                                            <p>
                                                No hay recetas agregadas a esta
                                                dieta.
                                            </p>
                                        )}
                                    </div>
                                </Tab>
                            ))
                        ) : (
                            <p>No hay recetas agregadas a esta dieta.</p>
                        )}
                    </div>
                </div>
            </div>
            <AlertModal
                title={alertTitle}
                message={alertMessage}
                type={alertType}
                isChecked={showAlert}
                setIsChecked={setShowAlert}
            />
        </div>
    );
};

export default DietDetail;
