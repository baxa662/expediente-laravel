import React, { useState, useEffect } from "react";
import { Modal } from "../../../../components/Modal";
import { IconButton } from "../../../../components/IconButton";
import { useForm } from "react-hook-form";
import { InputForm } from "../../../../components/InputForm";
import { SelectInputForm } from "../../../../components/SelectInputForm";
import IngredientService from "../../../../services/IngredientService";

const ModalAddIngredientRecipe = () => {
  const [showed, setShowed] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [equivalent, setEquivalent] = useState(null);
  const [amount, setAmount] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Simulación de llamada a API para obtener ingredientes
    const fetchIngredients = async () => {
      const response = await IngredientService.getIngredient();
      const data = response.data;
      setIngredients(data);
    };

    fetchIngredients();
  }, []);

  const onSubmitAddIngredient = async (data) => {
    console.log(data);
  };

  const onIngredientChange = async (idIngredient) => {
    const ingredientFound = ingredients.find((e) => e.id == idIngredient);

    if (ingredientFound) {
      setSelectedIngredient(ingredientFound);
      setValue("amount", ingredientFound.portionQuantity);
    }
  };

  return (
    <>
      <IconButton
        icon={"add"}
        clase={"btn-outline"}
        onclick={() => setShowed(true)}
      >
        Ingrediente
      </IconButton>
      <Modal
        setIsChecked={setShowed}
        isChecked={showed}
        title={"Añadir ingrediente"}
      >
        <form onSubmit={handleSubmit(onSubmitAddIngredient)}>
          <SelectInputForm
            register={register}
            required={"Este campo es obligatorio"}
            errors={errors}
            options={ingredients.map((e) => ({
              id: e.id,
              name: `${e.name} - ${e.unit}`,
            }))}
            label={"Ingrediente"}
            id={"ingredient"}
            onChange={(e) => onIngredientChange(e.target.value)}
          />
          <div className="flex">
            <InputForm
              register={register}
              errors={errors}
              label={"Cantidad"}
              id={"amount"}
              required={"Este campo es obligatorio"}
              type={"number"}
            />
            <div className=" w-20">
              <div className="flex justify-center items-center">
                <div>O</div>
              </div>
            </div>
            <InputForm
              register={register}
              errors={errors}
              label={"Equivalente"}
              id={"equivalent"}
              required={"Este campo es obligatorio"}
              type={"number"}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ModalAddIngredientRecipe;
