import React from "react";

export const SelectInputForm = ({ label, id, required, register, options }) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className="select select-bordered"
        {...register(id, { required: required })}
      >
        {options.map((element) => (
          <option value={element.id} key={element.id}>
            {element.name}
          </option>
        ))}
      </select>
    </div>
  );
};
