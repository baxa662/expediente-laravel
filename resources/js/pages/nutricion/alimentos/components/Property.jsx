import React from "react";

const Property = ({
  isEdit,
  label,
  value,
  name,
  id,
  isSelect,
  options,
  idSelected,
}) => {
  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="text-center">{label}:</div>
      {isEdit ? (
        <div className="w-full">
          {isSelect ? (
            <select
              name={name}
              className="select select-bordered w-full select-sm max-w-xs"
              defaultValue={idSelected}
            >
              {options &&
                options.map((e) => <option value={e.id}>{e.name}</option>)}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Introduce un valor"
              class="input input-bordered input-sm w-full max-w-xs"
              defaultValue={value}
              name={name}
            />
          )}
          {id && <input type="hidden" value={id} name={`${name}-id`} />}
        </div>
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
};

export default Property;
