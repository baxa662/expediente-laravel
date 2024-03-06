import React from "react";
import { Link } from "react-router-dom";

export const IconButton = ({ clase, icon, ruta, id, onclick, children }) => {
  if (!children) {
    clase = clase + " btn-square";
  }

  return (
    <div>
      <a
        className={"btn btn-ghost btn-sm " + clase}
        href={ruta}
        id={id}
        onClick={onclick}
      >
        <i className="material-symbols-outlined">{icon}</i>
        <div>{children}</div>
      </a>
    </div>
  );
};
