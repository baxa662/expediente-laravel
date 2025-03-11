import React, { useCallback, useEffect, useState } from "react";
import PaginatedTable from "../../../components/global/PaginatedTable";
import ModalNewIngredient from "./components/ModalNewIngredient";
import IngredientService from "../../../services/IngredientService";
import { IconButton } from "../../../components/IconButton";
import { Modal } from "../../../components/Modal";
import AlertModal from "../../../components/global/AlertModal";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isModalDelete, setModalDelte] = useState(false);
  const [isModalAlert, setAlertModal] = useState(false);
  const [isLoadingDelete, setIsLoadingDelte] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    if (ingredients == null) {
      getIngredients();
    }
  }, [ingredients]);

  const getIngredients = async (query = "") => {
    try {
      const params = {
        query: query,
      };

      const response = await IngredientService.getIngredient(params);

      const ingredients = response['data'].map((e) => ({
        'id': e.id,
        'name': e.name,
        'category': e.category,
        'unit': e.unit,
      }))

      setIngredients(ingredients);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIngredients([]);
    }
  };

  const headers = ["ID", "Nombre", "Categoria", "Unidad","Acciones"];

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
      getIngredients(query);
    }, 500),
    []
  );

  const handleDeleteBtn = async (idIngredient) => {
    let inputDelete = document.getElementById("idIngredientDelete");
    inputDelete.value = idIngredient;
    setModalDelte(true);
  };

  const handleDelteIngredient = async () => {
    setIsLoadingDelte(true);
    let inputDelete = document.getElementById("idIngredientDelete");
    let idIngredient = inputDelete.value;
    const params = {
      id: idIngredient,
    };
    const response = await IngredientService.deleteIngredient(params);

    if (response.success) {
      getIngredients();
      setAlertType("success");
      setModalDelte(false);
    } else {
      setAlertType("error");
    }

    setIsLoadingDelte(false);
    setMessage(response.msg);

    setAlertModal(true);
  };

  const rowActions = (row) => (
    <div className="flex gap-2">
      <IconButton
        icon={"edit"}
        clase={"link-info"}
        ruta={`/nutricion/ingredients/${row.id}`}
      />
      <IconButton
        icon={"delete"}
        clase={"link-error"}
        onclick={() => handleDeleteBtn(row.id)}
      />
    </div>
  );

  return (
    <div className="w-4/5 mx-auto my-4 h-screen">
      <PaginatedTable
        headers={headers}
        data={ingredients ?? []}
        isLoading={isLoading}
        utilsContent={
          <div>
            <ModalNewIngredient onSuccess={() => getIngredients()} />
          </div>
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
          <div>Seguro quieres eliminar este ingrediente?</div>
          <input type="hidden" id="idIngredientDelete" />
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
              onClick={() => handleDelteIngredient()}
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

export default Ingredients;
