const apiUserUrl = "http://localhost:5000/api/users";
const apiNotesUrl = "http://localhost:5000/api/note/notes";

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

// Notes elements
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteForm = document.getElementById("noteForm");
const formTitle = document.getElementById("formTitle");
const noteIdInput = document.getElementById("noteId");
const noteTitleInput = document.getElementById("noteTitle");
const noteContentInput = document.getElementById("noteContent");
const saveNoteBtn = document.getElementById("saveNote");
const cancelFormBtn = document.getElementById("cancelForm");

function formatDate(isoString) {
  const date = new Date(isoString);
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}, ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
}

// Setup axios auth header from token
function setAuthHeader() {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

// Show notes app, hide auth forms
function showNotesApp() {
  authContainer.classList.add("hidden");
  notesApp.classList.remove("hidden");
  loadNotes();
}

// Show login/register forms, hide notes app
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

// On page load check token
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    setAuthHeader();
    // Optional: verify token validity by requesting a protected resource
    showNotesApp();
  } else {
    showAuth();
  }
});

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
  const email = loginUsername.value.trim(); // misalnya input ID-nya tetap 'loginUsername'
  const password = loginPassword.value.trim();

  if (!email || !password) {
    alert("Email dan password harus diisi.");
    return;
  }

  axios
    .post(`${apiUserUrl}/login`, { email, password }) // ✅ email di sini
    .then((res) => {
      const token = res.data.accessToken;
      if (!token) throw new Error("Token tidak ditemukan di response.");
      localStorage.setItem(tokenKey, token);
      setAuthHeader();
      showNotesApp();
    })
    .catch((err) => {
      alert("Login gagal: " + (err.response?.data?.message || err.message));
    });
});

// LOGOUT
logoutBtn.addEventListener("click", async () => {
  try {
    await fetch(`${apiUserUrl}/logout`, {
      method: "DELETE", // atau POST jika kamu pakai itu di backend
      credentials: "include", // agar cookie refreshToken terkirim
    });
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    localStorage.removeItem(tokenKey);
    setAuthHeader();
    showAuth();
  }
});

// NOTES APP FUNCTIONS

addNoteBtn.addEventListener("click", () => {
  openNoteForm();
});

cancelFormBtn.addEventListener("click", () => {
  closeNoteForm();
});

saveNoteBtn.addEventListener("click", () => {
  saveNote();
});

searchInput.addEventListener("input", () => {
  loadNotes(searchInput.value.trim());
});

// Open note form for new or edit note
function openNoteForm(note = null) {
  noteForm.classList.remove("hidden");
  if (note) {
    formTitle.textContent = "Edit Note";
    noteIdInput.value = note._id || "";
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
  } else {
    formTitle.textContent = "New Note";
    noteIdInput.value = "";
    noteTitleInput.value = "";
    noteContentInput.value = "";
  }
}

function closeNoteForm() {
  noteForm.classList.add("hidden");
}

