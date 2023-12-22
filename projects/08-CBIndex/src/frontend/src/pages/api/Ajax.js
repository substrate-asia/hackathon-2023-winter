import axios from "axios";
const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 36000,
});

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code !== 403) {
      return data;
    }
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        alert("Argument Error");
      } else if (error.response.status === 500) {
        alert("Server Error");
      }
      return JSON.parse(JSON.stringify(error.response.data))
    } else if (error.message === "timeout of 3600ms exceeded") {
      alert("Request Timeout");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

/**
 * @description: sending request
 * @param {string | {url: string, data: any, params: any, method: 'POST' | 'GET' | 'PUT' | 'DELETE'}} req
 */
function Ajax(req) {
  if (typeof req === "string") {
    req = {
      url: req,
    };
  }
  return new Promise((resolve) => {
    Axios.request({
      url: req.url,
      method: req.method || "GET",
      data: req.data || {},
    })
      .then((d) => {
        resolve(d);
      })
      .catch((e) => {
        resolve(e);
      });
  });
}

export default Ajax;
