import peticion from "./GlobalService";

function getRecipes(params) {
  const url = "recipes/show";
  const response = peticion(params, url);
  return response;
}

function saveRecipe(params) {
  const url = "recipes/create";
  const response = peticion(params, url);
  return response;
}

function update(params) {
  const url = `recipes/update/${params.id}`;
  const response = peticion(params, url);
  return response;
}

function destroy(params) {
  const url = `recipes/delete/${params.id}`;
  const response = peticion(params, url);
  return response;
}

export default {
  getRecipes,
  saveRecipe,
  update,
  destroy,
};
