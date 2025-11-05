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
    .isAlphanumeric(undefined, { ignore: " " })
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

exports.viewAllTeams = async (req, res) => {
  const teams = await db.getAllTeams();
  if (!teams) {
    throw new Error("Something went wrong");
  }
  res.render("viewTeams", { title: "View all Teams", teams: teams });
};

exports.detailTeam = async (req, res) => {
  const id = req.params.id;

  const teams = await db.getSingleTeam(id);
  const pokemon = [];
  for (property in teams) {
    if (property == "id" || property == "name") {
      continue;
    } else {
      const value = teams[property];
      const poke = await db.getSinglePokemon(value);
      pokemon.push(poke[0]);
    }
  }

  res.render("detailTeams", {
    title: "View Details",
    teams: teams,
    pokemon: pokemon,
  });
};

exports.getEditForm = async (req, res) => {
  const id = req.params.id;
  const pokemon = await db.getPokemon();
  const teams = await db.getSingleTeam(id);
  if (!pokemon) {
    throw new Error("Something went wrong");
  }
  res.render("editTeams", {
    title: "Edit a Team",
    poke: pokemon,
    teams: teams,
  });
};

exports.postEditTeam = [
  teamValidator,
  async (req, res) => {
    const id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const teams = await db.getSingleTeam(id);
      const pokemon = await db.getPokemon();
      return res.status(400).render("editTeams", {
        title: "Create a Team",
        poke: pokemon,
        errors: errors.array(),
        teams: teams,
      });
    }
    const data = matchedData(req);
    await db.editTeam(data, id);
    res.redirect("/");
  },
];

exports.getDeleteTeams = async (req, res) => {
  const id = req.params.id;

  res.render("deleteTeam", { title: "Delete a Team", id: id });
};

exports.deleteTeams = async (req, res) => {
  const id = req.params.id;

  await db.deleteTeams(id);
  res.redirect("/");
};
