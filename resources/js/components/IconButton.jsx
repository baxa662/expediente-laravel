import React from "react";
import { Link } from "react-router-dom";

export const IconButton = ({ clase, icon, ruta, id, onclick, children }) => {
  return (
    <div>
      <a
        className={"btn btn-ghost btn-sm btn-square " + clase}
        href={ruta}
        id={id}
        onClick={onclick}
      >
        <i className="material-symbols-outlined">{icon}</i>
        {children}
      </a>
    </div>
  );
};
