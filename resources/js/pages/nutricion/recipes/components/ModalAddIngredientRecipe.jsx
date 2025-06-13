import React, { useState, useEffect } from "react";
import { Modal } from "../../../../components/Modal";
import { IconButton } from "../../../../components/IconButton";
import { useForm } from "react-hook-form";
import { InputForm } from "../../../../components/InputForm";
import { SelectInputForm } from "../../../../components/SelectInputForm";
import IngredientService from "../../../../services/IngredientService";
import RecipeServices from "../../../../services/RecipeServices";
import { useParams } from "react-router-dom";
import IngredientConvertions from "../../../../helpers/IngredientConvertions";

const ModalAddIngredientRecipe = ({ onSuccess }) => {
    const [showed, setShowed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);

        const params = {
            idRecipe: id,
            idIngredient: data.ingredient,
            equivalent: data.equivalent,
        };

        const response = await RecipeServices.saveRecipeIngredient(params);
        setIsLoading(false);
        setShowed(false);
        onSuccess(response);
    };

    const onIngredientChange = async (idIngredient) => {
        const ingredientFound = ingredients.find((e) => e.id == idIngredient);

        if (ingredientFound) {
            const equivalent =
                ingredientFound.portionQuantity / ingredientFound.portionUnit;
            const portionQuantity = ingredientFound.portionQuantity;
            const portionUnit = ingredientFound.portionUnit;

            setSelectedIngredient(ingredientFound);
            setValue("amount", portionQuantity);
            setValue(
                "equivalent",
                (portionQuantity / (equivalent * portionUnit)).toFixed(1)
            );
            setValue(
                "measure",
                `${formatAmount(portionQuantity / portionUnit)} ${
                    ingredientFound.unit
                }`
            );
        }
    };

    const onAmountChange = (value) => {
        const { equivalent, measure } =
            IngredientConvertions.amountToEquivalent(selectedIngredient, value);

        setValue("equivalent", equivalent);
        setValue("measure", measure);
    };

    const onEquivalentChange = (value) => {
        const { amount, measure } = IngredientConvertions.equivalentToAmount(
            selectedIngredient,
            value
        );

        console.log(measure);

        setValue("amount", amount);
        setValue("measure", measure);
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
                    <IconButton
                        type={"submit"}
                        clase={"w-full mt-4 btn-success h-10 text-white"}
                        isLoading={isLoading}
                    >
                        Guardar
                    </IconButton>
                </form>
            </Modal>
        </>
    );
};

export default ModalAddIngredientRecipe;
