import React from "react";
import { InputForm } from "../../../../components/InputForm";

const IngredientInput = ({ value, isEditing, onChange, register, errors, id, label }) => {
  return (
    <p>
      {`${label}: `}
      {isEditing ? (
        <InputForm
          label={""}
          id={id}
          register={register}
          errors={errors}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        value
      )}
    </p>
  );
};

export default IngredientInput;
