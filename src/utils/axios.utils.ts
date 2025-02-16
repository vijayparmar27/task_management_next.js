import axios from "axios";
import Cookies from "js-cookie";
const instance = axios.create();
// const cookies = new Cookies();

const axiosClient = axios.create({
  // baseURL: process.env.NEXT_APP_END_POINT,
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});
instance.defaults.headers.common = { "Access-Control-Allow-Origin": "*" };
axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const res = error.response;
    if (
      res.status === 401 ||
      error.response?.data?.message === "Token Expired"
    ) {
      Cookies.remove("token", { path: "/" });
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

axiosClient.interceptors.request.use(function (config) {
  const token = Cookies.get("token");
  config.headers["Authorization"] = token ? `bearer ${token}` : "";
  return config;
});

export default axiosClient;
