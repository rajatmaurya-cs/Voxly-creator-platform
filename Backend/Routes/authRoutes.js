import express from "express";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import {

  /*====signup & Login =====*/
  login,
  signup,
  googleLogin,


  /*===== Logout & refreshAccessToken =====*/
  logout,
  refreshAccessToken,


  /*===== Logout OTP refreshAccessToken =====*/
  sendOtp,
  verifyOtp,


  /*===== Emails =====*/
  verifyEmails,


  /*===== Reset Password =====*/
  resetpassword,
  checkmailforreset

} from "../controller/auth.controller.js"

import checkAiLimit from "../Middleware/aiLimitMiddleware.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.get("/me", async (req, res) => { // 👈 Make this async
  try {
    const token = req?.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        loggedIn: false,
      });
    }

    // 1. Verify and decode the JWT token to get the user ID
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 2. Fetch the user from the DB and populate the plan details
    const userFromDb = await User.findById(decoded.id).populate("plan");

    if (!userFromDb) {
      return res.status(401).json({
        loggedIn: false,
      });
    }

    // 3. Return the user info with the populated plan object
    res.json({
      success: true,
      user: {
        id: userFromDb._id,
        name: userFromDb.fullName,
        email: userFromDb.email,
        role: userFromDb.role,
        avatar: userFromDb.avatar,
        plan: userFromDb.plan, // 👈 Populated plan object containing name, price, etc.
        createdAt: userFromDb.createdAt,
        planExpiresAt:userFromDb.planExpiresAt
      },
    });

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Access token expired /me❌");
    } else {
      console.log("The Error in /me is: ", err);
    }
    res.status(401).json({
      success: false,
    });
  }
});

/* --------------------------- Signup & Login --------------------------- */




authRouter.post("/signup", signup);

authRouter.post("/login", (req, res, next) => {
  console.log("Request goes from authroutes")
  next()
}, login);

/*----------------------------- Google Login -------------------------------------------- */

authRouter.get("/google", (req, res, next) => {

  console.log("Request goes from /google 1 ")

  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile`;

  console.log("Request goes from /google 2 ")

  res.redirect(url);

});

authRouter.get('/google/callback',(req,res,next)=>{
console.log("Request Goes from /google/callback ")
next();
} ,googleLogin)





/* --------------------------- Logout and Refresh Token --------------------------- */

authRouter.post("/logout", authMiddleware, logout);


authRouter.post("/refreshtoken",(req,res , next)=>{
  
  console.log("Request goes for refresToken");
  
  
  next();
}, refreshAccessToken);





/* --------------------------- OTP --------------------------- */

authRouter.post("/sendotp", sendOtp);

authRouter.post("/verifyotp", (req,res,next)=>{
  console.log("Request goes from /VerifyOtp ✅")
  next()
},verifyOtp);




/* --------------------------- EMAIL --------------------------- */

authRouter.post("/verifyemail", verifyEmails);




/* --------------------------- PASSWORD RESET --------------------- */

authRouter.post("/checkemailforreset", checkmailforreset);
authRouter.post("/reset-password", resetpassword);

export default authRouter;
