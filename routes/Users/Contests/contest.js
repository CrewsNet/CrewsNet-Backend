const express = require("express");
const router = express.Router();
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

router.get("/contests", contests);
router.patch("/save", authPass, saveContest);
router.get("/getContest", authPass, getSavedContest);
router.patch("/unSave", authPass, unSave);

module.exports = router;
