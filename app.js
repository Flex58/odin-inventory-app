const express = require("express");
const path = require("node:path");
const { indexRouter } = require("./routers/indexRouter");
const { pokemonRouter } = require("./routers/pokemonRouter");
const { teamRouter } = require("./routers/teamRouter");
const { trainersRouter } = require("./routers/trainersRouter");

const app = express();

const PORT = 3030;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/pokemon", pokemonRouter);
app.use("/teams", teamRouter);
app.use('/trainers', trainersRouter)
app.use("/", indexRouter);

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on Port ${PORT}`);
});
