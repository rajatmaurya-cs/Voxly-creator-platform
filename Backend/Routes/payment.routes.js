import express from "express";

import {generateOrderId ,verifyPayment} from '../controller/payment.controller.js'

const paymentroutes = express.Router()


paymentroutes.post('/create-order',(req,res,next)=>{
    console.log("Request comes for paymetn.routes.js /createorder")
    next();
}, generateOrderId )


paymentroutes.post('/verifypayment',(req,res,next)=>{
    console.log("Request comes in /verifyPayment in paymetn.routes")
    next()
}, verifyPayment)

export default paymentroutes ;