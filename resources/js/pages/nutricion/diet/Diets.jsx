import React, { useCallback, useEffect, useState } from "react";
import PaginatedTable from "../../../components/global/PaginatedTable";
import { Modal } from "../../../components/Modal";
import AlertModal from "../../../components/global/AlertModal";
import DietServices from "../../../services/DietServices";
import { IconButton } from "../../../components/IconButton";
import ModalAddDiet from "./components/ModalAddDiet";

const Diets = () => {
  const [diets, setDiets] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isModalDelete, setModalDelte] = useState(false);
  const [isModalAlert, setAlertModal] = useState(false);
  const [isLoadingDelete, setIsLoadingDelte] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const headers = ["ID", "Nombre", "Acciones"];

  useEffect(() => {
    if (!diets) {
     getDiets();
    }
  }, [diets]);

  const getDiets = async (query) => {
    const params = {
      name: query,
    };

    const response = await DietServices.getDiets(params);

    if (response.success) {
      setDiets(response.data.map((diet) => ({ id: diet.id, name: diet.name })));
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
      getDiets(query);
    }, 500),
    []
  );

  const rowActions = (row) => (
    <div className="flex gap-2">
      <IconButton
        icon={"edit"}
        clase={"link-info"}
        ruta={`/nutricion/diets/${row.id}`}
      />
      <IconButton
        icon={"delete"}
        clase={"link-error"}
        onclick={() => handleDeleteBtn(row.id)}
      />
    </div>
  );

  const handleDeleteBtn = (idDiet) => {
    let inputDelete = document.getElementById("idDietDelete");
    inputDelete.value = idDiet;
    setModalDelte(true);
  };

  const handleDeleteDiet = async () => {
    setIsLoadingDelte(true);
    let inputDelete = document.getElementById("idDietDelete");
    let idDiet = inputDelete.value;
    const params = {
      id: idDiet,
    };
    const response = await DietServices.destroy(params);

    if (response.success) {
      getDiets();
      setAlertType("success");
      setModalDelte(false);
    } else {
      setAlertType("error");
    }

    setIsLoadingDelte(false);
    setMessage(response.msg);

    setAlertModal(true);
  };

  const onSavedDiet = (response) => {
    getDiets();
    console.log(response);
    setAlertType(response?.success ? "success" : "error");
    setMessage(response.msg);
    setAlertModal(true);
  };

  return (
    <div className="w-4/5 mx-auto my-4 h-screen">
      <PaginatedTable
        headers={headers}
        data={diets ?? []}
        isLoading={isLoading}
        utilsContent={
          <>
            <ModalAddDiet onSaved={onSavedDiet} />
          </>
        }
        search={handleSearch}
        rowActions={rowActions}
      />
      <Modal
        isChecked={isModalDelete}
        setIsChecked={setModalDelte}
        id={"deleteDiet"}
        title={"Advertencia"}
      >
        <div className="flex justify-center flex-col items-center">
          <div className="material-symbols-outlined text-6xl text-amber-400">
            warning
          </div>
          <div>Seguro quieres eliminar esta dieta?</div>
          <input type="hidden" id="idDietDelete" />
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
              onClick={() => handleDeleteDiet()}
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

export default Diets;
