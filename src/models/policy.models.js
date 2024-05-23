import mongoose from "mongoose";

const plicySchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: true,
    },
    policyStartDate: {
      type: Date,
      required: true,
    },
    policyEndDate: {
      type: Date,
      required: true,
    },
    policyCategoryCollectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "LOB"
    },
    companyCollectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Carrier"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : 'User'
    },
  },
  { timestamps: true }
);

export const Policy = mongoose.model("policy", plicySchema);
