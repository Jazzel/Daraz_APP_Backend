const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ContactScheme = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Contact = mongoose.model("contact", ContactScheme);
