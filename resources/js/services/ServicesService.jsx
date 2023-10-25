import peticion from "./GlobalService";

function getServicios(params) {
  const url = "services/showAll";
  const response = peticion(params, url);
  return response;
}

function saveService(params) {
  const url = "services/create";
  const response = peticion(params, url);
  return response;
}

function update(params) {
  const url = `services/update/${params.id}`;
  const response = peticion(params, url);
  return response;
}

function destroy(params) {
  const url = `services/delete/${params}`;
  const response = peticion(params, url);
  return response;
}

export default {
  getServicios,
  saveService,
  update,
  destroy,
};
