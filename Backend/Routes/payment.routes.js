import express from "express";

import {generateOrderId ,verifyPayment} from '../controller/payment.controller.js'
import authMiddleware from '../Middleware/authMiddleware.js'

const paymentroutes = express.Router()


paymentroutes.post('/create-order', authMiddleware, (req,res,next)=>{
    console.log("Request comes for paymetn.routes.js /createorder")
    next();
}, generateOrderId )


paymentroutes.post('/verifypayment', authMiddleware, (req,res,next)=>{
    console.log("Request comes in /verifyPayment in paymetn.routes")
    next()
}, verifyPayment)

export default paymentroutes ;