import "dotenv/config";
import mongoose from "mongoose";
import { Plan } from "./Models/Plans.js";

await mongoose.connect(process.env.MONGODB_URL);

const plans = [
  {
    name: "free",
    price: 0,
    limits: {
      aiGeneration: 5,
      aiSummarizer: 5,
    },
  },
  {
    name: "pro",
    price: 199,
    limits: {
      aiGeneration: 100,
      aiSummarizer: 100,
    },
  },
  {
    name: "plus",
    price: 499,
    limits: {
      aiGeneration: 500,
      aiSummarizer: 500,
    },
  },
];

for (const planData of plans) {
  await Plan.findOneAndUpdate(
    { name: planData.name },
    planData,
    { upsert: true, new: true }
  );
}

console.log("Plans inserted/updated ✅");
await mongoose.disconnect();
console.log("Operation Executed ✅");