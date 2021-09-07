const express = require("express");
const { authPass } = require("../../../controllers/Users/authController");
const {
  profile,
  getInfo,
} = require("../../../controllers/Users/Profile/profileController");
const router = express.Router();

router.get("/profile", authPass, profile);

router.get("/getInfo", authPass, getInfo);

module.exports = router;
