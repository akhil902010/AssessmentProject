import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    inserted :{
      type:Boolean,
    }
  },
  { timestamps: true }
);

export const Message = mongoose.model("message", messageSchema);
