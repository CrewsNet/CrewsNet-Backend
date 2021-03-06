const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
// const MongoStore = require("connect-mongo");
// const passport = require("passport");
// require("./helpers/passportGoogle")(passport);
// require("./helpers/passportGithub")(passport);

/* ---------------------------- Function Imports ---------------------------- */

const userRouter = require("./routes/Users/auth/userRoutes");
const contestRouter = require("./routes/Users/Contests/contest");
const profileRouter = require("./routes/Users/Profile/userProfile");
const globalErrorHandler = require("./controllers/Users/errorController");
const AppError = require("./utils/appError");

const app = express();
dotenv.config({ path: "./config.env" });
// app.use(cors({ credentials: true, origin: true }))
/* --------------------------- Express MiddleWares -------------------------- */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use(express.Router());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//CORS POLICY
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next()
// })

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next(); // dont forget this
});

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.DATABASE,
//     }),
//   })
// )

// //Passport middleware
// app.use(passport.initialize())
// app.use(passport.session())

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/* ------------------------------ Route Section ----------------------------- */

/* ------------------- Auth Routes ------------------------ */

// app.use("/auth", require("./routes/Users/auth/googleAuth"));
// app.use("/auth", require("./routes/Users/auth/githubAuth"));

/* ---------------------User Routes------------------------ */

app.use("/users", userRouter);
app.use("/user/contest", contestRouter);
app.use("/user", profileRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
