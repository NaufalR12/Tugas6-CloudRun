const apiUserUrl = "https://backend-nopal-505940949397.us-central1.run.app/api/users";
const tokenKey = "accessToken";

// Konfigurasi default untuk Axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Interceptor untuk response
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Jika error 401 dan belum pernah mencoba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const res = await axios.post(
          `${apiUserUrl}/refresh`,
          {},
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        const newToken = res.data.accessToken;
        if (newToken) {
          localStorage.setItem(tokenKey, newToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        localStorage.removeItem(tokenKey);
        window.location.href = '/'; // Redirect ke halaman login
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);