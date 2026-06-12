
import groq from "../../../Config/Gemini.js";
import Config from "../../../Models/Config.js";
import AILog from "../../../Models/AIlog.js";
import { AIUsage } from "../../../Models/AIUsage.js";

export const contentGenerationService = async ({ user, prompt, model }) => {

  console.log("content Generation ai engine 1")

  if (!prompt || prompt.trim() === "") {
    throw { status: 400, message: "Prompt is required" };
  }

  console.log("content Generation ai engine 2")

  const config = await Config.findOne();

  console.log("content Generation ai engine 3")


  if (!config?.aiEnabled) {
    throw { status: 403, message: "AI feature disabled" };
  }

  console.log("content Generation ai engine 4")

  console.log("Just Going to Generate content using model: ", model)

  const completion = await groq.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: "You are a professional blog writer." },
      { role: "user", content: prompt },
    ],
  });

  console.log("content Generation ai engine 5")

  await AILog.create({
    userId: user.id,
    role: user.role,
    action: "AI Content Generator",
  });

  await AIUsage.findOneAndUpdate(
    { userId: user.id },
    {
      $inc: {
        aiGenerationUsed: 1,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  console.log("content Generated SuccessFully by mode:  ✅",model)

  return completion.choices[0].message.content;

};

export const articleSummariser = async ({ user, prompt }) => {

  if (!prompt || prompt.trim() === "") {
    throw { status: 400, message: "Prompt is required" };
  }

  const config = await Config.findOne();

  if (!config?.aiEnabled) {
    throw { status: 403, message: "AI feature disabled" };
  }

  const completion = await groq.chat.completions.create({
    model: config.aiModel,
    messages: [
      { role: "system", content: "You are a professional blog Summariser." },
      { role: "user", content: prompt },
    ],
  });

  await AILog.create({
    userId: user.id,
    role: user.role,
    action: "AI Summariser",
  });

  await AIUsage.findOneAndUpdate(
    { userId: user.id },
    {
      $inc: {
        aiSummarizerUsed: 1,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  console.log("Content Summarised successfully ✅")

  return completion.choices[0].message.content;
};