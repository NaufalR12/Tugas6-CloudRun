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
const registerUsername = document.getElementById("registerUsername");
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
  registerUsername.value = "";
  registerPassword.value = "";
  registerForm.classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

function setupAuthEventListeners(showNotesAppCallback) {
  // REGISTER
  registerBtn.addEventListener("click", () => {
    const username = registerUsername.value.trim();
    const password = registerPassword.value.trim();

    if (!username || !password) {
      alert("Username dan password harus diisi.");
      return;
    }

    axios
      .post(`${apiUserUrl}/register`, { username, password })
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

    axios
      .post(`${apiUserUrl}/login`, { email, password }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then((res) => {
        const token = res.data.accessToken;
        if (!token) throw new Error("Token tidak ditemukan di response.");
        localStorage.setItem(tokenKey, token);
        setAuthHeader();
        showNotesAppCallback();
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("Login gagal: " + (err.response?.data?.message || err.message));
      });
  });

  // LOGOUT
  logoutBtn.addEventListener("click", async () => {
    try {
      await fetch(`${apiUserUrl}/logout`, {
        method: "DELETE",
        credentials: "include",
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