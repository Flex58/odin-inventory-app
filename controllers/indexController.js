const db = require("../db/queries");

exports.getIndex = (req, res) => {
  res.render("index", { title: "PokemonDB" });
};
