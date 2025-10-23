const {
  body,
  query,
  validationResult,
  matchedData,
} = require("express-validator");

const db = require("../db/queries");

const teamValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isAlphanumeric(undefined, { ignore: " " } )
    .withMessage("Name can only include letters and numbers."),
  body("poke1")
    .trim()
    .notEmpty()
    .withMessage("You need at least one Pokemon per team."),
  body("poke2").optional({ checkFalsy: true }).trim(),
  body("poke3").optional({ checkFalsy: true }).trim(),
  body("poke4").optional({ checkFalsy: true }).trim(),
  body("poke5").optional({ checkFalsy: true }).trim(),
  body("poke6").optional({ checkFalsy: true }).trim(),
];

exports.getTeamForm = async (req, res) => {
  const pokemon = await db.getPokemon();
  if (!pokemon) {
    throw new Error("Something went wrong");
  }
  res.render("createTeam", { title: "Create a Team", poke: pokemon });
};

exports.postTeam = [
  teamValidator,
  async (req, res) => {
    const pokemon = await db.getPokemon();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createTeam", {
        title: "Create a Team",
        poke: pokemon,
        errors: errors.array(),
      });
    }
    const data = matchedData(req);
    await db.addTeam(data);
    res.redirect("/");
  },
];
