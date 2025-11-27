import axiosClient from "./axiosClient";

const authApi = {
  signup: (data) => axiosClient.post("/auth/signup", data),
  login: (data) => axiosClient.post("/auth/login", data),
  refresh: () => axiosClient.post("/auth/refresh-token"),
  getMe: () => axiosClient.get("/auth/me")
};

export default authApi;
