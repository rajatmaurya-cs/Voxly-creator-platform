import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["free", "pro", "plus"],
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    limits: {
      aiGeneration: {
        type: Number,
        required: true,
      },

      aiSummarizer: {
        type: Number,
        required: true,
      },
     
    },
    
  },
  {
    timestamps: true,
  }
);

export const Plan =
  mongoose.models.Plan || mongoose.model("Plan", planSchema);