import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://hackhub-back.onrender.com/api",
  withCredentials: true // allow cookies
});

// ============================
// AUTO REFRESH TOKEN INTERCEPTOR
// ============================
let isRefreshing = false;

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If unauthorized → try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Call refresh-token route
          await axiosClient.post("/auth/refresh-token");

          isRefreshing = false;

          // Mark retry flag
          originalRequest._retry = true;

          // Retry original request
          return axiosClient(originalRequest);

        } catch (refreshError) {
          isRefreshing = false;
          console.log("Refresh token failed:", refreshError);
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
