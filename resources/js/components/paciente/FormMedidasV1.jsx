import React from "react";
import { InputForm } from "../InputForm";

export const FormMedidasV1 = ({
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
        label={"Grasa Corporal"}
        id={"grasa_corporal"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Musculo Corporal"}
        id={"musculo"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Kilocalorias"}
        id={"kilocalorias"}
        required={true}
        type={"number"}
        register={medRegister}
        errors={errorsMed}
      />
      <InputForm
        label={"Edad Corporal"}
        id={"edad_corporal"}
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
      <div className="sticky bottom-0 bg-white p-1">
        <input type="submit" className="btn w-full" />
      </div>
    </form>
  );
};
