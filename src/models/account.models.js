import mongoose from "mongoose";
// import { User } from '../models/user.models.js'

const accountSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
  },
  { timestamps: true }
);

export const Account = mongoose.model("account", accountSchema);
