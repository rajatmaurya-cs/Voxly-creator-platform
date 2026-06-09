import User from "../Models/User.js";
import { Plan } from "../Models/Plans.js";

const checkSubscriptionMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId)
      .populate("plan");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Free users don't expire
    if (
      !user.plan ||
      user.plan.name === "free"
    ) {
      return next();
    }

    // No expiry date set
    if (!user.planExpiresAt) {
      return next();
    }

    const now = new Date();

    // Subscription still active
    if (user.planExpiresAt > now) {
      return next();
    }

    // Subscription expired
    const freePlan = await Plan.findOne({
      name: "free",
    });

    if (!freePlan) {
      return res.status(500).json({
        success: false,
        message: "Free plan not found 🎃",
      });
    }

    user.plan = freePlan._id;
    user.planExpiresAt = null;

    await user.save();

    next();
  } catch (error) {
    console.error(
      "Subscription Middleware Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Subscription check failed",
    });
  }
};

export default checkSubscriptionMiddleware;