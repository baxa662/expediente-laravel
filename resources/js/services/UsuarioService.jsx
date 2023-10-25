import peticion from "./GlobalService";

function getUsers(params) {
  const url = "users/showAll";
  const response = peticion(params, url);
  return response;
}

function saveUser(params) {
  const url = "users/create";
  const response = peticion(params, url);
  return response;
}

function update(params) {
  const url = `users/update/${params.id}`;
  const response = peticion(params, url);
  return response;
}

function destroy(params) {
  const url = `users/delete/${params}`;
  const response = peticion(params, url);
  return response;
}

export default {
  getUsers,
  saveUser,
  update,
  destroy,
};
