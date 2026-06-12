import { Plan } from "../Models/Plans.js";
import { Payment } from "../Models/Payment.js";
import User from "../Models/User.js";
import razorpay from "../Config/razorpay.js";
import crypto from "crypto";

export const generateOrderId = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Plan is required",
      });
    }

    const selectedPlan = await Plan.findOne({ name: plan });

    if (!selectedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const user = await User.findById(req.user.id).populate("plan");

   

    const planRank = {
      free: 0,
      pro: 1,
      plus: 2,
    };

    const currentRank = planRank[user.plan?.name || "free"];
    const newRank = planRank[selectedPlan.name];

    console.log(`The currentRank is ${currentRank} & the rank is: ${user.plan?.name}`)
    console.log("\nThe newRank is: ",newRank)

    // 🔒 BLOCK upgrade/downgrade or same plan
    if (currentRank >= newRank) {
      console.log("Blocked to buy this Plan")
      return res.status(400).json({
        success: false,
        message: "You already have this plan or higher plan",
      });
    }

    console.log("Order generated for plan:", plan);
    console.log("Price:", selectedPlan.price);


    // return res.status(200).json({
    //   success:true,
    //   message:"Request moved forward"
    // })

    const order = await razorpay.orders.create({
      amount: selectedPlan.price * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      userId: req.user.id,
      plan: selectedPlan.name,
      amount: selectedPlan.price,
      orderId: order.id,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: selectedPlan.price,
      currency: "INR",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate order",
    });
  }
};




export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
      status: "pending",
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    payment.paymentId = razorpay_payment_id;
    payment.status = "paid";

    await payment.save();

    const plan = await Plan.findOne({
      name: payment.plan,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const expiresAt = new Date();

    expiresAt.setMonth(
      expiresAt.getMonth() + 1
    );

    await User.findByIdAndUpdate(
      payment.userId,
      {
        plan: plan._id,
        planExpiresAt: expiresAt,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};