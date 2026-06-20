import cookieParser from "cookie-parser";
import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectRedis } from "./Config/redis.js";
import connectDB from "./Config/DB.js";
import authRoutes from "./Routes/authRoutes.js";
import authMiddleware from "./Middleware/authMiddleware.js";
import blogRouter from "./Routes/blogRoutes.js";
import commentRouter from "./Routes/commentRoutes.js";
import AiRouter from "./Routes/ai.routes.js";
import configRoutes from "./Routes/config.routes.js";
import adminMiddleware from "./Middleware/adminMiddleware.js";
import paymentroutes from "./Routes/payment.routes.js";
import { Plan } from "./Models/plans.js"
import planrouter from "./Routes/plan.route.js";
import jwt from "jsonwebtoken";


const app = express();

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));






app.set("trust proxy", 1);


app.get("/api/health", (req, res) => {

  res.json({ status: "ok", service: "Postify Backend" });

});





let isDbConnected = false;

async function init() {
  if (!isDbConnected) {
    await connectDB();
    await connectRedis();
    isDbConnected = true;
  }
}


app.use(async (req, res, next) => {
  try {
    const refreshToken = req?.cookies?.refreshToken

    console.log("The RefreshToken before decoding🎃: ", refreshToken)

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      console.log("The RefreshToken after decoding🎃: ", decoded)
    } else {
      console.log("No RefreshToken found in cookies🎃");
    }

    const accessToken = req?.cookies?.accessToken

    console.log("The accessToken before decoding🎃: ", accessToken);

    if (accessToken) {
      const decoded2 = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      console.log("The accessToken after decoding🎃: ", decoded2);
    } else {
      console.log("No accessToken found in cookies🎃");
    }
  } catch(error) {
    console.log("The Error is: ", error)
  } finally {
    next()
  }
})


app.use(async (req, res, next) => {
  try {
    await init();
    next();
  } catch (err) {
    console.log("The error in index.js", err)
    res.status(500).json({ error: "Database initialization failed" });
  }
});















app.use("/api/auth", (req, res, next) => {

  console.log("indes.js /api/auth ✅")

  next()

}, authRoutes);





app.use("/api/blog", (req, res, next) => {

  console.log("index.js/api/blog  ✅")

  next()

}, blogRouter);

app.use("/api/comment", (req, res, next) => {

  console.log("index.js /api/comment ✅")
  next();

}, commentRouter);



app.use("/api/ai/config", authMiddleware, (req, res, next) => {
  console.log("/api/ai/config ✅")
  next()
}, configRoutes);



app.use("/api/ai", authMiddleware, (req, res, next) => {

  console.log("index.js /api/ai ✅")




  next()

}, AiRouter);


app.use('/api/payment', (req, res, next) => {

  console.log(" index.js /api/payments")

  next();

}, authMiddleware, paymentroutes);

app.use('/api/plan', (req, res, next) => {
  console.log("Root File /api/plans✅");
  next();
}, planrouter)




const PORT = process.env.PORT || 2000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Postify Backend API is running 🚀",
    endpoints: {
      health: "/api/health",
      docs: "API only backend"
    }
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Hav You Use AI Summarisation Until Now",
  });
});


app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});



export default app;
