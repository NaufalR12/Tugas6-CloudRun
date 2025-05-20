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

router.get("/", verifyToken, getNotes);
router.post("/add", addNote);
router.put("/update/:id", updateNote);
router.delete("/delete/:id", deleteNote);

module.exports = router;
