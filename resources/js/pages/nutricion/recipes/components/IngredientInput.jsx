import React from "react";
import { InputForm } from "../../../../components/InputForm";

const IngredientInput = ({ value, isEditing, onChange, register, errors }) => {
  console.log(isEditing);

  return (
    <p>
      Equivalente:{" "}
      {isEditing ? (
        <InputForm
          label={""}
          id={"equivalent"}
          register={register}
          errors={errors}
          value={value}
          onChange={onChange}
        />
      ) : (
        value
      )}
    </p>
  );
};

export default IngredientInput;
