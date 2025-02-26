import React, { useEffect, useState } from "react";
import { Modal } from "../../../../components/Modal";
import { IconButton } from "../../../../components/IconButton";
import { SelectInputForm } from "../../../../components/SelectInputForm";
import { useForm } from "react-hook-form";
import { InputForm } from "../../../../components/InputForm";
import NutrientsService from "../../../../services/NutrientsService";
import { useParams } from "react-router-dom";
import IngredientService from "../../../../services/IngredientService";

const ModalAddNutrient = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nutrients, setNutrients] = useState(null);

  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmitAddNutrient = async (data) => {
    setIsLoading(true);
    const params = {
      idNutrient: data.nutrientField,
      idIngredient: id,
      amount: data.amount,
    };
    const response = await IngredientService.setNutrient(params);
    await onComplete(response.msg, response.success ? "success" : "error");

    if (response.success) {
      setIsVisible(false);
      reset();
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (nutrients == null) {
      getNutrients();
    }
  }, [nutrients]);

  const getNutrients = async () => {
    const data = await NutrientsService.getNutrient();
    setNutrients(
      data["data"].map((e) => ({
        name: `${e.name} (${e.unit})`,
        id: e.id,
      }))
    );
  };

  return (
    <div>
      <IconButton
        icon={"add"}
        children={"Nutriente"}
        clase={"btn-outline"}
        onclick={() => setIsVisible(true)}
      />
      <Modal
        isChecked={isVisible}
        setIsChecked={setIsVisible}
        title={"Añadir Nutriente"}
        id={"modalAddNutrient"}
      >
        <form action="" onSubmit={handleSubmit(onSubmitAddNutrient)}>
          <SelectInputForm
            options={nutrients ?? []}
            register={register}
            required={"Por favor, selecciona un nutriente"}
            id={"nutrientField"}
            label={"Selecciona un nutriente"}
            errors={errors}
          />
          <InputForm
            label={"Cantidad"}
            id={"amount"}
            register={register}
            errors={errors}
            required={"Por favor, ingresa una cantidad"}
          />
          <div className="mt-4">
            <button type="submit" className="btn w-full">
              {isLoading && <span class="loading loading-spinner"></span>}
              Enviar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ModalAddNutrient;
