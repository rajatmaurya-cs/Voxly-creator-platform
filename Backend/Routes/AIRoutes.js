import express from 'express'

import { generateContent, summariseArticle } from '../controller/Aicontroller.js'
import { Aidashboard } from '../controller/Dashboard.js'

import checkAiLimit from '../Middleware/aiLimitMiddleware.js'
import adminMiddleware from '../Middleware/adminMiddleware.js'
import authMiddleware from '../Middleware/authMiddleware.js'

const AiRouter = express.Router();

/* ================= GenerateContent for Blog ================= */
// AiRouter.post('/Generatecontent', checkAiLimit, adminMiddleware, generateContent)

AiRouter.post('/Generatecontent',(req,res,next)=>{

    // console.log("Requst goes from /GenerateContent from airoutes")
    const model = req.body.model?.id || req.body.model;
    console.log("The model that want 🙏🏼: ",model)

    next()
},authMiddleware,checkAiLimit,generateContent)


/* ================= Ai Summariser For Users ================= */
// AiRouter.post('/summarise', checkAiLimit ,summariseArticle)
AiRouter.post('/summarise', (req, res, next) => {
    console.log("Entered in summariser airoutes")
    next()
}, checkAiLimit,summariseArticle)


/* ================= NoOfTodayreq , Totalreq , NoOfUniqueUsers ================= */
AiRouter.get('/ai-dashboard',authMiddleware,(req,res,next)=>{
    console.log("request comes in /ai-dashboard in airoutes")
    next();
}, Aidashboard)







export default AiRouter;