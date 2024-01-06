import axios from "axios";

async function peticion(params, url) {
  const token = localStorage.getItem("sessionToken");

  return (
    axios
      // .post(`http://127.0.0.1:8000/api/${url}`, params, {
      .post(`https://umerexp.ddns.net/api/${url}`, params, {
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
        } else if (error.response.status == 400) {
          return error.response.data;
        }
        return false;
      })
  );
}

export default peticion;
