const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const noteRouter = require("./routes/NoteRoute");
const userRouter = require("./routes/UserRoute");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/note", noteRouter);
app.use("/api/users", userRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//tes update
