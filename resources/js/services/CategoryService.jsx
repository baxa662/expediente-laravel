import peticion from "./GlobalService";

function getCategories(id) {
  const params = {
    id: id,
  };
  const url = "ingredient/category/show";
  const response = peticion(params, url);
  return response;
}

async function deleteCategory(params) {
  const url = "ingredient/category/delete";
  const response = await peticion(params, url);
  return response;
}

async function create(params) {
  const url = "ingredient/category/create";
  const response = await peticion(params, url);
  return response;
}

async function update(params) {
  const url = "ingredient/category/update";
  const response = await peticion(params, url);
  return response;
}

export default {
  getCategories,
  deleteCategory,
  create,
  update,
};
