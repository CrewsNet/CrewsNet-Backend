const express = require("express");
const router = express.Router();

/* ---------------------------- Function Imports ---------------------------- */

const {
    dashBoard,
    signup,
    login,
    googleLogin,
    googleLoginMobile,
    githubLogin,
    githubLoginUser,
    authPass,
    confirmEmail,
    forgotPassword,
    resetPassword,
    getSignup,

    getLogin,
    getToken,
} = require("../../../controllers/Users/authController");
// const authController = require('../');
const { ensureAuth, ensureGuest } = require("../../../middleware/googleAuth");

/* -------------------------- Authorization Routes -------------------------- */

router.post("/signup", signup).get("/signup", getSignup);
router.post("/login", login).get("/login", getLogin);
router.get("/dash", authPass, dashBoard);
router.get("/confirmEmail", confirmEmail);
router.post("/auth/google", googleLogin);
router.post("/auth/google-mobile", googleLoginMobile);
router.get("/auth/github", githubLogin);
router.get("/auth/githubuser", githubLoginUser);

/* -------------------------- Forget PassWord Routes ------------------------- */

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

/* ------------------------- Token Conversion Route ------------------------- */

router.get("/getToken", getToken);

module.exports = router;