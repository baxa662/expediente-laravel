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

function saveRecipeIngredient(params) {
  const url = "recipes/ingredient";
  const response = peticion(params, url, "POST");
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

function getRecipeDetail(id) {
  const url = `recipes/detail/${id}`;
  const response = peticion({}, url, "GET");
  return response;
}

function updateRecipeIngredient(params) {
  const url = "recipes/ingredient/update";
  const response = peticion(params, url, "POST");
  return response;
}

function deleteRecipeIngredient(params) {
  const url = "recipes/ingredient/delete";
  const response = peticion(params, url, "POST");
  return response;
}

function updateRecipeImage(formData) {
  const url = "recipes/update-image";
  const response = peticion(formData, url, "POST", true);
  return response;
}

function updateRecipePdf(formData) {
  const url = "recipes/update-pdf";
  const response = peticion(formData, url, "POST", true);
  return response;
}

export default {
  getRecipes,
  saveRecipe,
  saveRecipeIngredient,
  update,
  destroy,
  getRecipeDetail,
  updateRecipeIngredient,
  deleteRecipeIngredient,
  updateRecipeImage,
  updateRecipePdf,
};
