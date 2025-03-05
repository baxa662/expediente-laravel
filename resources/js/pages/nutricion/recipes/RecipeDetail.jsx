import React, { useState, useEffect } from "react";
import Tab from "../../../components/Tab";
import { IconButton } from "../../../components/IconButton";
import ModalAddIngredientRecipe from "./components/ModalAddIngredientRecipe";
import AlertModal from "../../../components/global/AlertModal";
import RecipeServices from "../../../services/RecipeServices";
import { useParams } from "react-router-dom";
import IngredientConvertions from "../../../helpers/IngredientConvertions";
import IngredientCollapse from "./components/IngredientCollapse";

const RecipeDetail = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setalertMessage] = useState('');
  const [alertType, setalertType] = useState('');
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();

  const refreshRecipeDetail = async () => {
    const response = await RecipeServices.getRecipeDetail(id);
    if (response.success) {
      setRecipe(response.data);
    } else {
      setalertMessage(response.message || 'Error fetching recipe details');
      setalertType('error');
      setShowAlert(true);
    }
  };

  useEffect(() => {
    refreshRecipeDetail();
  }, [id]);

  const onSuccessAddIngredient = async (response) => {
    setalertMessage(response.success ? response.msg : response.message ? response.message : 'Ocurrio un error al asignar el ingrediente');
    setalertType(response.success ? 'success' : 'error');
    setShowAlert(true);
    refreshRecipeDetail();
  };

  return (
    <div className="px-4">
      <div className="card shadow-md">
        <div className="p-5 flex flex-col md:flex-row justify-around">
          <div className="md:ml-5 mt-5 md:mt-0">
            <h2 className="text-2xl font-bold">{recipe?.name}</h2>
            {/* <p>Creada en: {new Date(recipe?.created_at).toISOString().split('T')[0]}</p> */}
          </div>
          <div className="">
            <img
              src="recipe-photo-url"
              alt="Recipe"
              className="w-full h-auto"
            />
            <button className="btn btn-primary btn-sm">Cambiar imagen</button>
          </div>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-lifted mt-5">
        <Tab name="tabRecipe" label="Ingredientes" checked>
          <div className="flex mb-4">
            <ModalAddIngredientRecipe 
              onSuccess={onSuccessAddIngredient}
            />
          </div>
          {recipe?.ingredients.map((ingredient) => { 
            return (
               <IngredientCollapse ingredient={ingredient} idRecipe={id}/>
          )}
          )}
        </Tab>
        <Tab name="tabRecipe" label="Preparación">
          Prep
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
