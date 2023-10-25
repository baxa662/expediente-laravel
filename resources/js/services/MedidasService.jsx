import peticion from "./GlobalService";

async function saveMedida(params) {
  const url = "medidas/create";
  const response = await peticion(params, url);
  return response;
}

async function update(params) {
  const url = "medidas/update";
  const response = await peticion(params, url);
  return response;
}

async function remove(params) {
  const url = `medidas/delete/${params}`;
  const response = await peticion(params, url);
  return response;
}

export default {
  saveMedida,
  update,
  remove,
};
