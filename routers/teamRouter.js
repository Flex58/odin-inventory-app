const teamController = require("../controllers/teamController");
const { Router } = require("express");

const teamRouter = Router();

teamRouter.get("/createTeam", teamController.getTeamForm);
teamRouter.post("/createTeam", teamController.postTeam);
teamRouter.get("/:id", teamController.detailTeam);
teamRouter.get("/:id/edit", teamController.getEditForm);
teamRouter.post("/:id/edit", teamController.postEditTeam);
teamRouter.get('/:id/delete', teamController.getDeleteTeams)
teamRouter.post('/:id/delete', teamController.deleteTeams)
teamRouter.get("/", teamController.viewAllTeams);

module.exports = { teamRouter };
