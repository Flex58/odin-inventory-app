const {
  body,
  query,
  validationResult,
  matchedData,
} = require("express-validator");

const db = require("../db/queries");
const { render } = require("ejs");

const trainerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Please enter a Name.")
    .isLength({ max: 50 })
    .withMessage("Name can't be longer than 50 characters.")
    .isAlpha()
    .withMessage("Only Letters allowed in Name."),
  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Please select a Gender.")
    .isIn(["male", "female", "other"])
    .withMessage("Please select one of the given Gender options."),
  body("generation")
    .trim()
    .notEmpty()
    .withMessage("Please select a Generation")
    .isInt()
    .withMessage("Please select one of the given Generation options."),
  body("pos")
    .trim()
    .notEmpty()
    .withMessage("Please select the Trainers Position.")
    .isInt()
    .withMessage("Please select one of the given Position options."),
  body("team")
    .optional()
    .trim()
    .isInt()
    .withMessage("Select one of the given Team options, or create on later."),
];

exports.postTrainerForm = [
  trainerValidator,
  async (req, res) => {
    const errors = validationResult(req);
    const team = await db.getTeams();
    const generation = await db.getGeneration();
    if (!errors.isEmpty()) {
      res.status(400).render("createTrainer", {
        title: "Add a Trainer",
        errors: errors.array(),
        team: team,
        generation: generation,
      });
    }
    const data = matchedData(req);
    await db.addTrainer(data);
    res.redirect("/");
  },
];

exports.getTrainerForm = async (req, res) => {
  const team = await db.getTeams();
  const generation = await db.getGeneration();
  if (!team || !generation) {
    throw new Error("Something went Wrong!");
  }
  res.render("createTrainer", {
    title: "Add a Trainer",
    team: team,
    generation: generation,
  });
};

exports.getAllTrainers = async (req, res) => {
  const trainers = await db.getAllTrainers();
  if (!trainers) {
    throw new Error("Something went Wrong!");
  }
  trainers.forEach((trainer) => {
    trainer.pos = trainer.pos == 0 ? "Champion" : trainer.pos;
    trainer.pos = trainer.pos == 5 ? "Not in Elite 4" : trainer.pos;
  });

  res.render("viewTrainers", {
    title: "View all Trainers",
    trainers: trainers,
  });
};

exports.detailTrainer = async (req, res) => {
  const id = req.params.id;

  const trainer = await db.getSingleTrainer(id);
  const team = await db.getSingleTeam(trainer.team);
  trainer.pos = trainer.pos == 0 ? "Champion" : trainer.pos;
  trainer.pos = trainer.pos == 5 ? "Not in Elite 4" : trainer.pos;

  res.render("detailTrainers", {
    title: "View details of Trainer",
    trainer: trainer,
    team: team,
  });
};

exports.getEditForm = async (req, res) => {
  const id = req.params.id;

  const trainer = await db.getSingleTrainer(id);
  const generation = await db.getGeneration();
  const team = await db.getTeams();
  res.render("editTrainers", {
    title: "Edit a Trainer",
    trainer: trainer,
    generation: generation,
    team: team,
  });
};

exports.editForm = [
  trainerValidator,
  async (req, res) => {
    const id = req.params.id;
    const errors = validationResult(req);
    const trainer = db.getSingleTrainer(id);
    const team = await db.getTeams();
    const generation = await db.getGeneration();
    if (!errors.isEmpty()) {
      res.status(400).render("editTrainers", {
        title: "Edit a Trainer",
        errors: errors.array(),
        team: team,
        generation: generation,
        trainer: trainer,
      });
    }
    const data = matchedData(req);
    await db.editTrainer(data, id);
    res.redirect("/");
  },
];

exports.getDeleteForm = async (req, res) => {
  const id = req.params.id;

  res.render("deleteTrainer", { title: "Delete a Trainer", id: id });
};

exports.deleteTrainer = async (req, res) => {
  const id = req.params.id;

  await db.deleteTrainer(id);

  res.redirect("/");
};
