import peticion from "./GlobalService";

function get(params) {
  const url = "ingredient/unit/show";
  const response = peticion(params, url);
  return response;
}

export default {
  get,
};
