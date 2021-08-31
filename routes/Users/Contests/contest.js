const express = require("express");
const router = express.Router();
const {
  contests,
} = require("../../../controllers/Users/Contest/contestController");

router.get("/contests", contests);

module.exports = router;
