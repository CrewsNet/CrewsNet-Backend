const GitHubStrategy = require("passport-github2").Strategy;
const mongoose = require("mongoose");
const User = require("../models/userModel");
const undefsafe = require("undefsafe");

module.exports = function (passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    loginId: profile.id,
                    name: profile.displayName,
                    photo: profile.photos[0].value,
                    email: profile.profileUrl,
                }
                try {
                    let user = await User.findOne({ loginId: profile.id })

                    if (user) {
                        done(null, user)
                    } else {
                        user = await User.create(newUser)
                        done(null, user)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
