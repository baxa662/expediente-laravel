import peticion from "./GlobalService";

function getPaciente(id) {
  const params = {
    id: id,
  };
  const url = "pacientes/show";
  const response = peticion(params, url);
  return response;
}

function getPacientes(params) {
  const url = "pacientes";
  const response = peticion(params, url);
  return response;
}

async function getUtils(params) {
  var url = "pacientes/sexos";
  const sexos = await peticion(params, url);
  var url = "pacientes/edoCivil";
  const edoCivil = await peticion(params, url);
  const response = {
    sexos: sexos,
    edoCivil: edoCivil,
  };
  return response;
}

async function deletePaciente(params) {
  const url = "pacientes/delete";
  const response = await peticion(params, url);
  return response;
}

async function create(params) {
  const url = "pacientes/create";
  const response = await peticion(params, url);
  return response;
}

async function update(params) {
  const url = "pacientes/update";
  const response = await peticion(params, url);
  return response;
}

export default {
  getPaciente,
  getUtils,
  getPacientes,
  deletePaciente,
  create,
  update,
};
