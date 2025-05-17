const express = require('express');
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

const router = express.Router();

// routes/UserRoute.js
router.get('/token', refreshToken);
router.post('/login', loginHandler);
router.delete('/logout', logout);

router.post("/register", createUser); // POST /api/users
router.get("/", verifyToken, getUsers); // GET /api/users
router.get("/:id", verifyToken, getUserById); // GET /api/users/:id
router.put("/edit-user/:id", verifyToken, updateUser); // PUT /api/users/:id
router.delete("/delete-user/:id", deleteUser); // DELETE /api/users/:id


module.exports = router;
