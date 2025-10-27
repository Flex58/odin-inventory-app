const pokemonController = require("../controllers/pokemonControllers");
const { Router } = require("express");

const pokemonRouter = Router();

pokemonRouter.get("/createPokemon", pokemonController.getPokemonForm);
pokemonRouter.post("/createPokemon", pokemonController.postPokemon);
pokemonRouter.get("/", pokemonController.getAllPokemon);

module.exports = { pokemonRouter };
