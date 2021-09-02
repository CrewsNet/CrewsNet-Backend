const express = require("express");
const router = express.Router();

/* ---------------------------- Function Imports ---------------------------- */

const {
  dashBoard,
  signup,
  login,
  protect,
} = require("../../../controllers/Users/authController");
// const authController = require('../');
const { ensureAuth, ensureGuest } = require("../../../middleware/googleAuth");

/* -------------------------- Authorization Routes -------------------------- */

router.post("/signup", signup);
router.post("/login", login);
router.get("/dash", authPass, dashBoard);
router.patch("/confirmEmail/:id", authController.confirmEmail);

/* -------------------------- Forget PassWord Routes ------------------------- */

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router;
