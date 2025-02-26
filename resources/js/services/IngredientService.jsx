import peticion from "./GlobalService";

function getIngredient(params) {
  const url = "ingredient/show";
  const response = peticion(params, url);
  return response;
}

function getDetail(params) {
  const url = `ingredient/detail/${params.idIngredient}`;
  const response = peticion(params, url);
  return response;
}

async function deleteIngredient(params) {
  const url = `ingredient/delete/${params.id}`;
  const response = await peticion(params, url, "delete");
  return response;
}

async function create(params) {
  const url = "ingredient/create";
  const response = await peticion(params, url);
  return response;
}

async function update(params) {
  const url = `ingredient/update/${params.idIngredient}`;
  const response = await peticion(params, url);
  return response;
}

async function setNutrient(params) {
  const url = "ingredient/nutrient/set";
  const response = await peticion(params, url);
  return response;
}

async function deleteNutrient(params) {
  const url = `ingredient/nutrient/delete`;
  const response = await peticion(params, url);
  return response;
}

export default {
  getIngredient,
  deleteIngredient,
  create,
  update,
  setNutrient,
  getDetail,
  deleteNutrient,
};
