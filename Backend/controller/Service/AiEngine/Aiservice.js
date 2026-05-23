
import groq from "../../../Config/Gemini.js";
import Config from "../../../Models/Config.js";
import AILog from "../../../Models/AIlog.js";

export const contentGenerationService = async ({ user, prompt }) => {


  console.log("content Generation ai engine 1")

  if (!prompt || prompt.trim() === "") {
    throw { status:400, message:"Prompt is required" };
  }

  console.log("content Generation ai engine 2")

  const config = await Config.findOne();

  console.log("content Generation ai engine 3")

  

  if (!config?.aiEnabled) {
    throw { status:403, message:"AI feature disabled" };
  }

  console.log("content Generation ai engine 4")

 


  const completion = await groq.chat.completions.create({
    model: config.aiModel,
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

  console.log("content Generation ai engine 6")

  return completion.choices[0].message.content;
  
};






export const articleSummariser = async ({ user, prompt }) => {

  if (!prompt || prompt.trim() === "") {
    throw { status:400, message:"Prompt is required" };
  }

 

  const config = await Config.findOne();

  if (!config?.aiEnabled) {
    throw { status:403, message:"AI feature disabled" };
  }

  
 


  const completion = await groq.chat.completions.create({
    model: config.aiModel,
    messages: [
      { role: "system", content: "You are a professional blog Summariser." },
      { role: "user", content: prompt },
    ],
  });

  // await AILog.create({
  //   userId: user.id,
  //   role: user.role,
  //   action: "AI Summariser",
  // });

  

  return completion.choices[0].message.content;
};