const express = require("express");
const { signUp, login } = require("../../../controllers/Users/authController");
// const authController = require('../');

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

module.exports = router;
