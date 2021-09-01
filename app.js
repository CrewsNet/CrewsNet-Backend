const express = require("express");
const morgan = require("morgan");

const userRouter = require("./routes/Users/auth/userRoutes");
const contestRouter = require("./routes/Users/Contests/contest");
const globalErrorHandler = require('./controllers/Users/errorController');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// app.use(express.Router());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 3) ROUTES
app.use("/api/users", userRouter);
app.use("/user", contestRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;