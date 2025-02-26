import React from "react";

export const IconButton = ({
  clase,
  icon,
  ruta,
  id,
  onclick,
  children,
  isLaoding,
}) => {
  if (!children) {
    clase = clase + " btn-square";
  }

  const getBody = () => {
    return (
      <div className="flex justify-center gap-1 items-center">
        {isLaoding && <span className="loading loading-spinner"></span>}
        {icon && <i className="material-symbols-outlined">{icon}</i>}
        {children && <div>{children}</div>}
      </div>
    );
  };

  return (
    <div>
      {ruta ? (
        <a
          className={"btn btn-ghost btn-sm " + clase}
          href={ruta}
          id={id}
          onClick={onclick}
        >
          {getBody()}
        </a>
      ) : (
        <button
          className={"btn btn-ghost btn-sm " + clase}
          id={id}
          onClick={onclick}
        >
          {getBody()}
        </button>
      )}
    </div>
  );
};
