import React from "react";

export const MedidaItem = ({ title, medida, indicador }) => {
  return (
    <div>
      <p>
        {title}: <span className="float-right">{medida}</span>
        {indicador == 1 ? (
          <span className="material-symbols-outlined float-right text-red-500">
            arrow_drop_up
          </span>
        ) : indicador == 0 ? (
          <span className="material-symbols-outlined float-right text-green-500">
            arrow_drop_down
          </span>
        ) : (
          indicador == 2 && (
            <span className="material-symbols-outlined float-right">
              remove
            </span>
          )
        )}
      </p>
      <div className="divider m-0"></div>
    </div>
  );
};
