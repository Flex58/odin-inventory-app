const pokemonController = require("../controllers/pokemonControllers");
const { Router } = require("express");

const pokemonRouter = Router();

pokemonRouter.get("/createPokemon", pokemonController.getPokemonForm);
pokemonRouter.post("/createPokemon", pokemonController.postPokemon);
pokemonRouter.get("/", pokemonController.getAllPokemon);
pokemonRouter.get("/:dexnr", pokemonController.detailPokemon);
pokemonRouter.get("/:dexnr/edit", pokemonController.getEditPokemon);
pokemonRouter.post("/:dexnr/edit", pokemonController.editPokemon);
pokemonRouter.get("/:dexnr/delete", pokemonController.getDeletePokemon);
pokemonRouter.post("/:dexnr/delete", pokemonController.deletePokemon);

module.exports = { pokemonRouter };
