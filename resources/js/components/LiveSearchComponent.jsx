import AsyncSelect from "react-select/async";

export const LiveSearchComponent = ({
  loadOptions,
  required,
  label,
  id,
  onChange,
  isMultiple,
  setValue,
  inputRef,
}) => {
  const onChangeFunction = (object) => {
    if (onChange) {
      onChange(object);
    }
    var value;
    if (Array.isArray(object)) {
      value = object.map((item) => {
        return item.value;
      });
    } else {
      if (object != null) {
        value = object.value;
      } else {
        value = null;
      }
    }
    setValue(id, value);
  };

  return (
    <div>
      <label htmlFor={id} className="label">
        <span className="label-text">
          {label}
          {required ? "*" : ""}
        </span>
      </label>
      <AsyncSelect
        ref={inputRef}
        cacheOptions
        hideSelectedOptions
        defaultOptions
        isClearable
        loadOptions={loadOptions}
        onChange={onChangeFunction}
        isMulti={isMultiple}
      />
    </div>
  );
};
