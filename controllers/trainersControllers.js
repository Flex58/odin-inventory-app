const {
  body,
  query,
  validationResult,
  matchedData,
} = require("express-validator");

const db = require("../db/queries");
