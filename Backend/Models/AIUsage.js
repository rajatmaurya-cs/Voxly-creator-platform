import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    aiGenerationUsed: {
      type: Number,
      default: 0,
    },

    aiSummarizerUsed: {
      type: Number,
      default: 0,
    },
    
    lastResetAt: {
    type: Date,
    default: Date.now,
  },

  
  },

  {
    timestamps: true,
  }
);

export const AIUsage =
  mongoose.models.AIUsage || mongoose.model("AIUsage", usageSchema);