const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const noteRouter = require("./routes/NoteRoute");
const userRouter = require("./routes/UserRoute");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors({
  origin: 'https://frontend-nopal-dot-b-08-450916.uc.r.appspot.com',
  credentials: true
}));
app.options('*', cors({
  origin: 'https://frontend-nopal-dot-b-08-450916.uc.r.appspot.com',
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/note", noteRouter);
app.use("/api/users", userRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//tes update
