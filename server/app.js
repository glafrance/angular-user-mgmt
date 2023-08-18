const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const constants = require("./constants/constants");
const usersRouter = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = 4002;

mongoose.connect('mongodb://localhost:27017/usermgmt',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);


app.use(`/${constants.USER}`, usersRouter);

app.listen(PORT, () => {
  console.log(`User management server listening on port ${PORT}`);
});