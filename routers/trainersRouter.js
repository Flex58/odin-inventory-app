const { Router } = require("express");
const trainerController = require("../controllers/trainersControllers");

const trainersRouter = Router();

trainersRouter.get("/createTrainer", trainerController.getTrainerForm);
trainersRouter.post("/createTrainer", trainerController.postTrainerForm);
trainersRouter.get("/:id", trainerController.detailTrainer);
trainersRouter.get("/:id/edit", trainerController.getEditForm);
trainersRouter.post("/:id/edit", trainerController.editForm);
trainersRouter.get("/:id/delete", trainerController.getDeleteForm);
trainersRouter.post("/:id/delete", trainerController.deleteTrainer);
trainersRouter.get("/", trainerController.getAllTrainers);

module.exports = {
  trainersRouter,
};
