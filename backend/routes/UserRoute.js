const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  loginHandler,
  logout
} = require('../controller/UserController.js');

const { refreshToken } = require('../controller/refreshToken.js');
const { verifyToken } = require('../middleware/VerifyToken.js');

// Gunakan implementasi refreshToken dari controller
router.post('/refresh', refreshToken);
router.post('/login', loginHandler);
router.delete('/logout', logout);

router.post("/register", createUser); // POST /api/users
router.get("/", verifyToken, getUsers); // GET /api/users
router.get("/:id", verifyToken, getUserById); // GET /api/users/:id
router.put("/edit-user/:id", verifyToken, updateUser); // PUT /api/users/:id
router.delete("/delete-user/:id", deleteUser); // DELETE /api/users/:id

// Ganti dengan secret key kamu
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";

// Endpoint refresh token
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  // Verifikasi refresh token
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    // Buat access token baru
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
});

module.exports = router;
