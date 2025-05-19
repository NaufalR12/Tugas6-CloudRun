const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const noteRouter = require("./routes/NoteRoute");
const userRouter = require("./routes/UserRoute");
const cookieParser = require("cookie-parser");
const app = express();

// Konfigurasi CORS yang lebih sederhana
app.use(cors({
  origin: true, // Izinkan semua origin untuk sementara
  credentials: true
}));

// Middleware lainnya
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api/note", noteRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

