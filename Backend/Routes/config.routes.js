import express from "express";

import {getConfig , updateConfig , getConfigHistory}    from '../controller/configController.js'

import adminMiddleware from "../Middleware/adminMiddleware.js"



const configRouter = express.Router();

/* ================= AiEnable / UserLimit / AppLimit ================= */
configRouter.get("/config-dashboard",(req,res,next)=>{
    console.log("Request entered into /config-dashboard in configroutes🚀")
    next()
},getConfig);


/* ================= Change Made by User._id ================= */
configRouter.get('/getConfigHistory',(req,res,next)=>{
    console.log("Request entered into /getconfighistory in configroutes 🚀")
    next()
},getConfigHistory)


/* ================= updatConfig ================= */
configRouter.put("/updateConfig", adminMiddleware,updateConfig);

export default configRouter;
