import peticion from "./GlobalService";

function get(params) {
  const url = `paymentMethods/show/${params ?? ""}`;
  const response = peticion(params, url);
  return response;
}

function save(params) {
  const url = "payment/create";
  const response = peticion(params, url);
  return response;
}

// function update(params) {
//   const url = `services/update/${params.id}`;
//   const response = peticion(params, url);
//   return response;
// }

// function destroy(params) {
//   const url = `services/delete/${params}`;
//   const response = peticion(params, url);
//   return response;
// }

export default {
  get,
  save,
  // update,
  // destroy,
};
