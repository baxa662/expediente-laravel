import React from "react";
import { MedidaItem } from "./MedidaItem";

export const MedidasPaciente = ({
  data,
  oldValue,
  handleOnChange,
  onPresDelMed,
}) => {
  const { altura, ec, fecha, gc, gv, id_medidas, imc, kcal, msc, peso } = data;
  const indicador = peso - oldValue < 0 ? 0 : 1;

  return (
    <div className="card shadow-md h-96">
      <div className="card-actions flex justify-between p-2">
        <div>
          <p>{fecha}</p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            onClick={() => handleOnChange(id_medidas, data)}
          >
            <i className="material-symbols-outlined">edit</i>
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm text-red-600 btn-square"
            onClick={() => onPresDelMed(id_medidas)}
          >
            <i className="material-symbols-outlined">delete</i>
          </button>
        </div>
      </div>
      <div className="p-3">
        <MedidaItem title={"Altura"} medida={altura} />
        <MedidaItem title={"Peso"} medida={peso} indicador={indicador} />
        <MedidaItem title={"IMC"} medida={imc} />
        <MedidaItem title={"Grasa corporal"} medida={gc} />
        <MedidaItem title={"Musculo"} medida={msc} />
        <MedidaItem title={"KCal"} medida={kcal} />
        <MedidaItem title={"Edad Corporal"} medida={ec} />
        <MedidaItem title={"Grasa Viseral"} medida={gv} />
      </div>
    </div>
  );
};
