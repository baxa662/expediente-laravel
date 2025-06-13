import React, { useEffect, useState } from "react";
import { IconButton } from "../../../../components/IconButton";
import IngredientConvertions from "../../../../helpers/IngredientConvertions";
import { InputForm } from "../../../../components/InputForm";

const IngredientRow = ({ ingredient }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [equivalent, setEquivalent] = useState(ingredient.pivot.equivalent);
    const [amount, setAmount] = useState(ingredient.pivot.amount);
    const [measure, setMeasure] = useState(ingredient.pivot.measure);

    const handleEditIngredient = () => {
        setIsEditing(true);
    };

    const handleSaveIngredient = () => {
        const { amount, measure } = IngredientConvertions.equivalentToAmount(
            ingredient,
            equivalent
        );

        setAmount(amount);
        setMeasure(measure);
        setIsEditing(false);
    };

    useEffect(() => {
        const { amount, measure } = IngredientConvertions.equivalentToAmount(
            ingredient,
            ingredient.pivot.equivalent
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
                            onChange={(e) => setEquivalent(e.target.value)}
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
                            onChange={(e) => setAmount(e.target.value)}
                            className="input input-bordered input-sm w-24 text-center"
                        />
                    ) : (
                        <span className="text-xs">{amount}</span>
                    )}
                    <span className="text-xs"> Gramos</span>
                </div>
            </div>
            <IconButton
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
