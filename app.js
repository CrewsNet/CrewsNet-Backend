const express = require("express");
const morgan = require("morgan");
const session = require("express-session")
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo")
const passport = require("passport")
require("./helpers/passportGoogle")(passport)
require("./helpers/passportGithub")(passport)

const userRouter = require("./routes/Users/auth/userRoutes");
const contestRouter = require("./routes/Users/Contests/contest");

const app = express();
dotenv.config({ path: "./config.env" });

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use(express.Router());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE,
    }),
  })
  )
  
  //Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/auth", require("./routes/Users/auth/googleAuth"))
app.use("/auth", require("./routes/Users/auth/githubAuth"))
app.use("/api/users", userRouter);
app.use("/user", contestRouter);

module.exports = app;
