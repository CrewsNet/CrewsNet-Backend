const express = require("express");
const authController = require("../../../controllers/Users/authController");
// const authController = require('../');

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;