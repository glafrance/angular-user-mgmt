const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const constants = require("./constants/constants");
const usersRouter = require("./routes/users");

const app = express();

const corsSettings = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsSettings));
app.use(express.json());
app.use(express.static('public'));

const options = {
  key: fs.readFileSync("../localhost-key.pem"),
  cert: fs.readFileSync("../localhost.pem")
};

const PORT = 4002;

mongoose.connect('mongodb://localhost:27017/usermgmt',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);


app.use(`/${constants.USER}`, usersRouter);

https.createServer(options, app).listen(PORT, () => {
  console.log(`User management server listening on port ${PORT}`);
});;
