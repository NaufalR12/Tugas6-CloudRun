const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET
async function getUsers(req, res) {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET BY ID
async function getUserById(req, res) {
  try {
    const response = await User.findOne({ where: { id: req.params.id } });
    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// REGISTER
async function createUser(req, res) {
  try {
    const { name, email, gender, password } = req.body;
    const encryptPassword = await bcrypt.hash(password, 10);
    await User.create({
      name: name,
      email: email,
      gender: gender,
      password: encryptPassword,
    });
    res.status(201).json({ message: "Register Berhasil" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateUser(req, res) {
  try {
    const { name, email, gender, password } = req.body;

    const user = await User.findOne({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User tidak ditemukan",
      });
    }

    let updatedData = {
      name,
      email,
      gender,
    };

    if (password) {
      const encryptPassword = await bcrypt.hash(password, 10);
      updatedData.password = encryptPassword;
    }

    const result = await User.update(updatedData, {
      where: {
        id: req.params.id,
      },
    });

    if (result[0] === 0) {
      return res.status(404).json({
        status: "failed",
        message: "User tidak ditemukan atau tidak ada data yang berubah",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User Updated",
    });
  } catch (error) {
    console.error("Error during user update:", error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
}

async function deleteUser(req, res) {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });
    if (result === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "Failed",
        message: "Email atau password salah",
      });
    }

    const userPlain = user.toJSON();
    const { password: _, refresh_token: __, ...safeUserData } = userPlain;

    const decryptPassword = await bcrypt.compare(password, user.password);
    if (!decryptPassword) {
      return res.status(400).json({
        status: "Failed",
        message: "Email atau password salah",
      });
    }

    const accessToken = jwt.sign(
      safeUserData,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "5m",
      }
    );
    const refreshToken = jwt.sign(
      safeUserData,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await User.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });

    res.status(200).json({
      status: "Success",
      message: "Login Berhasil",
      safeUserData,
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const user = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    await User.update(
      { refresh_token: null },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginHandler,
  logout,
};
