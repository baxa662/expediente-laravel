import React, { useCallback, useEffect, useState } from "react";
import PaginatedTable from "../../../components/global/PaginatedTable";
import { Modal } from "../../../components/Modal";
import AlertModal from "../../../components/global/AlertModal";
import RecipeServices from "../../../services/RecipeServices";
import { IconButton } from "../../../components/IconButton";
import ModalAddRecipe from "./components/ModalAddRecipe";

const Recipes = () => {
  const [recipes, setRecipes] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isModalDelete, setModalDelte] = useState(false);
  const [isModalAlert, setAlertModal] = useState(false);
  const [isLoadingDelete, setIsLoadingDelte] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const headers = ["Image", "Nombre", "Acciones"];

  useEffect(() => {
    if (!recipes) {
      getRecipes();
    }
  }, [recipes]);

  const getRecipes = async (query) => {
    const params = {
      name: query,
    };

    const response = await RecipeServices.getRecipes(params);

    if (response.success) {
      setRecipes(response.data);
    }

    setLoading(false);
  };

  // Función de debounce para ejecutar la búsqueda
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Función para manejar la búsqueda
  const handleSearch = useCallback(
    debounce((query) => {
      setLoading(true);
      getRecipes(query);
    }, 500),
    []
  );

  const rowActions = (row) => (
    <div className="flex gap-2">
      <IconButton
        icon={"edit"}
        clase={"link-info"}
        ruta={`/nutricion/recipes/${row.id}`}
      />
      <IconButton
        icon={"delete"}
        clase={"link-error"}
        onclick={() => handleDeleteBtn(row.id)}
      />
    </div>
  );

  const handleDeleteBtn = (idRecipe) => {
    let inputDelete = document.getElementById("idRecipeDelete");
    inputDelete.value = idRecipe;
    setModalDelte(true);
  };

  const handleDelteRecipe = async () => {
    setIsLoadingDelte(true);
    let inputDelete = document.getElementById("idRecipeDelete");
    let idRecipe = inputDelete.value;
    const params = {
      id: idRecipe,
    };
    const response = await RecipeServices.destroy(params);

    if (response.success) {
      getRecipes();
      setAlertType("success");
      setModalDelte(false);
    } else {
      setAlertType("error");
    }

    setIsLoadingDelte(false);
    setMessage(response.msg);

    setAlertModal(true);
  };

  const onSavedRecipe = (response) => {
    getRecipes();
    console.log(response);
    setAlertType(response?.success ? "success" : "error");
    setMessage(response.msg);
    setAlertModal(true);
  };

  return (
    <div className="w-4/5 mx-auto my-4 h-screen">
      <PaginatedTable
        headers={headers}
        data={recipes ?? []}
        isLoading={isLoading}
        utilsContent={
          <>
            <ModalAddRecipe onSaved={onSavedRecipe} />
          </>
        }
        search={handleSearch}
        rowActions={rowActions}
      />
      <Modal
        isChecked={isModalDelete}
        setIsChecked={setModalDelte}
        id={"deleteIngredient"}
        title={"Advertencia"}
      >
        <div className="flex justify-center flex-col items-center">
          <div className="material-symbols-outlined text-6xl text-amber-400">
            warning
          </div>
          <div>Seguro quieres eliminar esta receta?</div>
          <input type="hidden" id="idRecipeDelete" />
          <div className="flex justify-evenly w-full">
            <button
              disabled={isLoadingDelete}
              className="btn btn-error btn-sm mt-2"
              onClick={() => setModalDelte(false)}
            >
              Cerrar
            </button>
            <button
              disabled={isLoadingDelete}
              className="btn btn-success btn-sm mt-2"
              onClick={() => handleDelteRecipe()}
            >
              {isLoadingDelete && <span className="loading loading-spinner" />}
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
      <AlertModal
        isChecked={isModalAlert}
        setIsChecked={setAlertModal}
        type={alertType}
        message={message}
      />
    </div>
  );
};

export default Recipes;
