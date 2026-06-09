import "dotenv/config";
import mongoose from "mongoose";
import User from "./Models/User.js";

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const emailToFind = "rajat.2428cs1610@kiet.edu";
    console.log(`Searching for: '${emailToFind}' (length: ${emailToFind.length})`);

    // 1. Find by exact match
    const userExact = await User.findOne({ email: emailToFind });
    console.log("Exact match user found:", userExact ? {
      _id: userExact._id,
      email: userExact.email,
      emailLength: userExact.email.length,
      authProvider: userExact.authProvider
    } : "null");

    // 2. Find case-insensitive or using regex
    const userRegex = await User.findOne({ email: { $regex: new RegExp(`^${emailToFind}$`, "i") } });
    console.log("Regex match user found:", userRegex ? {
      _id: userRegex._id,
      email: userRegex.email,
      emailLength: userRegex.email.length,
      authProvider: userRegex.authProvider
    } : "null");

    // 3. Find all users in DB and print emails
    const allUsers = await User.find({});
    console.log("\nAll users in DB:");
    for (const u of allUsers) {
      console.log(`- '${u.email}' (length: ${u.email.length})`);
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
