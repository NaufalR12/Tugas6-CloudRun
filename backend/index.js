const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const noteRouter = require("./routes/NoteRoute");
const userRouter = require("./routes/UserRoute");
const cookieParser = require("cookie-parser");
const app = express();

// Konfigurasi CORS yang lebih spesifik
const corsOptions = {
  origin: "https://frontend-nopal-dot-b-08-450916.uc.r.appspot.com",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Terapkan middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRouter);
app.use("/api", noteRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

