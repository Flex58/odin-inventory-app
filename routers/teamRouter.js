const teamController = require("../controllers/teamController");
const { Router } = require("express");

const teamRouter = Router();

teamRouter.get("/createTeam", teamController.getTeamForm);
teamRouter.post("/createTeam", teamController.postTeam);

module.exports = { teamRouter };
