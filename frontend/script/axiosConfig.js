const apiUserUrl = "https://backend-nopal-505940949397.us-central1.run.app/api/users";
const tokenKey = "accessToken";
const refreshTokenKey = "refreshToken";

// Daftar endpoint yang tidak memerlukan autentikasi
const publicEndpoints = [
  `${apiUserUrl}/register`,
  `${apiUserUrl}/login`,
  `${apiUserUrl}/refresh`
];

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

// Fungsi untuk mengatur refresh token
const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(refreshTokenKey, token);
  } else {
    localStorage.removeItem(refreshTokenKey);
  }
};

// Fungsi untuk refresh token
const refreshAccessToken = async () => {
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
      setAuthToken(newToken);
      return newToken;
    }
    throw new Error('No new token received');
  } catch (error) {
    console.error("Refresh token error:", error);
    setAuthToken(null);
    setRefreshToken(null);
    window.location.href = '/?error=session_expired';
    throw error;
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
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;

// Flag untuk menandai sedang melakukan refresh token
let isRefreshing = false;
// Queue untuk menyimpan request yang gagal karena token expired
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor untuk request
axios.interceptors.request.use(
  async config => {
    // Abaikan refresh token untuk endpoint publik
    if (publicEndpoints.includes(config.url)) {
      return config;
    }

    // Refresh token setiap 25 detik (sebelum token expired di 30 detik)
    const lastRefresh = localStorage.getItem('lastTokenRefresh');
    const now = Date.now();
    
    if (!lastRefresh || (now - parseInt(lastRefresh)) > 25000) {
      try {
        await refreshAccessToken();
        localStorage.setItem('lastTokenRefresh', now.toString());
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor untuk response
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Jika error 401 dan belum pernah mencoba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Abaikan refresh untuk endpoint publik
      if (publicEndpoints.includes(originalRequest.url)) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Jika sedang melakukan refresh, tambahkan request ke queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export { setAuthToken, setRefreshToken, refreshAccessToken };