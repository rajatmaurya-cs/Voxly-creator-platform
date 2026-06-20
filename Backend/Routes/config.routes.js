import express from "express";
import superAdminMiddleware from "../Middleware/superAdminMiddleware.js";

import {getConfig , updateConfig , getConfigHistory}    from '../controller/configController.js'

import adminMiddleware from "../Middleware/adminMiddleware.js"



const configRouter = express.Router();


configRouter.get("/config-dashboard",(req,res,next)=>{
    console.log("Request entered into /config-dashboard in configroutes🚀")
    next()
},getConfig);



configRouter.get('/getConfigHistory',(req,res,next)=>{
    console.log("Request entered into /getconfighistory in configroutes 🚀")
    next()
},getConfigHistory)



configRouter.put("/updateConfig", superAdminMiddleware,updateConfig);

export default configRouter;
