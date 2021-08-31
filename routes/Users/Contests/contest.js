const express = require("express");
const router = express.Router();
const axios = require("axios");
const {
  contests,
} = require("../../../controllers/Users/Contest/contestController");

router.get("/contests", contests);

module.exports = router;
