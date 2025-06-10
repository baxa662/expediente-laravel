import React, { useState, useEffect } from "react";
import Tab from "../../../components/Tab";
import ModalAddIngredientRecipe from "./components/ModalAddIngredientRecipe";
import AlertModal from "../../../components/global/AlertModal";
import RecipeServices from "../../../services/RecipeServices";
import { useParams } from "react-router-dom";
import IngredientCollapse from "./components/IngredientCollapse";
import { IconButton } from "../../../components/IconButton";

const RecipeDetail = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setalertMessage] = useState("");
    const [alertType, setalertType] = useState("");
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [newPdfFile, setNewPdfFile] = useState(null);

    const refreshRecipeDetail = async () => {
        const response = await RecipeServices.getRecipeDetail(id);
        if (response.success) {
            setRecipe(response.data);
        } else {
            setalertMessage(
                response.message || "Error fetching recipe details"
            );
            setalertType("error");
            setShowAlert(true);
        }
    };

    useEffect(() => {
        if (recipe == null) {
            refreshRecipeDetail();
        }
    }, [recipe]);

    useEffect(() => {
        if (recipe?.pdf_path) {
            setPdfFile(recipe.pdf_path);
        }
    }, [recipe]);

    const onSuccessAddIngredient = async (response) => {
        setalertMessage(
            response.success
                ? response.msg
                : response.message
                ? response.message
                : "Ocurrio un error al asignar el ingrediente"
        );
        setalertType(response.success ? "success" : "error");
        setShowAlert(true);
        refreshRecipeDetail();
    };

    const handleEditName = () => {
        setIsEditingName(true);
        setNewRecipeName(recipe?.name || "");
    };

    const handleSaveName = async () => {
        const params = {
            id: id,
            name: newRecipeName,
        };

        setIsUpdating(true);

        const response = await RecipeServices.update(params);
        if (response.success) {
            setRecipe({ ...recipe, name: newRecipeName });
            setIsEditingName(false);
        } else {
            setalertMessage(response.message || "Error updating recipe name");
            setalertType("error");
            setShowAlert(true);
        }

        setIsUpdating(false);
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleSaveImage = async () => {
        if (!newImage) return;

        const formData = new FormData();
        formData.append("image", newImage);
        formData.append("id", id);

        setIsUpdating(true);

        const response = await RecipeServices.updateRecipeImage(formData);
        if (response.success) {
            refreshRecipeDetail();
        } else {
            setalertMessage(response.message || "Error updating recipe image");
            setalertType("error");
            setShowAlert(true);
        }

        setIsUpdating(false);
    };

    const handlePdfChange = (e) => {
        setNewPdfFile(e.target.files[0]);
    };

    const handleSavePdf = async () => {
        if (!newPdfFile) return;

        const formData = new FormData();
        formData.append("pdf", newPdfFile);
        formData.append("id", id);

        setIsUpdating(true);

        const response = await RecipeServices.updateRecipePdf(formData);
        if (response.success) {
            setPdfFile(response.data.pdf_path);
        } else {
            setalertMessage(response.message || "Error updating recipe pdf");
            setalertType("error");
            setShowAlert(true);
        }

        setIsUpdating(false);
    };

    return (
        <div className="px-4">
            <div className="card shadow-md">
                <div className="card-body p-4">
                    <div className="p-5 flex flex-col md:flex-row justify-start">
                        <div className="">
                            <img
                                src={`${recipe?.image_path}`}
                                alt="Recipe"
                                className="h-40"
                            />
                        </div>
                        <div className="flex-1 md:ml-5 mt-5 md:mt-0">
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={newRecipeName}
                                    onChange={(e) =>
                                        setNewRecipeName(e.target.value)
                                    }
                                    className="input input-bordered"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold">
                                    {recipe?.name}
                                </h2>
                            )}
                            <p>
                                Creada en:{" "}
                                {recipe?.created_at &&
                                    new Date(recipe?.created_at)
                                        .toISOString()
                                        .split("T")[0]}
                            </p>
                        </div>
                    </div>
                    <div className="card-actions justify-between items-center">
                        <div className="flex flex-col">
                            <input
                                type="file"
                                className="file-input w-full file-input-sm max-w-xs"
                                onChange={handleImageChange}
                            />
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleSaveImage}
                            >
                                Cambiar imagen
                            </button>
                        </div>
                        {isEditingName ? (
                            <IconButton
                                onclick={handleSaveName}
                                isLaoding={isUpdating}
                                clase={"btn-success text-white"}
                                icon={"save"}
                            >
                                Guardar
                            </IconButton>
                        ) : (
                            <IconButton
                                onclick={handleEditName}
                                clase={"btn-success text-white"}
                                icon={"edit"}
                            >
                                Editar nombre
                            </IconButton>
                        )}
                    </div>
                </div>
            </div>

            <div role="tablist" className="tabs tabs-lift mt-5">
                <Tab name="tabRecipe" label="Ingredientes" checked>
                    <div className="flex mb-4">
                        <ModalAddIngredientRecipe
                            onSuccess={onSuccessAddIngredient}
                        />
                    </div>
                    {recipe?.ingredients.map((ingredient) => {
                        return (
                            <IngredientCollapse
                                ingredient={ingredient}
                                idRecipe={id}
                                onSave={onSuccessAddIngredient}
                            />
                        );
                    })}
                </Tab>
                <Tab name="tabRecipe" label="Preparación">
                    <div className="flex flex-col">
                        <input
                            type="file"
                            accept="application/pdf"
                            className="file-input w-full file-input-sm max-w-xs"
                            onChange={handlePdfChange}
                        />
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleSavePdf}
                        >
                            Cargar PDF
                        </button>
                    </div>
                    {pdfFile ? (
                        <iframe
                            src={`${pdfFile}`}
                            title="Recipe PDF"
                            className="w-full h-[40rem] mt-4"
                        />
                    ) : (
                        <p className="mt-4">
                            No se ha cargado ningún PDF. Por favor, cargue uno.
                        </p>
                    )}
                </Tab>
            </div>
            <AlertModal
                isChecked={showAlert}
                setIsChecked={setShowAlert}
                message={alertMessage}
                type={alertType}
            />
        </div>
    );
};

export default RecipeDetail;
