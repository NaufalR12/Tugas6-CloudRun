import { showNotesApp, showAuth, clearAuthForms, setupAuthEventListeners } from "./auth.js";
import { loadNotes, setupNotesEventListeners } from "./notes.js";
import { setAuthHeader } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    setAuthHeader();
    showNotesApp();
    loadNotes();
  } else {
    showAuth();
    clearAuthForms();
  }
  setupAuthEventListeners(() => {
    showNotesApp();
    loadNotes();
  });
  setupNotesEventListeners();
}); 