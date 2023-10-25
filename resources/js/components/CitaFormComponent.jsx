import React, { useRef, useState } from "react";
import { LiveSearchComponent } from "./liveSearchComponent";
import { InputForm } from "./InputForm";
import ServicesService from "../services/ServicesService";
import PacienteService from "../services/PacienteService";
import CalendarioService from "../services/CalendarioService";

export const CitaFormComponent = ({
  onSubmit,
  register,
  handleSubmit,
  setValue,
  reset,
  errors,
  selectPacienteRef,
  selectServicioRef,
}) => {
  const [total, setTotal] = useState(0);
  let timer;

  const searchPaciente = (inputValue) =>
    new Promise(async (resolve) => {
      var params = {
        query: inputValue,
        limit: 10,
        offset: 0,
      };

      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(async () => {
        var response = await PacienteService.getPacientes(params);
        const pacientes = response.data.map((element) => {
          return {
            value: element.id,
            label: element.nombresCom,
          };
        });
        resolve(pacientes);
      }, 800);
    });

  const searchServicios = (inputValue) =>
    new Promise(async (resolve) => {
      var params = {
        query: inputValue,
        limit: 10,
        offset: 0,
      };

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        const response = await ServicesService.getServicios(params);
        const services = response.data.map((element) => {
          return {
            value: element.id_servicio,
            label: `${element.nombre} - $${element.costo}`,
            cost: element.costo,
          };
        });
        resolve(services);
      }, 800);
    });

  const onChangeServices = (list) => {
    var cost = 0;
    list.forEach((item) => {
      cost = item.cost + cost;
    });
    setTotal(cost);
  };

  const handleOnSubmit = async (data) => {
    const response = await CalendarioService.create(data);
    if (response) {
      if (onSubmit) {
        onSubmit(data);
      }
      selectPacienteRef.current.clearValue();
      selectServicioRef.current.clearValue();
      reset({
        paciente: null,
        servicios: null,
        fecha: null,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col">
      <LiveSearchComponent
        register={register}
        label={"Paciente"}
        loadOptions={searchPaciente}
        id={"idPaciente"}
        required={true}
        setValue={setValue}
        inputRef={selectPacienteRef}
      />
      <LiveSearchComponent
        register={register}
        label={"Servicios"}
        loadOptions={searchServicios}
        onChange={onChangeServices}
        id={"servicios"}
        required={true}
        isMultiple
        errors={errors}
        setValue={setValue}
        inputRef={selectServicioRef}
      />
      <p className="text-sm mt-1">Total ${total}</p>
      <InputForm
        id={"fecha"}
        label={"Fecha cita"}
        register={register}
        required={true}
        type={"datetime-local"}
        errors={errors}
      />
      <input type="submit" className="btn btn-success mt-5" value={"Agendar"} />
    </form>
  );
};
