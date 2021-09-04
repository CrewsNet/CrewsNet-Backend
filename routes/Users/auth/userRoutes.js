const express = require("express")
const router = express.Router()

/* ---------------------------- Function Imports ---------------------------- */

const {
  dashBoard,
  signup,
  login,
  googleLogin,
  authPass,
  confirmEmail,
  forgotPassword,
  resetPassword,
  getSignup,

  getLogin,
  getToken,
} = require("../../../controllers/Users/authController")
// const authController = require('../');
const { ensureAuth, ensureGuest } = require("../../../middleware/googleAuth")

/* -------------------------- Authorization Routes -------------------------- */

<<<<<<< HEAD
router.post("/signup", signup).get("/signup", getSignup);
router.post("/login", login).get("/login", getLogin);
router.get("/dash", authPass, ensureAuth, dashBoard);
router.patch("/confirmEmail/:id", confirmEmail);
router.post("/auth/google", googleLogin)
=======
router.post("/signup", ensureGuest, signup).get("/signup", getSignup)
router.post("/login", ensureGuest, login).get("/login", getLogin)
router.get("/dash", authPass, ensureAuth, dashBoard)
router.get("/confirmEmail", confirmEmail)
>>>>>>> 4fffe6868bfb829f5e4bc071e93e9618839f99b0

/* -------------------------- Forget PassWord Routes ------------------------- */

router.post("/forgotPassword", forgotPassword)
router.patch("/resetPassword/:token", resetPassword)

/* ------------------------- Token Conversion Route ------------------------- */

router.get("/getToken", getToken)

module.exports = router
