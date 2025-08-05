import React, { useEffect, useState } from "react";
import { IconButton } from "../../../../components/IconButton";
import IngredientConvertions from "../../../../helpers/IngredientConvertions";
import DietServices from "../../../../services/DietServices";

const IngredientRow = ({ ingredient, onSave, idDiet, idRecipe, idTime }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [equivalent, setEquivalent] = useState(ingredient.equivalent);
    const [amount, setAmount] = useState(ingredient.amount);
    const [measure, setMeasure] = useState(ingredient.measure);
    const [isSaving, setIsSaving] = useState(false);

    const onChangeAmount = (newAmount) => {
        setAmount(newAmount);
        const { equivalent, measure } =
            IngredientConvertions.amountToEquivalent(ingredient, newAmount);

        setEquivalent(equivalent);
        setMeasure(measure);
    };

    const onChangeEquivalent = (newEquivalent) => {
        const { amount, measure } = IngredientConvertions.equivalentToAmount(
            ingredient,
            newEquivalent
        );

        setEquivalent(newEquivalent);
        setAmount(amount);
        setMeasure(measure);
    };

    const handleEditIngredient = () => {
        setIsEditing(true);
    };

    const handleSaveIngredient = async () => {
        setIsSaving(true);
        const success = await onSave({
            equivalent: equivalent,
            idTime: idTime,
            idIngredient: ingredient.id,
            idRecipe: idRecipe,
        });

        if (success) {
            setIsEditing(false);
        }
        setIsSaving(false);
    };

    useEffect(() => {
        const { amount, measure } = IngredientConvertions.equivalentToAmount(
            ingredient,
            ingredient.equivalent
        );
        setAmount(amount);
        setMeasure(measure);
    }, [ingredient]);

    return (
        <li className="list-row">
            <div>
                <span className="font-semibold">{ingredient.name}</span>
                <span className="text-sm"> - {measure}</span>
            </div>
            <div></div>
            <div className="flex gap-2 items-center">
                <div>
                    {isEditing ? (
                        <input
                            type="number"
                            value={equivalent}
                            onChange={(e) => onChangeEquivalent(e.target.value)}
                            className="input input-bordered input-sm w-24 text-center"
                        />
                    ) : (
                        <span className="text-xs">{equivalent}</span>
                    )}
                    <span className="text-xs"> Equivalentes</span>
                </div>
                <div>-</div>
                <div>
                    {isEditing ? (
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => onChangeAmount(e.target.value)}
                            className="input input-bordered input-sm w-24 text-center"
                        />
                    ) : (
                        <span className="text-xs">{amount}</span>
                    )}
                    <span className="text-xs"> Gramos</span>
                </div>
            </div>
            <IconButton
                isLoading={isSaving}
                icon={isEditing ? "save" : "edit"}
                clase={isEditing ? "link-success" : "link-info"}
                onclick={
                    isEditing ? handleSaveIngredient : handleEditIngredient
                }
            />
        </li>
    );
};

export default IngredientRow;
