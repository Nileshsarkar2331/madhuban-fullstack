const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
