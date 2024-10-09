import React from "react";
import { InputForm } from "../InputForm";

export const FormMedidasV2 = ({
  onSubmit,
  medRegister,
  errorsMed,
  idPaciente,
  medSubmit,
}) => {
  return (
    <form onSubmit={medSubmit(onSubmit)} className="flex flex-col">
      <InputForm
        id={"id_paciente"}
        type={"hidden"}
        register={medRegister}
        value={idPaciente}
      />
      <InputForm id={"id_medidas"} type={"hidden"} register={medRegister} />
      <InputForm
        label={"Altura"}
        id={"altura"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Fecha"}
        id={"fecha"}
        required={true}
        type={"date"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Peso"}
        id={"peso"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"IMC"}
        id={"imc"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Masa musculoesquelética Kg"}
        id={"masa_musculoes"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Grasa Corporal"}
        id={"grasa_corporal"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Grasa Visceral"}
        id={"grasa_visceral"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Masa libre de grasa"}
        id={"masa_libre"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Tasa metabolica basal"}
        id={"tasa_metabolica"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Porcentaje de obesidad"}
        id={"por_obesidad"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <div className="sticky bottom-0 bg-white p-1">
        <input type="submit" className="btn w-full" />
      </div>
    </form>
  );
};
