import { useEffect, useState } from "react";
import IngredientConvertions from "../../../../helpers/IngredientConvertions";
import { IconButton } from "../../../../components/IconButton";
import IngredientInput from "./IngredientInput";
import { useForm } from "react-hook-form";
import RecipeServices from "../../../../services/RecipeServices";
import AlertModal from "../../../../components/global/AlertModal";

const IngredientCollapse = ({ ingredient, idRecipe, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [equivalentState, setEquivalent] = useState(0);
    const [amountState, setAmount] = useState(0);
    const [measure, setMeasure] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const { amount, measure } = IngredientConvertions.equivalentToAmount(
            ingredient,
            ingredient.equivalent
        );
        setAmount(amount);
        setEquivalent(ingredient.equivalent);
        setMeasure(measure);
    }, [ingredient]);

    const onChangeEquivalent = (equivalent) => {
        const { amount, measure } = IngredientConvertions.equivalentToAmount(
            ingredient,
            equivalent
        );

        setValue("amount", amount);
        setMeasure(measure);
    };

    const onChangeAmount = (amount) => {
        const { equivalent, measure } =
            IngredientConvertions.equivalentToAmount(ingredient, amount);

        setValue("equivalent", equivalent);
        setMeasure(measure);
    };

    const onDeleteIngredient = async (ingredientId) => {
        setIsDeleting(true);
        const params = {
            idRecipe: idRecipe,
            idIngredient: ingredientId,
        };
        const response = await RecipeServices.deleteRecipeIngredient(params);
        setIsDeleting(false);
        onSave(response);
    };

    const onUpdateIngredient = async (data) => {
        if (isEditing) {
            setIsSaving(true);
            const params = {
                idRecipe: idRecipe,
                idIngredient: ingredient.id,
                equivalent: data.equivalent,
            };
            const response = await RecipeServices.updateRecipeIngredient(
                params
            );
            onSave(response);
            setIsEditing(false);
            setIsSaving(false);
        } else {
            setIsEditing(true);
        }
    };

    return (
        <div key={ingredient.id} className="collapse collapse-plus bg-base-200">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-medium">
                {ingredient.name} - {measure}(s)
            </div>
            <div className="collapse-content">
                <form action="" onSubmit={handleSubmit(onUpdateIngredient)}>
                    <div className="flex flex-col gap-2">
                        <IngredientInput
                            value={equivalentState}
                            isEditing={isEditing}
                            onChange={onChangeEquivalent}
                            errors={errors}
                            register={register}
                            id={"equivalent"}
                            label={"Equivalente"}
                        />
                        <IngredientInput
                            value={amountState}
                            isEditing={isEditing}
                            onChange={onChangeAmount}
                            errors={errors}
                            register={register}
                            id={"amount"}
                            label={"Gramos"}
                        />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <IconButton
                            isLoading={isSaving}
                            clase={"btn-success"}
                            icon={isEditing ? "save" : null}
                            type={"submit"}
                        >
                            {isEditing ? "Guardar" : "Actualizar"}
                        </IconButton>
                        <IconButton
                            isLoading={isDeleting}
                            onclick={() => onDeleteIngredient(ingredient.id)}
                            clase={"btn-error"}
                        >
                            Eliminar
                        </IconButton>
                    </div>
                </form>
            </div>
            <AlertModal></AlertModal>
        </div>
    );
};

export default IngredientCollapse;
