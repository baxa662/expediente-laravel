import peticion from "./GlobalService";

async function getCitas(params) {
  const url = "citas/showAll";
  const response = await peticion(params, url);
  return response;
}

async function getCita(params) {
  const url = "citas/show";
  const response = await peticion(params, url);
  return response;
}

async function create(params) {
  const url = "citas/create";
  const response = await peticion(params, url);
  return response;
}

async function update(id, newDate) {
  const params = {
    newDate: newDate,
  };
  const url = `citas/update/${id}`;
  const response = await peticion(params, url);
  return response;
}

async function cancel(id) {
  const params = {};
  const url = `citas/delete/${id}`;
  const response = await peticion(params, url);
  return response;
}

async function resume(id) {
  const params = {};
  const url = `citas/resume/${id}`;
  const response = await peticion(params, url);
  return response;
}

export default {
  getCitas,
  getCita,
  create,
  cancel,
  update,
  resume,
};
