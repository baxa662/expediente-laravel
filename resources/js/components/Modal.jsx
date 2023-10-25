import React from "react";

export const Modal = ({
  id,
  children,
  title,
  isChecked,
  setIsChecked,
  style,
  className,
}) => {
  function handleClick() {
    setIsChecked(!isChecked);
  }
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        className="modal-toggle"
        checked={isChecked}
        onChange={setIsChecked}
        name={id}
      />
      <div className={"modal modal-bottom sm:modal-middle"}>
        <div className={"modal-box p-0 " + className} style={style}>
          <div className="sticky top-0 bg-white w-full h-10 p-4 z-50 shadow-md">
            <a
              onClick={handleClick}
              className="btn btn-sm btn-circle absolute right-2 top-1 self-center"
            >
              ✕
            </a>
            <h3 className="font-bold text-lg absolute top-1" id={`title${id}`}>
              {title}
            </h3>
          </div>
          <div className="py-4 px-4 h-min">{children}</div>
          <div className="modal-action"></div>
        </div>
      </div>
    </div>
  );
};
