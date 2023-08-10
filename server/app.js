const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const PORT = 4002;

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/usermgmt',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const usersRouter = require("./routes/users");

app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`User management server listening on port ${PORT}`);
});