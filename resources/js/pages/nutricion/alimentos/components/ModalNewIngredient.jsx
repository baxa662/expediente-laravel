import React, { useEffect, useState } from "react";
import { Modal } from "../../../../components/Modal";
import { InputForm } from "../../../../components/InputForm";
import { IconButton } from "../../../../components/IconButton";
import { useForm } from "react-hook-form";
import { SelectInputForm } from "../../../../components/SelectInputForm";
import CategoryService from "../../../../services/CategoryService";
import IngredientService from "../../../../services/IngredientService";

const ModalNewIngredient = ({ onSuccess }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (categories == null) {
      getCategories();
    }
  }, [categories]);

  const handleOpenModal = () => {
    setIsVisible(true);
  };

  const onSubmitNewIngredient = async (data) => {
    setLoading(true);
    try {
      const response = await IngredientService.create(data);
      setIsVisible(false);
      onSuccess();
      setMessage(response.msg);
    } catch (error) {
      console.error(error);
      setMessage("Ocurrio un error al enviar el alimento!");
    }
    setModalMessage(true);
    setLoading(false);
  };

  const getCategories = async () => {
    try {
      const response = await CategoryService.getCategories(null);
      setCategories(response["data"]);
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };

  return (
    <div>
      <IconButton
        icon="add_circle"
        children={"Ingrediente"}
        clase="btn-outline"
        id={"openModal"}
        onclick={handleOpenModal}
      />
      <Modal
        id={"newIngredient"}
        isChecked={isVisible}
        setIsChecked={setIsVisible}
        title={"Nuevo Ingrediente"}
        key={"modal"}
      >
        <form action="" onSubmit={handleSubmit(onSubmitNewIngredient)}>
          <InputForm
            register={register}
            type="text"
            label={"Nombre"}
            id={"name"}
            required={"Este campo es requerido"}
            errors={errors}
          />
          <SelectInputForm
            register={register}
            label={"Categoria"}
            id={"category"}
            required={"Este campo es requerido"}
            // required={false}
            options={categories ?? []}
            errors={errors}
          />
          <div className="mt-4">
            <button type="submit" className="btn w-full">
              {isLoading && <span class="loading loading-spinner"></span>}
              Enviar
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        id={"modalMessage"}
        isChecked={modalMessage}
        setIsChecked={setModalMessage}
        title={"Operacion terminada!"}
        key={"modalMessage"}
      >
        <p>{message}</p>
      </Modal>
    </div>
  );
};

export default ModalNewIngredient;
