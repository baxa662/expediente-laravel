import React from "react";

export const DropdownButton = ({
  text,
  children,
  icon,
  claseBtn = "",
  claseDrop,
}) => {
  return (
    <div className={"dropdown dropdown-bottom dropdown-end " + claseDrop}>
      <label tabIndex={0} className={"btn " + claseBtn}>
        {text ?? <i className="material-symbols-outlined">{icon}</i>}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box z-[1]"
      >
        {children}
      </ul>
    </div>
  );
};
