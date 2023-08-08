const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const PORT = 4002;

app.use("/", (req, res) => {
  res.send("first simple api endpoint");
});

app.listen(PORT, () => {
  console.log(`User management server listening on port ${PORT}`);
});