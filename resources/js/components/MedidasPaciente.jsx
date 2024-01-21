import React from "react";
import { MedidaItem } from "./MedidaItem";
import { round } from "lodash";

export const MedidasPaciente = ({
  data,
  edad,
  idSexo,
  oldValue,
  handleOnChange,
  onPresDelMed,
}) => {
  const {
    altura,
    ec,
    fecha,
    gc,
    gv,
    id_medidas,
    imc,
    kcal,
    msc,
    peso,
    grasaCorporalPor,
    masaMusculoesPor,
    masaLibreGrasa,
    obesidadPor,
  } = data;
  const indicador = peso - oldValue < 0 ? 0 : 1;
  let harrisBenedict, mafflinJeor;
  if (idSexo == 1) {
    harrisBenedict = round(66 + 13.7 * peso + 5 * altura - 6.8 * edad, 2);
    mafflinJeor = round(9.99 * peso + 6.25 * altura - 4.92 * edad + 5, 2);
  } else {
    harrisBenedict = round(655 + 9.6 * peso + 1.8 * altura - 4.7 * edad, 2);
    mafflinJeor = round(9.99 * peso + 6.25 * altura - 4.92 * edad - 161, 2);
  }

  const cunningham = round(500 + 22 * masaLibreGrasa);
  const katchMcArdle = round(370 + 21.6 * masaLibreGrasa);

  return (
    <div className="card shadow-md">
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
        <MedidaItem
          title={"Peso"}
          medida={peso}
          indicador={indicador}
          unidad={"Kg"}
        />
        <MedidaItem title={"IMC"} medida={imc} />
        <MedidaItem title={"Grasa corporal"} medida={gc} />
        <MedidaItem
          title={"Grasa corporal"}
          medida={grasaCorporalPor}
          unidad={"%"}
        />
        <MedidaItem title={"Musculoesqueletica"} medida={msc} unidad={"Kg"} />
        <MedidaItem
          title={"Musculoesqueletica"}
          medida={masaMusculoesPor}
          unidad={"%"}
        />
        <MedidaItem title={"Tasa metabolica basal"} medida={kcal} />
        {/* <MedidaItem title={"Edad Corporal"} medida={ec} /> */}
        <MedidaItem title={"Grasa visceral"} medida={gv} />
        <MedidaItem title={"Masa libre de grasa"} medida={masaLibreGrasa} />
        <MedidaItem
          title={"Obesidad Porcentaje"}
          medida={obesidadPor}
          unidad={"%"}
        />
        <MedidaItem title={"Harris Benedict"} medida={harrisBenedict} />
        <MedidaItem title={"Mifflin St Jeor"} medida={mafflinJeor} />
        <MedidaItem title={"Cunningham"} medida={cunningham} />
        <MedidaItem title={"Katch Mc Ardle"} medida={katchMcArdle} />
      </div>
    </div>
  );
};
