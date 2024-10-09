import React from "react";

export const MedidaItem = ({ title, medida, indicador, unidad, pesoDif }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex-1">{title}:</div>
        <div className="flex-initial">
          <span
            className={
              indicador == 1
                ? "text-red-500"
                : indicador == 0
                ? "text-green-500"
                : ""
            }
          >
            {`${pesoDif ?? ""} `}
          </span>
          {indicador == 1 ? (
            <span className="material-symbols-outlined float-left text-red-500">
              arrow_drop_up
            </span>
          ) : indicador == 0 ? (
            <span className="material-symbols-outlined float-left text-green-500">
              arrow_drop_down
            </span>
          ) : (
            indicador == 2 && (
              <span className="material-symbols-outlined float-left">
                remove
              </span>
            )
          )}
          {medida ?? 0}
          {unidad}
        </div>
      </div>
      <div className="divider m-0"></div>
    </div>
  );
};
