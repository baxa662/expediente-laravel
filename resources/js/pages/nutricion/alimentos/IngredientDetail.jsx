import React, { useEffect, useState } from "react";
import Property from "./components/Property";
import { IconButton } from "../../../components/IconButton";
import ModalAddNutrient from "./components/ModalAddNutrient";
import { Modal } from "../../../components/Modal";
import AlertModal from "../../../components/global/AlertModal"; // Importar el nuevo componente
import IngredientService from "../../../services/IngredientService";
import { useParams } from "react-router-dom";
import CategoryService from "../../../services/CategoryService";
import IngredientUnitService from "../../../services/IngredientUnitService";

const IngredientDetail = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [ingredient, setIngredient] = useState();
  const [categories, setCategories] = useState();
  const [units, setUnits] = useState();
  const [saving, setSaving] = useState(false);

  const { id } = useParams();

  const openMessageModal = (text, type = "success") => {
    setModalMessage(true);
    setMessage(text);
    setAlertType(type);
  };

  const onAddNutrient = async (text, type = "success") => {
    await getIngredient();
    openMessageModal(text, type);
  };

  useEffect(() => {
    if (!ingredient) {
      getIngredient();
    }

    if (!categories) {
      getCategories();
    }

    if (!units) {
      getUnits();
    }
  }, [ingredient, categories, units]);

  const getUnits = async () => {
    const response = await IngredientUnitService.get();
    setUnits(response["data"]);
  };

  const getCategories = async () => {
    const response = await CategoryService.getCategories();
    setCategories(response["data"]);
  };

  const getIngredient = async () => {
    const params = {
      idIngredient: id,
    };
    const response = await IngredientService.getDetail(params);

    setIngredient(response["data"]);
  };

  const handleEditBtn = async () => {
    if (isEdit) {
      setSaving(true);

      const ingredientNameEle = document.querySelector(
        "[name='ingredientName']"
      );
      const ingredientCategoryEle = document.querySelector(
        "[name='ingredientCategory']"
      );
      const portionQuantityEqualEle = document.querySelector(
        "[name='portionQuantity']"
      );
      const unitIngredientEle = document.querySelector(
        "[name='unitIngredient']"
      );
      const portionUnitEle = document.querySelector("[name='portionUnit']");
      const nutrientsEle = document.querySelectorAll("[name='nutrient']");
      const nutrientsIdEle = document.querySelectorAll("[name='nutrient-id']");

      const ingredientName = ingredientNameEle.value;
      const ingredientCategory = ingredientCategoryEle.value;
      const portionQuantity = portionQuantityEqualEle.value;
      const portionUnit = portionUnitEle.value;
      const unitIngredient = unitIngredientEle.value;

      const nutrients = [];

      for (let i = 0; i < nutrientsEle.length; i++) {
        const amountEle = nutrientsEle[i];
        const idEle = nutrientsIdEle[i];

        nutrients.push({
          amount: amountEle.value,
          id: idEle.value,
        });
      }

      const params = {
        idIngredient: id,
        name: ingredientName,
        portionQuantity: portionQuantity,
        idUnit: unitIngredient,
        portionUnit: portionUnit,
        category: ingredientCategory,
        nutrients: nutrients,
      };

      const response = await IngredientService.update(params);

      if (response.success) {
        await getIngredient();
        setIsEdit(!isEdit);
      }

      openMessageModal(
        response.success ? response.msg : response.message,
        response.success ? "success" : "error"
      );

      setSaving(false);
    } else {
      setIsEdit(!isEdit);
    }
  };

  const handleDeleteNutrientBtn = async (idNutrient) => {
    const params = {
      idIngredient: id,
      idNutrient: idNutrient,
    };
    setModalLoading(true);

    const response = await IngredientService.deleteNutrient(params);

    if (response.success) {
      await getIngredient();
    }

    setModalLoading(false);

    openMessageModal(
      response.success ? response.msg : response.message,
      response.success ? "success" : "error"
    );
  };

  return (
    <div className="lg:w-[90vw]">
      <div className="card shadow-md">
        <div className="card-body">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1">
              <Property
                label={"Nombre Alimento"}
                value={ingredient?.name ?? ""}
                isEdit={isEdit}
                name={"ingredientName"}
              />
            </div>
            <div className="col-span-1">
              <Property
                label={"Categoria"}
                value={ingredient?.category.name ?? ""}
                isEdit={isEdit}
                name={"ingredientCategory"}
                isSelect={true}
                options={categories}
                idSelected={ingredient?.category.id}
              />
            </div>
            <div className="col-span-1">
              <Property
                label={"Unidad Casera"}
                value={ingredient?.unit.name ?? ""}
                isEdit={isEdit}
                name={"unitIngredient"}
                isSelect={true}
                idSelected={ingredient?.idUnit}
                options={units}
              />
            </div>
            <div className="col-span-1">
              <div className="flex items-center">
                <i className="material-symbols-outlined pl-2 pr-2">
                  arrow_forward
                </i>
                <Property
                  label={"Porcion (g)"}
                  value={ingredient?.portionUnit}
                  isEdit={isEdit}
                  name={"portionUnit"}
                />
              </div>
            </div>
            <div className="col-span-1">
              <Property
                label={"Cantidad por porcion (Equivalente)"}
                value={ingredient?.portionQuantity}
                isEdit={isEdit}
                name={"portionQuantity"}
              />
            </div>
          </div>
        </div>
        <div className="card-actions px-6 py-2 justify-end">
          <ModalAddNutrient onComplete={onAddNutrient} />
          <IconButton
            icon={isEdit ? "save" : "edit"}
            children={isEdit ? "Guardar" : "Editar"}
            clase={(isEdit ? "btn-success" : "btn-info") + " btn-outline"}
            isLaoding={saving}
            onclick={() => handleEditBtn()}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {ingredient ? (
            <div className="grid grid-cols-6 gap-4">
              {ingredient.nutrients.map((e) => (
                <div className="card shadow-md">
                  <div className="p-3">
                    <Property
                      label={`${e.name} (${e.unit})`}
                      value={e.amount}
                      isEdit={isEdit}
                      name={"nutrient"}
                      id={e.id}
                    />
                    <IconButton
                      clase="link-error w-full"
                      icon={"delete"}
                      onclick={() => handleDeleteNutrientBtn(e.id)}
                    >
                      Borrar
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center w-full">
              <progress className="progress w-56"></progress>
            </div>
          )}
        </div>
      </div>
      <Modal
        isChecked={modalLoading}
        setIsChecked={setModalLoading}
        title={"Cargando"}
      >
        <div className="flex justify-center items-center w-full">
          <progress className="progress w-56"></progress>
        </div>
      </Modal>
      <AlertModal
        isChecked={modalMessage}
        setIsChecked={setModalMessage}
        type={alertType}
        message={message}
      />
    </div>
  );
};

export default IngredientDetail;