// Load notes from backend, optionally filter by search query
function loadNotes(searchQuery = "") {
  setAuthHeader();
  console.log("Auth Header:", axios.defaults.headers.common["Authorization"]);
  axios
    .get(apiNotesUrl)
    .then((res) => {
      const query = searchQuery.toLowerCase();

      const colors = [
        "bg-blue-800",
        "bg-green-800",
        "bg-red-800",
        "bg-yellow-800",
        "bg-purple-800",
        "bg-indigo-800",
        "bg-pink-800",
        "bg-blue-600",
        "bg-green-600",
        "bg-red-600",
        "bg-yellow-600",
        "bg-purple-600",
        "bg-indigo-600",
        "bg-pink-600",
      ];

      let noteColors = JSON.parse(sessionStorage.getItem("noteColors")) || {};
      let availableColors = JSON.parse(
        sessionStorage.getItem("availableColors")
      ) || [...colors];

      function getUniqueColor() {
        if (availableColors.length === 0) {
          availableColors = [...colors];
        }
        const colorIndex = Math.floor(Math.random() * availableColors.length);
        return availableColors.splice(colorIndex, 1)[0];
      }

      let notes = res.data || [];
      if (query) {
        notes = notes.filter(
          (note) =>
            (note.title && note.title.toLowerCase().includes(query)) ||
            (note.content && note.content.toLowerCase().includes(query))
        );
      }

      notesContainer.innerHTML = "";
      notes.forEach((note) => {
        if (!noteColors[note.id]) {
          noteColors[note.id] = getUniqueColor();
        }

        const noteDiv = document.createElement("div");
        noteDiv.className = `${
          noteColors[note.id]
        } p-4 rounded-lg flex flex-col h-auto`;
        noteDiv.innerHTML = `
          <h3 class="text-lg font-bold">${note.title}</h3>
          <div class="note-content grow break-words">${marked.parse(
            note.content
          )}</div>
          <small class="mt-2 block text-white">${formatDate(
            note.created_at
          )}</small>
          <div class="flex justify-end space-x-2 mt-2">
            <button onclick="editNote(${note.id}, '${
          note.title
        }', '${encodeURIComponent(note.content)}')" 
                    class="text-blue-400 hover:text-yellow-300">
              <i class="fas fa-pen"></i>
            </button>
            <button onclick="deleteNote(${
              note.id
            })" class="text-red-700 hover:text-red-400">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        notesContainer.appendChild(noteDiv);
      });

      sessionStorage.setItem("noteColors", JSON.stringify(noteColors));
      sessionStorage.setItem(
        "availableColors",
        JSON.stringify(availableColors)
      );
    })
    .catch((err) => {
      if (err.response && err.response.status === 404) {
        alert("Gagal memuat catatan: Endpoint tidak ditemukan (404).");
      } else if (err.code === "ERR_NETWORK") {
        alert("Tidak dapat terhubung ke backend.");
      } else {
        alert(
          "Gagal memuat catatan: " +
            (err.response?.data?.message || err.message)
        );
      }
    });
}

function editNote(id, title, content) {
  content = decodeURIComponent(content);
  formTitle.innerText = "Edit Note";
  noteIdInput.value = id;
  noteTitleInput.value = title;
  noteContentInput.value = content;
  noteForm.classList.remove("hidden");
}

// Render notes cards
function renderNotes(notes) {
  notesContainer.innerHTML = "";
  if (notes.length === 0) {
    notesContainer.innerHTML = `<p class="text-center col-span-full text-gray-400">Tidak ada catatan ditemukan.</p>`;
    return;
  }
  notes.forEach((note) => {
    const card = document.createElement("div");
    card.className =
      "bg-gray-700 rounded p-4 shadow-md cursor-pointer hover:bg-gray-600 flex flex-col justify-between h-48";

    const title = document.createElement("h3");
    title.textContent = note.title || "(Tanpa Judul)";
    title.className = "font-bold mb-2 text-lg truncate";
    card.appendChild(title);

    // Render content markdown preview with marked.js
    const contentPreview = document.createElement("div");
    contentPreview.innerHTML = marked.parse(
      note.content ? note.content.substring(0, 150) : ""
    );
    contentPreview.className =
      "flex-grow overflow-hidden text-sm text-gray-300";
    card.appendChild(contentPreview);

    // Buttons container
    const btnContainer = document.createElement("div");
    btnContainer.className = "flex justify-end mt-3 space-x-2";

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
    editBtn.title = "Edit Note";
    editBtn.className =
      "text-yellow-400 hover:text-yellow-300 focus:outline-none";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openNoteForm(note);
    });
    btnContainer.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
    deleteBtn.title = "Delete Note";
    deleteBtn.className = "text-red-500 hover:text-red-400 focus:outline-none";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Yakin ingin menghapus catatan ini?")) {
        deleteNote(note._id);
      }
    });
    btnContainer.appendChild(deleteBtn);

    card.appendChild(btnContainer);

    notesContainer.appendChild(card);
  });
}

// Save new or update existing note
function saveNote() {
  setAuthHeader(); // Ensure Authorization header is set before making the request
  const id = noteIdInput.value;
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();

  if (!title && !content) {
    alert("Isi setidaknya judul atau konten.");
    return;
  }

  if (id) {
    // Update note
    axios
      .put(`${apiNotesUrl}/${id}`, { title, content })
      .then(() => {
        closeNoteForm();
        loadNotes(searchInput.value.trim());
      })
      .catch((err) => {
        alert(
          "Gagal menyimpan catatan: " +
            (err.response?.data?.message || err.message)
        );
      });
  } else {
    // Create new note
    axios
      .post(apiNotesUrl, { title, content })
      .then(() => {
        closeNoteForm();
        loadNotes(searchInput.value.trim());
      })
      .catch((err) => {
        alert(
          "Gagal menyimpan catatan: " +
            (err.response?.data?.message || err.message)
        );
      });
  }
}

// Delete note
function deleteNote(id) {
  axios
    .delete(`${apiNotesUrl}/${id}`)
    .then(() => {
      loadNotes(searchInput.value.trim());
    })
    .catch((err) => {
      alert(
        "Gagal menghapus catatan: " +
          (err.response?.data?.message || err.message)
      );
    });
}
