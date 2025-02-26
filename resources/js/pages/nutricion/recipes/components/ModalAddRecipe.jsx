import React, { useState } from "react";
import { IconButton } from "../../../../components/IconButton";
import { Modal } from "../../../../components/Modal";
import { useForm } from "react-hook-form";
import { InputForm } from "../../../../components/InputForm";
import RecipeServices from "../../../../services/RecipeServices";

const ModalAddRecipe = ({ onSaved }) => {
  const [showed, setShowed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmitNewRecipe = async (data) => {
    setIsSaving(true);

    const params = {
      name: data.name,
    };

    const response = await RecipeServices.saveRecipe(params);

    if (response.success) {
      setShowed(false);
      reset();
    }

    onSaved(response);
    setIsSaving(false);
  };

  return (
    <>
      <IconButton
        icon={"add"}
        clase={" btn-outline"}
        onclick={() => setShowed(true)}
      />
      <Modal
        isChecked={showed}
        setIsChecked={setShowed}
        title={"Agregar Receta"}
      >
        <form onSubmit={handleSubmit(onSubmitNewRecipe)}>
          <InputForm
            register={register}
            errors={errors}
            label={"Nombre"}
            id={"name"}
            required={"Este campo es requerido"}
          />
          <div className="mt-3">
            <button
              disabled={isSaving}
              type="submit"
              className="btn btn-success w-full text-white"
            >
              {isSaving && <span className="loading loading-spinner"></span>}
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ModalAddRecipe;
