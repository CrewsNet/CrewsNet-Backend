const express = require("express");
const { signUp, login } = require("../../../controllers/Users/authController");
// const authController = require('../');
const { ensureAuth, ensureGuest } = require("../../../middleware/googleAuth")

const router = express.Router();

router.post("/signup", signUp);
//Login page
router.post("/login", login);
// router.get("/login", ensureGuest, login)


module.exports = router;
