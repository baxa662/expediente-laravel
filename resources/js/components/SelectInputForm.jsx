import { ErrorMessage } from "@hookform/error-message";
import React from "react";

export const SelectInputForm = ({
  label,
  id,
  required,
  register,
  options,
  errors,
  onChange,
}) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className="select select-bordered"
        {...register(id, { required: required })}
        defaultValue={"null"}
        onChange={onChange}
      >
        <option value="null" disabled>
          Seleccione una opcion
        </option>
        {options.map((element) => (
          <option value={element.id} key={element.id}>
            {element.name}
          </option>
        ))}
      </select>
      <ErrorMessage
        errors={errors ?? []}
        name={id}
        render={({ message }) => (
          <p className="text-red-500 text-xs">{message}</p>
        )}
      />
    </div>
  );
};
