import peticion from "./GlobalService";

async function getAll(params) {
  console.log(params);
  const url = "notas/showAll";
  const response = await peticion(params, url);
  return response;
}

async function saveNota(params) {
  const url = "notas/create";
  const response = await peticion(params, url);
  return response;
}

async function update(params) {
  const url = "notas/update";
  const response = await peticion(params, url);
  return response;
}

async function remove(params) {
  const url = `notas/delete/${params}`;
  const response = await peticion(params, url);
  return response;
}

export default {
  saveNota,
  update,
  getAll,
  remove,
};
