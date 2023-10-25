import peticion from "./GlobalService";

async function login(params) {
  const url = "login";
  const response = await peticion(params, url);
  return response;
}

async function logout(params) {
  const url = "logout";
  const response = await peticion(params, url);
  return response;
}

export default {
  login,
  logout,
};
