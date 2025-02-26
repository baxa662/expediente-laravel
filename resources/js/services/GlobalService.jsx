import axios from "axios";

async function peticion(params, url, method = "POST") {
  const token = localStorage.getItem("sessionToken");

  return axios({
    method: method,
    url: `/api/${url}`,
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
      withCredentials: true,
    },
  })
    .then((response) => {
      if (response.status == 200) {
        return response.data;
      } else if (response.status == 204) {
        return false;
      } else {
        return response.data;
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        localStorage.clear();
        location.reload();
      } else if ([400, 422].includes(error.response.status)) {
        return error.response.data;
      }
      return false;
    });
}

export default peticion;
