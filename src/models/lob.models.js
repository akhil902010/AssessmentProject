import mongoose from "mongoose";

const lobSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);

export const LOB = mongoose.model("lob", lobSchema);
