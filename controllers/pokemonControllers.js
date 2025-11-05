const {
  body,
  query,
  validationResult,
  matchedData,
} = require("express-validator");

const db = require("../db/queries");
const { render } = require("ejs");

const pokemonValidation = [
  body("dexnr")
    .trim()
    .notEmpty()
    .withMessage("Dex Number is required")
    .isInt({ min: 1, max: 1025 })
    .withMessage("Dex Number must be between 1 and 1025"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isAlphanumeric()
    .withMessage("Name cannot include special symbols(*&^/%<>~$#@!...)"),
  body("type1").trim().notEmpty().withMessage("Please select a primary-type"),
  body("type2").trim(),
  body("generation")
    .trim()
    .notEmpty()
    .withMessage("Please select a generation"),
  body("mega")
    .toBoolean()
    .isBoolean({ strict: false })
    .withMessage("System Error"),
];

exports.postPokemon = [
  pokemonValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const type = await db.getTypes();
      const generation = await db.getGeneration();
      return res.status(400).render("createPokemon", {
        title: "Create a Pokemon",
        errors: errors.array(),
        type: type,
        generation: generation,
      });
    }
    const data = matchedData(req);
    await db.addPokemon(data);
    await res.redirect("/");
  },
];

exports.getPokemonForm = async (req, res) => {
  const type = await db.getTypes();
  const generation = await db.getGeneration();
  if (!type || !generation) {
    throw new Error("Something went wrong");
  }
  res.render("createPokemon", {
    title: "Create a Pokemon",
    type: type,
    generation: generation,
  });
};

exports.getAllPokemon = async (req, res) => {
  const pokemon = await db.getAllPokemon();
  if (!pokemon) {
    throw new Error("Something went wrong");
  }
  res.render("viewPokemon", { title: "All Pokemon", pokemon: pokemon });
};

exports.detailPokemon = async (req, res) => {
  const dexnr = req.params.dexnr;
  const pokemon = await db.getSinglePokemon(dexnr);
  res.render("detailPokemon", {
    title: "Detailed view of ",
    pokemon: pokemon[0],
  });
};

exports.getDeletePokemon = async (req, res) => {
  const dexnr = req.params.dexnr

  res.render('deletePokemon', {title: "Delete a Pokemon", dexnr: dexnr})
}

exports.deletePokemon = async (req, res) => {
  const dexnr = req.params.dexnr;
  await db.deletePokemon(dexnr);
  // await db.removePokemonFromTeam(dexnr);
  res.redirect("/pokemon");
};

exports.editPokemon = [
  pokemonValidation,
  async (req, res) => {
    const errors = validationResult(req);
    const dexnr = req.params.dexnr;
    if (!errors.isEmpty()) {
      const pokemon = await db.getSinglePokemon(dexnr);
      const type = await db.getTypes();
      const generation = await db.getGeneration();
      return res.status(400).render("editPokemon", {
        title: "Edit a Pokemon",
        errors: errors.array(),
        type: type,
        generation: generation,
        pokemon: pokemon[0],
      });
    }
    const data = matchedData(req);
    await db.editPokemon(data, dexnr);
    await res.redirect("/");
  },
];

exports.getEditPokemon = async (req, res) => {
  const dexnr = req.params.dexnr;
  const type = await db.getTypes();
  const generation = await db.getGeneration();
  const pokemon = await db.getSinglePokemon(dexnr);

  res.render("editPokemon", {
    title: "Edit a Pokemon",
    pokemon: pokemon[0],
    generation: generation,
    type: type,
  });
};
