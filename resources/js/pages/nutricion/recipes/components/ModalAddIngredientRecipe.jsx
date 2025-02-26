import React, { useState, useEffect } from "react";
import { Modal } from "../../../../components/Modal";
import { IconButton } from "../../../../components/IconButton";
import { useForm } from "react-hook-form";
import { InputForm } from "../../../../components/InputForm";
import { SelectInputForm } from "../../../../components/SelectInputForm";
import IngredientService from "../../../../services/IngredientService";
import RecipeServices from "../../../../services/RecipeServices";
import { useParams } from "react-router-dom";

const ModalAddIngredientRecipe = ({onSuccess}) => {
  const [showed, setShowed] = useState(false);
  const [isLaoding, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const { id } = useParams();

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
    setIsLoading(true)

    const params = {
      idRecipe: id,
      idIngredient: data.ingredient,
      equivalent: data.equivalent
    }

    const response = await RecipeServices.saveRecipeIngredient(params);
    setIsLoading(false)
    setShowed(false)
    onSuccess(response)
  };

  const onIngredientChange = async (idIngredient) => {
    const ingredientFound = ingredients.find((e) => e.id == idIngredient);

    if (ingredientFound) {
      const equivalent = ingredientFound.portionQuantity / ingredientFound.portionUnit;
      const portionQuantity = ingredientFound.portionQuantity;
      const portionUnit = ingredientFound.portionUnit;

      setSelectedIngredient(ingredientFound);
      setValue("amount", portionQuantity);
      setValue("equivalent", (portionQuantity / (equivalent * portionUnit)).toFixed(1));
      setValue('measure', `${formatAmount(portionQuantity / portionUnit)} ${ingredientFound.unit}`);
    }
  };

  const onAmountChange = (value) => {
    const portionUnit = selectedIngredient.portionUnit;
    const equivalent = selectedIngredient.portionQuantity / selectedIngredient.portionUnit;
    
    const newEquivalent = (value / (equivalent * portionUnit)).toFixed(1);

    setValue('equivalent', newEquivalent)
    setValue('measure', `${formatAmount(value / portionUnit)} ${selectedIngredient.unit}`);
  }
  
  const onEquivalentChange = (value) => {
    const portionUnit = selectedIngredient.portionUnit;
    const equivalent = selectedIngredient.portionQuantity / selectedIngredient.portionUnit;

    const newAmount = value * portionUnit * equivalent;

    setValue('amount', newAmount);
    setValue('measure', `${formatAmount(newAmount / portionUnit)} ${selectedIngredient.unit}`);
  }


  const convertToFraction = (decimal) => {
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    const len = decimal.toString().length - 2;
    const denominator = Math.pow(10, len);
    const numerator = Math.ceil(decimal * denominator); // Round up the numerator
    const divisor = gcd(numerator, denominator);
    return `${Math.ceil(numerator / divisor)}/${Math.ceil(denominator / divisor)}`;
  };

  const formatAmount = (amount) => {
    const integerPart = Math.floor(amount);
    const decimalPart = amount - integerPart;

    if (decimalPart === 0) {
      return `${integerPart}`;
    }

    const commonFractions = {
      0.125: "1/8",
      0.25: "1/4",
      0.333: "1/3",
      0.5: "1/2",
      0.667: "2/3",
      0.75: "3/4",
    };

    const fractionKeys = Object.keys(commonFractions).map(Number);
    let closestFraction = fractionKeys.reduce((prev, curr) => 
      Math.abs(curr - decimalPart) < Math.abs(prev - decimalPart) ? curr : prev
    );

    if (decimalPart - closestFraction > 0.2) {
      const nextFractionIndex = fractionKeys.indexOf(closestFraction) + 1;
      if (nextFractionIndex < fractionKeys.length) {
        closestFraction = fractionKeys[nextFractionIndex];
      } else {
        return `${integerPart + 1}`;
      }
    }

    const fraction = commonFractions[closestFraction] || convertToFraction(decimalPart);
    return integerPart > 0 ? `${integerPart} ${fraction}` : fraction;
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
          <div className="flex gap-4">
          <InputForm
              register={register}
              errors={errors}
              label={"Equivalente"}
              id={"equivalent"}
              required={"Este campo es obligatorio"}
              type={"number"}
              onChange={(e) => onEquivalentChange(e.target.value)}
            />
            <InputForm
              register={register}
              errors={errors}
              label={"Cantidad"}
              id={"amount"}
              required={"Este campo es obligatorio"}
              type={"number"}
              onChange={(e) => onAmountChange(e.target.value)}
            />
          </div>
          <InputForm
            register={register}
            errors={errors}
            id={"measure"}
            label={"Medida"}
            disabled
          />
          <IconButton type={"submit"} clase={"w-full mt-4 btn-success h-10 text-white"} isLaoding={isLaoding}>Guardar</IconButton>
        </form>
      </Modal>
    </>
  );
};

export default ModalAddIngredientRecipe;
