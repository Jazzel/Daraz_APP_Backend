const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DiscountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    startsFrom: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = Discount = mongoose.model("discount", DiscountSchema);
