import mongoose from "mongoose";

const carrierSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Carrier = mongoose.model("carrier", carrierSchema);
