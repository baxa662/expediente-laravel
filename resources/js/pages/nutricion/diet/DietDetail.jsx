import React, { useState, useEffect, useCallback, useRef } from "react";
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
    const [loadingDelete, setLoadingDelete] = useState(false);
    const effectRan = useRef(false);
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

    const getDietDetail = useCallback(async () => {
        const response = await DietServices.getDietDetail(id);
        if (response.success) {
            setDiet(response.data);
        }
    }, [id]);

    const handleRemoveTime = async (timeId) => {
        setLoadingDelete(true);
        const response = await DietServices.removeTimeFromDiet(id, timeId);
        setLoadingDelete(false);
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
        if (!effectRan.current) {
            getDietDetail();
            effectRan.current = true;
        }
    }, [getDietDetail]);

    const handleAddRecipe = async (recipe, idTime) => {
        const response = await DietServices.addRecipeToDiet(id, recipe, idTime);
        if (response.success) {
            // Buscar la receta seleccionada para mostrar su nombre
            // const selectedRecipe = recipes.find((r) => r.id === recipe.id);
            getDietDetail();
            // setDiet((prevDiet) => ({
            //     ...prevDiet,
            //     times: prevDiet.times.map((time) => {
            //         if (time.id === idTime) {
            //             return {
            //                 ...time,
            //                 recipes: [
            //                     ...time.recipes,
            //                     {
            //                         id: recipe.id,
            //                         name:
            //                             selectedRecipe?.name ||
            //                             "Receta no encontrada",
            //                         time: recipe.time,
            //                         ingredients: recipe.ingredients,
            //                     },
            //                 ],
            //             };
            //         }
            //         return time;
            //     }),
            // }));
        }
    };

    const handleRemoveRecipe = async (response) => {
        setShowAlert(true);
        setAlertMessage(response.msg);
        if (response.success) {
            setAlertType("success");
            setAlertTitle("Success");
            getDietDetail();
        } else {
            setAlertType("error");
            setAlertTitle("Error");
        }
    };

    const handleAddIngredient = async ({
        equivalent,
        idTime,
        idIngredient,
        idRecipe,
    }) => {
        const data = {
            equivalent: equivalent,
            idTime: idTime,
            idIngredient: idIngredient,
            idRecipe: idRecipe,
        };

        try {
            const response = await DietServices.addIngredientToDiet(id, data);
            setAlertMessage(response.msg);
            if (response.success) {
                setShowAlert(true);
                setAlertType("success");
                setAlertTitle("Success");
                getDietDetail();
                return true;
            }
            setAlertType("error");
            setAlertTitle("Error");
            return false;
        } catch (error) {
            console.error("Error adding ingredient to diet:", error);
            setShowAlert(true);
            setAlertMessage("Error adding ingredient to diet");
            setAlertType("error");
            setAlertTitle("Error");
            return false;
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
                                    key={index}
                                >
                                    <div className="flex justify-end gap-2">
                                        <ModalSelectRecipe
                                            onRecipeSelected={handleAddRecipe}
                                            time={time}
                                        />
                                        <IconButton
                                            isLoading={loadingDelete}
                                            icon="delete"
                                            clase="link-error"
                                            onclick={() =>
                                                handleRemoveTime(time.id)
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {time.recipes &&
                                        time.recipes.length > 0 ? (
                                            time.recipes.map(
                                                (recipe, indexRecipe) => (
                                                    <RecipeRow
                                                        recipe={recipe}
                                                        key={indexRecipe}
                                                        idDiet={id}
                                                        idTime={time.id}
                                                        onSaveIngredient={
                                                            handleAddIngredient
                                                        }
                                                        onDeleteRecipe={
                                                            handleRemoveRecipe
                                                        }
                                                    />
                                                )
                                            )
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
