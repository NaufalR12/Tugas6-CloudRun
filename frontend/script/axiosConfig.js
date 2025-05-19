const apiUserUrl = "https://backend-nopal-505940949397.us-central1.run.app/api/users";
const tokenKey = "accessToken";

// Fungsi untuk mengatur token
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(tokenKey, token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(tokenKey);
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Set token awal jika ada
const token = localStorage.getItem(tokenKey);
if (token) {
  setAuthToken(token);
}

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
        // Pastikan denganCredentials diatur untuk request refresh
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
          setAuthToken(newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } else {
          throw new Error('No new token received');
        }
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        setAuthToken(null);
        // Redirect ke halaman login dengan pesan error
        window.location.href = '/?error=session_expired';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);