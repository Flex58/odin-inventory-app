const { Router } = require("express");
const trainerController = require("../controllers/trainersControllers");

const trainersRouter = Router();

trainersRouter.get("/createTrainer", trainerController.getTrainerForm);
trainersRouter.post("/createTrainer", trainerController.postTrainerForm);
trainersRouter.get('/', trainerController.getAllTrainers)

module.exports = {
    trainersRouter
}
