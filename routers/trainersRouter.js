const { Router } = require("express");
const trainerController = require("../controllers/trainersControllers");

const trainersRouter = Router();

trainersRouter.get("/createTrainer", trainerController.getTrainerForm);
trainersRouter.post("/createTrainer", trainerController.postTrainerForm);

module.exports = {
    trainersRouter
}
