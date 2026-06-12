import "dotenv/config";
import mongoose from "mongoose";

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("aiusages");

    console.log("Fetching current indexes on 'aiusages' collection...");
    const indexes = await collection.indexes();
    console.log("Current indexes:", JSON.stringify(indexes, null, 2));

    const targetIndexName = "userId_1_date_1";
    const hasIndex = indexes.some(idx => idx.name === targetIndexName);

    if (hasIndex) {
      console.log(`Dropping index '${targetIndexName}'...`);
      await collection.dropIndex(targetIndexName);
      console.log(`Successfully dropped index '${targetIndexName}'! 🎉`);
    } else {
      console.log(`Index '${targetIndexName}' was not found. checking if there are other duplicate-key-causing indexes...`);
    }

    const updatedIndexes = await collection.indexes();
    console.log("Updated indexes:", JSON.stringify(updatedIndexes, null, 2));

  } catch (error) {
    console.error("❌ Error fixing indexes:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

fixIndexes();
