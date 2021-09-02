const catchAsync = require("./../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../../utils/appError");
const sendEmail = require("./../../utils/email");
const crypto = require("crypto");

/* ---------------------------- Function Imports ---------------------------- */

const User = require("./../../models/userModel");

/* ---------------------------- Generating Token ---------------------------- */

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/* ----------------------- Setting Token In the Cookie ---------------------- */

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

/* ---------------------------- SignUp Controller --------------------------- */

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    emailToken: crypto.randomBytes(64).toString("hex"),
  });

  await newUser.save();

  const confirmURL = `${req.protocol}://${req.get(
    "host"
  )}/api/users/confirmEmail/${newUser.emailToken}`;

  const message = `Confirm Your Email by sending a patch request at: ${confirmURL}.\n`;

  try {
    await sendEmail({
      email: newUser.email,
      subject: "Confirm Your Email",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Confirmation Mail Sent!",
    });
  } catch (err) {
    newUser.email = undefined;
    newUser.token = undefined;
    await newUser.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

/* ---------------------------- Post Login Route ---------------------------- */

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (user.confirmSignup === false) {
    return next(new AppError("Please Confirm Your Email First", 401));
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);

  //   const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

/* ----------------------------- DashBoard Route ---------------------------- */

exports.dashBoard = catchAsync(async (req, res) => {
  res.status(200).json({
    message: "Success",
    data: "Success While Logging in",
  });
});

/* ----------------------- DashBoard Protection Route ----------------------- */

exports.authPass = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(400).json({
      message: "You arent Logged In",
    });
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(400).json({
      message: "You arent Logged In",
    });
  }

  // 4) Check if user changed password after the token was issued

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

/* -------------------- Forget PassWord Logic Controller ------------------- */

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

/* ----------------------- Mail Confirming Controller ----------------------- */

exports.confirmEmail = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({ emailToken: req.params.token });

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    user.emailToken = null;
    user.confirmSignup = true;
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/signup");
  }
});
