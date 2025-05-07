const express = require("express");
const router = express.Router();
const db = require("../config/Database");

// Fungsi untuk membuat user (insert ke DB)
const createUser = (userData, callback) => {
  const sql = `INSERT INTO user (name, email, gender, password, refresh_token) VALUES (?, ?, ?, ?, ?)`;
  const values = [
    userData.name,
    userData.email,
    userData.gender,
    userData.password,
    userData.refresh_token,
  ];

  db.query(sql, values, callback);
};

// Fungsi untuk ambil semua user
const getAllUsers = (callback) => {
  db.query("SELECT * FROM user", callback);
};

module.exports = {
  createUser,
  getAllUsers,
};
