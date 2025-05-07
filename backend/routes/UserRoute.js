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

//endpoint akses token
router.get('/token', refreshToken);
//endpoin auth
router.post('/login', loginHandler);
router.delete('/logout', logout);

//endpoint data biasa
router.post("/register", createUser); //tambah user
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.put("/edit-user/:id", verifyToken, updateUser);
router.delete("/delete-user/:id", deleteUser);

module.exports = router;
