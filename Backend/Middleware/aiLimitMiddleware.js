import User from "../Models/User.js";
import { AIUsage } from "../Models/AIUsage.js";
import { redisClient } from "../Config/redis.js";
import getConfigCached from "../utils/getConfigCached.js";

const checkAiLimit = (type) => {
  return async (req, res, next) => {
    try {
      const config = await getConfigCached();

      if (!config?.aiEnabled) {
        return res.status(403).json({
          success: false,
          message: "AI is currently disabled",
        });
      }

      const userId = req.user?.id;
      const role = req.user?.role;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      
      
      

      const perMinute = Number(
        config.aiPerMinuteLimit
      );

      const rateKey = `AI:rate:${userId}`;

      const rate = await redisClient.incr(
        rateKey
      );

      if (rate === 1) {
        await redisClient.expire(rateKey, 60);
      }

      if (rate > perMinute) {
        return res.status(429).json({
          success: false,
          message:
            "Too many requests. Try again in a minute.",
        });
      }

      
      
      

      const dailyAppLimit = Number(
        config.dailyappLimit
      );

      const now = new Date();

      const dateKey = now
        .toISOString()
        .slice(0, 10);

      const appDailyKey = `AI:appDaily:${dateKey}`;

      const appCount = await redisClient.incr(
        appDailyKey
      );

      if (appCount === 1) {
        const nextMidnightUTC = new Date();

        nextMidnightUTC.setUTCHours(
          24,
          0,
          0,
          0
        );

        const ttl = Math.floor(
          (nextMidnightUTC.getTime() -
            now.getTime()) /
            1000
        );

        await redisClient.expire(
          appDailyKey,
          ttl
        );
      }

      if (appCount > dailyAppLimit) {
        return res.status(429).json({
          success: false,
          message:
            "Daily AI app limit reached.",
        });
      }

      
      
      

      if (role === "ADMIN") {
        return next();
      }

      
      
      

      const user = await User.findById(userId)
        .populate("plan");

      if (!user || !user.plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found",
        });
      }

      const usage = await AIUsage.findOne({
        userId: userId,
      });

      if (!usage) {
        return res.status(404).json({
          success: false,
          message: "Usage record not found",
        });
      }

      
      
      

      const twelveHours =
        12 * 60 * 60 * 1000;

      if (
        new Date() - usage.lastResetAt >=
        twelveHours
      ) {
        usage.aiGenerationUsed = 0;
        usage.aiSummarizerUsed = 0;
        usage.lastResetAt = new Date();

        await usage.save();
      }

      
      
      

      if (type === "generation") {
        const limit =
          user.plan.limits.aiGeneration;

        if (
          usage.aiGenerationUsed >= limit
        ) {
          return res.status(429).json({
            success: false,
            message:
              "AI generation limit reached for your plan",
          });
        }
      }

      
      
      

      if (type === "summarizer") {
        const limit =
          user.plan.limits.aiSummarizer;

        if (
          usage.aiSummarizerUsed >= limit
        ) {
          return res.status(429).json({
            success: false,
            message:
              "AI summarization limit reached for your plan",
          });
        }
      }

      next();
      
    } catch (error) {
      console.error(
        "AI Limit Middleware Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "AI limit check failed",
      });
    }
  };
};

export default checkAiLimit;