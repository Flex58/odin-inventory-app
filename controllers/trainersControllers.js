const {
  body,
  query,
  validationResult,
  matchedData,
} = require("express-validator");

const db = require("../db/queries");

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
    console.log(data.generation)
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
