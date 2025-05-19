// axiosConfig.js
import axios from "axios";

const apiUserUrl = "https://backend-nopal-505940949397.us-central1.run.app/api/users";
const tokenKey = "accessToken";

// Interceptor untuk response
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Jika error 401 dan belum pernah mencoba refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Request refresh token
        const res = await axios.post(`${apiUserUrl}/refresh`, {}, { withCredentials: true });
        const newToken = res.data.accessToken;
        if (newToken) {
          localStorage.setItem(tokenKey, newToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          // Ulangi request yang gagal
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Jika refresh gagal, hapus token & redirect ke login
        localStorage.removeItem(tokenKey);
        window.location.reload();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);