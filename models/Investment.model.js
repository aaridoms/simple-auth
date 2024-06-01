const { Schema, model } = require("mongoose");

const investmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    risk: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: [true, "Risk is required."],
    },
    interesRate: {
      type: Number,
      required: [true, "Interest Rate is required."],
    },
    category: {
      type: [String],
      enum: [
        "Stocks",
        "Bonds",
        "Mutual Funds",
        "ETFs",
        "Real Estate",
        "Commodities",
        "Cryptocurrency",
        "Cash Equivalents",
      ],
      required: [true, "Category is required."],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required."],
    },
    notes: {
      type: String,
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  {
    timestamps: true,
  }
);

const Investment = model("Investment", investmentSchema);

module.exports = Investment;
