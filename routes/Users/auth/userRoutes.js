const express = require("express");
const {
  dashBoard,
  signup,
  login,
  protect,
} = require("../../../controllers/Users/authController");
// const authController = require('../');
const { ensureAuth, ensureGuest } = require("../../../middleware/googleAuth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/dash", authPass, dashBoard);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/confirmEmail/:id", authController.confirmEmail);

module.exports = router;
