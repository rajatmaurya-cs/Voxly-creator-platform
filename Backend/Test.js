import "dotenv/config";
import mongoose from "mongoose";
import { Plan } from "./Models/Plans.js";

await mongoose.connect(process.env.MONGODB_URL);

await Plan.create([
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
]);

console.log("Plans inserted ✅");

console.log("Operation Executed ✅");