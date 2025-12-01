// server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
      default: "jobseeker",
    },
  },
  { timestamps: true }
);

// ⚠ TEMP VERSION: no pre('save') hook, so NO next() at all
// We will hash later if needed.

// simple password check (will still work even without hashing for now)
userSchema.methods.matchPassword = async function (enteredPassword) {
  // if you later add hashing, change this to bcrypt.compare
  return enteredPassword === this.password;
};

module.exports = mongoose.model("User", userSchema);
