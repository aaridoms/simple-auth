const { Schema, model } = require("mongoose");

const expenseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required.'],
    },
    category: {
      type: [String],
      enum: ['Food', 'Transportation', 'Housing', 'Utilities', 'Insurance', 'Medical & Healthcare', 'Debt Payments', 'Personal', 'Recreation & Entertainment', 'Miscellaneous'],
      required: [true, 'Category is required.']
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    }
  },
  {
    timestamps: true
  }
);

const Expense = model("Expense", expenseSchema);

module.exports = Expense;