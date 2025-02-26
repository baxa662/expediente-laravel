import peticion from "./GlobalService";

function getNutrient(params) {
  const url = "nutrient/show";
  const response = peticion(params, url);
  return response;
}

function getNutrients(params) {
  const url = "nutrient";
  const response = peticion(params, url);
  return response;
}

async function deleteNutrient(params) {
  const url = "nutrient/delete";
  const response = await peticion(params, url);
  return response;
}

async function create(params) {
  const url = "nutrient/create";
  const response = await peticion(params, url);
  return response;
}

async function update(params) {
  const url = "nutrient/update";
  const response = await peticion(params, url);
  return response;
}

export default {
  getNutrient,
  getNutrients,
  deleteNutrient,
  create,
  update,
};
