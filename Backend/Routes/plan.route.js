import express from "express"

import superAdminMiddleware from "../Middleware/superAdminMiddleware.js";
import authMiddleware from "../Middleware/authMiddleware.js";

import {getPlans, updatePlan, getPlanHistory} from '../controller/plan.controller.js'

const planrouter = express.Router()

planrouter.get('/getplans',(req,res,next)=>{
    console.log("REuest comes for getplan for routes")
    next();
},getPlans)

planrouter.patch('/updateplan/:id', authMiddleware, updatePlan)
planrouter.get('/getplanhistory', authMiddleware,getPlanHistory)

export default planrouter;