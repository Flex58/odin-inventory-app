const teamController = require("../controllers/teamController");
const { Router } = require("express");

const teamRouter = Router();

teamRouter.get("/createTeam", teamController.getTeamForm);
teamRouter.post("/createTeam", teamController.postTeam);
teamRouter.get("/:id", teamController.detailTeam);
teamRouter.get("/", teamController.viewAllTeams);

module.exports = { teamRouter };
