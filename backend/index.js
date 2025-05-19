const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const noteRouter = require("./routes/NoteRoute");
const userRouter = require("./routes/UserRoute");
const cookieParser = require("cookie-parser");
const app = express();

// Konfigurasi CORS yang lebih lengkap
const corsOptions = {
  origin: 'https://frontend-nopal-dot-b-08-450916.uc.r.appspot.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 jam
};

// Terapkan CORS ke semua route
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware lainnya
app.use(bodyParser.json());
app.use(cookieParser());

// Tambahkan header CORS ke semua response
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://frontend-nopal-dot-b-08-450916.uc.r.appspot.com');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Routes
app.use("/api/note", noteRouter);
app.use("/api/users", userRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

