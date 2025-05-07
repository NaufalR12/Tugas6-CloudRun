// routes/NoteRoute.js
const express = require("express");
const router = express.Router();
const {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} = require("../controller/NoteController");

router.get("/notes", getNotes);
router.post("/notes", addNote);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

module.exports = router;
