const express = require("express");
const router = express.Router();

/* ----------------------------- Requiring Files ---------------------------- */

const {
  contests,
} = require("../../../controllers/Users/Contest/contestController");

const { authPass } = require("../../../controllers/Users/authController");
const {
  profile,
} = require("../../../controllers/Users/Profile/profileController");
const {
  saveContest,
  getSavedContest,
} = require("../../../controllers/Users/Contest/saveContestController");
const {
  unSave,
} = require("../../../controllers/Users/Contest/unSaveController");

/* ------------------- Fetching Contest From External Site ------------------ */

router.get("/", contests);

/* ----------------------------- Saving Contest ----------------------------- */

router.patch("/save", authPass, saveContest);

/* -------------------------- Getting Saved Contest ------------------------- */

router.get("/getSave", authPass, getSavedContest);

/* ---------------------------- Unsaving Contest ---------------------------- */

router.patch("/unSave", authPass, unSave);

/* -------------------------------------------------------------------------- */

module.exports = router;
