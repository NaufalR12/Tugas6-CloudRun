// routes/NoteRoute.js
const express = require("express");
const router = express.Router();
const {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} = require("../controller/NoteController");
const { refreshToken } = require('../controller/refreshToken.js');
const { verifyToken } = require('../middleware/VerifyToken.js');

router.get("/notes", verifyToken, getNotes);
router.post("/notes", addNote);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

module.exports = router;
