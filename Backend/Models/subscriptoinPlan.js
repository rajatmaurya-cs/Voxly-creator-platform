// models/Plan.js

import mongoose from "mongoose";

const planSchema = new mongoose.Schema(

  {
    name: {
      type: String,
      enum: ["FREE", "PRO", "PLUS"],
      required: true,
      unique: true,
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    durationInDays: {
      type: Number,
      default: 30,
    },

    features: {

      aiSummarizationPerDay: {
        type: Number,
        default: 1,
      },

      aiGenerationPerDay: {
        type: Number,
        default: 0,
      },

      canUseAiGeneration: {
        type: Boolean,
        default: false,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;