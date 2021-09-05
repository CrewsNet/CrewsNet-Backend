const express = require("express");
const { authPass } = require("../../../controllers/Users/authController");
const {
  profile,
} = require("../../../controllers/Users/Profile/profileController");
const router = express.Router();

router.get("/profile", authPass, profile);

module.exports = router;
