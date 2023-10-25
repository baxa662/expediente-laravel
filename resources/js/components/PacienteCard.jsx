import React from "react";

export const PacienteCard = ({ paciente }) => {
  const {
    nombres,
    apellidos,
    edad,
    alergias,
    ant_here,
    ant_pat,
    ant_per_no_pat,
    edo_civil,
    email,
    fecha_inicio,
    nacimiento,
    ocupacion,
    sexo,
    numero,
  } = paciente;

  return (
    <div className="card sm:w-auto shadow-md">
      <div className="card-body">
        <div className="card-title">{`${nombres} ${apellidos}`}</div>
        <div className="flex max-sm:flex-col">
          <div className="flex-1">
            <div>Sexo: {sexo}</div>
            <div>Edad: {edad}</div>
            <div>Estado Civil: {edo_civil}</div>
            <div>Ocupación: {ocupacion}</div>
            <div>Fecha inicial: {fecha_inicio}</div>
            <div>Email: {email}</div>
            <div>Celular: {numero}</div>
          </div>
          <div className="flex-1">
            <div>Fecha de nacimiento: {nacimiento}</div>
            <div>Alergias: {alergias}</div>
            <div>Antecedentes patologicos: {ant_pat}</div>
            <div>Antecedentes personales no patologicos: {ant_per_no_pat}</div>
            <div>Antecedentes hereditarios: {ant_here}</div>
            <div>Peso ideal:</div>
            <div>Equivalentes de proteina:</div>
            <div>Gramos de proteina:</div>
          </div>
        </div>
      </div>
    </div>
  );
};
