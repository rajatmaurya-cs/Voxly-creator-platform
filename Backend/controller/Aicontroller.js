

/*----------------------------------Prompts---------------------------------------------------*/
import {blogPrompt} from './Service/Prompts/Prompt.js'
import {summaryPrompt} from './Service/Prompts/Prompt.js'


import { contentGenerationService } from "./Service/AiEngine/Aiservice.js";

import {articleSummariser} from './Service/AiEngine/Aiservice.js'



export const generateContent = async (req, res) => {
  try {

    console.log("Generat content 1")

    if (!req.user) {
      return res.status(401).json({ success:false, message:"Login required" });
    }

    console.log("Generat content 2")
    

    const {title , subTitle} = req.body;

    console.log("Generat content 3")


    const prompt = blogPrompt(title , subTitle)

    console.log("Generat content 4")

    const model = req.body.model?.id || req.body.model;
    
    const result = await contentGenerationService({
      user: req.user,
      prompt: prompt,
      model : model
    });

    console.log("Generat content 5")

    return res.status(200).json({
      success: true,
      content: result
    });

    console.log("Generat content 6")

  } catch (error) {
      console.log(error)
    return res.status(error.status || 500).json({
      success:false,
      message:error.message || "AI generation failed"
    });

  }
};



export const summariseArticle = async (req, res) => {
  try {
     
    if (!req.user) {
      return res.status(401).json({ success:false, message:"Login required" });
    }

    const {content} = req.body;

   

   

    const prompt = summaryPrompt(content)
    
    const result = await articleSummariser({
      user: req.user,
      prompt: prompt
    });

    return res.status(200).json({
      success: true,
      content: result
    });

  } catch (error) {
  console.log("The Error is : ", error);

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "AI Summariser failed"
  });
}


  }









