import React from "react";
import { ErrorMessage } from "@hookform/error-message";

export const InputForm = ({
  label,
  id,
  required,
  type,
  register,
  errors,
  value,
  disabled,
  onChange,
}) => {
  return (
    <div className="form-control w-full max-w">
      {type != "hidden" ? (
        <label htmlFor={id} className="label">
          <span className="label-text">
            {label}
            {required ? "*" : ""}
          </span>
        </label>
      ) : (
        ""
      )}
      <input
        type={type}
        placeholder={label}
        defaultValue={value}
        step={0.01}
        className="input input-bordered w-full"
        onChange={() => console.log("a")}
        {...register(id, { required: required })}
        disabled={disabled}
      />
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
