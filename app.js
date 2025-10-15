const express = require("express");
const path = require("node:path");

const app = express();

const PORT = 3030;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on Port ${PORT}`);
});
