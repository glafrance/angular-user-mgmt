const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const constants = require("./constants/constants");
const usersRouter = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4002;

mongoose.connect('mongodb://localhost:27017/usermgmt',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);


app.use(`/${constants.SIGNUP}`, usersRouter);

app.listen(PORT, () => {
  console.log(`User management server listening on port ${PORT}`);
});