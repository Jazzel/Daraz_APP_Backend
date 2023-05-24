const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "admin",
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Blocked"],
      default: "Pending",
    },
    confirmationCode: {
      type: String,
    },
    businessname: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("users", UserSchema);
