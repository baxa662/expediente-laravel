import React, { useRef, useState, useEffect } from "react";
import { Modal } from "../../../../components/Modal";
import { IconButton } from "../../../../components/IconButton";
import { useForm } from "react-hook-form";
import { InputForm } from "../../../../components/InputForm";
import { SelectInputForm } from "../../../../components/SelectInputForm";
import IngredientService from "../../../../services/IngredientService";
import RecipeServices from "../../../../services/RecipeServices";
import { useParams } from "react-router-dom";
import IngredientConvertions from "../../../../helpers/IngredientConvertions";
import { LiveSearchComponent } from "../../../../components/liveSearchComponent";

const ModalAddIngredientRecipe = ({ onSuccess }) => {
    const [showed, setShowed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const selectIngredientRef = useRef();
    let timer;

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
        // const fetchIngredients = async () => {
        //     const response = await IngredientService.getIngredient();
        //     const data = response.data;
        //     setIngredients(data);
        // };
        // fetchIngredients();
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
                `${IngredientConvertions.formatAmount(
                    portionQuantity / portionUnit
                )} ${ingredientFound.unit}`
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

        setValue("amount", amount);
        setValue("measure", measure);
    };

    const searchIngredient = (inputValue) =>
        new Promise(async (resolve) => {
            var params = {
                query: inputValue,
                limit: 10,
                offset: 0,
            };

            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(async () => {
                const response = await IngredientService.getIngredient(params);
                const services = response.data.map((element) => {
                    return {
                        value: element.id,
                        label: `${element.name} - ${element.unit}`,
                    };
                });
                resolve(services);
            }, 800);
        });

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
                    <LiveSearchComponent
                        onChange={(e) => onIngredientChange(e?.value)}
                        placeholder="Buscar ingrediente"
                        loadOptions={searchIngredient}
                        label="Ingrediente"
                        id="ingredient"
                        required={"Este campo es obligatorio"}
                        errors={errors}
                        register={register}
                        setValue={setValue}
                        inputRef={selectIngredientRef}
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
