const { Schema, model } = require("mongoose");

const OperationSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, "Name is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending"
    },
    earnings: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

const Operation = model("Operation", OperationSchema);

module.exports = Operation;
