const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

/* ----------------------------- Defining Model ----------------------------- */

userSchema = new mongoose.Schema(
  {
    loginId: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    email: {
      type: String,
      // required: [true, "User should have an email"],
      unique: true,
      validator: [validator.isEmail, "Please provide a valid email"],
      lowercase: true,
    },
    confirmSignup: {
      type: Boolean,
      default: false,
    },
    emailToken: String,
    password: {
      type: String,
      minLength: [8, "Password should have minimum 8 letters"],
      select: false,
    },
    photo: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    savedContest: [
      {
        name: String,
        url: String,
        start_time: Date,
        end_time: Date,
        duration: String,
        site: String,
        in_24_hours: String,
        status: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

/* -------------------- Hashing The PassWord Before Save -------------------- */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 12)
  next()
})

/* --------------------------- Comparing Password --------------------------- */

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

/* --------------------- Generating PassWord Reset Token -------------------- */

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  console.log({ resetToken }, this.passwordResetToken)

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

/* ----------------------------- Exporting Model ---------------------------- */

const User = mongoose.model("User", userSchema)

module.exports = User
