const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User'
    },
    expenses: [{
      type: Schema.Types.ObjectId,
      ref: 'Expense'
    }],
    operation: [{
      type: Schema.Types.ObjectId,
      ref: 'Operation'
    }],
    funds: {
      type: Number,
      required: [true, 'Funds is required.'],
      default: 0
    },
    profilePic: {
      type: String,
  },
  },
  { 
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;