import { setAuthHeader } from "./utils.js";

const apiUserUrl =
  "https://backend-nopal-505940949397.us-central1.run.app/api/users";
const tokenKey = "accessToken";

// Containers
const authContainer = document.getElementById("authContainer");
const notesApp = document.getElementById("notesApp");

// Login elements
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

// Register elements
const registerForm = document.getElementById("registerForm");
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerGender = document.getElementById("registerGender");
const registerPassword = document.getElementById("registerPassword");
const registerBtn = document.getElementById("registerBtn");
const cancelRegisterBtn = document.getElementById("cancelRegisterBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");

// Logout button
const logoutBtn = document.getElementById("logoutBtn");

function showNotesApp() {
  authContainer.classList.add("hidden");
  notesApp.classList.remove("hidden");
}

function showAuth() {
  authContainer.classList.remove("hidden");
  notesApp.classList.add("hidden");
  clearAuthForms();
}

function clearAuthForms() {
  loginUsername.value = "";
  loginPassword.value = "";
  registerName.value = "";
  registerEmail.value = "";
  registerGender.value = "";
  registerPassword.value = "";
  registerForm.classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

function setupAuthEventListeners(showNotesAppCallback) {
  // REGISTER
  registerBtn.addEventListener("click", () => {
    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const gender = registerGender.value;
    const password = registerPassword.value.trim();

    if (!name || !email || !gender || !password) {
      alert("Semua field harus diisi.");
      return;
    }

    if (!email.includes('@')) {
      alert("Email tidak valid.");
      return;
    }

    axios
      .post(`${apiUserUrl}/register`, { name, email, gender, password })
      .then(() => {
        alert("Register berhasil! Silakan login.");
        registerForm.classList.add("hidden");
        document.getElementById("loginForm").classList.remove("hidden");
      })
      .catch((err) => {
        alert("Register gagal: " + (err.response?.data?.message || err.message));
      });
  });

  // SHOW REGISTER FORM
  showRegisterBtn.addEventListener("click", () => {
    registerForm.classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
  });

  // CANCEL REGISTER
  cancelRegisterBtn.addEventListener("click", () => {
    registerForm.classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
  });

  // LOGIN
  loginBtn.addEventListener("click", () => {
    const email = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
      alert("Email dan password harus diisi.");
      return;
    }

    // Konfigurasi axios untuk login
    const loginConfig = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://frontend-nopal-dot-b-08-450916.uc.r.appspot.com'
      }
    };

    axios
      .post(`${apiUserUrl}/login`, { email, password }, loginConfig)
      .then((res) => {
        const token = res.data.accessToken;
        if (!token) throw new Error("Token tidak ditemukan di response.");
        localStorage.setItem(tokenKey, token);
        setAuthHeader();
        showNotesAppCallback();
      })
      .catch((err) => {
        console.error("Login error:", err);
        if (err.code === 'ERR_NETWORK') {
          alert("Tidak dapat terhubung ke server. Silakan coba lagi nanti.");
        } else {
          alert("Login gagal: " + (err.response?.data?.message || err.message));
        }
      });
  });

  // LOGOUT
  logoutBtn.addEventListener("click", async () => {
    try {
      await axios.delete(`${apiUserUrl}/logout`, {
        withCredentials: true
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem(tokenKey);
      setAuthHeader();
      showAuth();
    }
  });
}

export { showNotesApp, showAuth, clearAuthForms, setupAuthEventListeners }; 