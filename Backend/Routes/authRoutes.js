import express from "express";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import {

  
  login,
  signup,
  googleLogin,
  
  logout,
  refreshAccessToken,
  
  sendOtp,
  verifyOtp,
  
  verifyEmails,
  
  resetpassword,
  checkmailforreset,
   
  toggleFollowAuthor,
  getLeaderboard

} from "../controller/auth.controller.js"

import checkAiLimit from "../Middleware/aiLimitMiddleware.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import upload from "../Middleware/Multer.js";

const authRouter = express.Router();

authRouter.get("/me", async (req, res) => { 
  try {
    const token = req?.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        loggedIn: false,
      });
    }

    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    
    const userFromDb = await User.findById(decoded.id).populate("plan");

    if (!userFromDb) {
      return res.status(401).json({
        loggedIn: false,
      });
    }

    
    res.json({
      success: true,
      user: {
        id: userFromDb._id,
        name: userFromDb.fullName,
        email: userFromDb.email,
        role: userFromDb.role,
        avatar: userFromDb.avatar,
        plan: userFromDb.plan, 
        createdAt: userFromDb.createdAt,
        planExpiresAt:userFromDb.planExpiresAt,
        following: userFromDb.following || [],
        followers: userFromDb.followers || []
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






authRouter.post("/signup", upload.single("avatar"), signup);

authRouter.post("/login", (req, res, next) => {
  console.log("Request goes from authroutes")
  next()
}, login);



authRouter.get("/google", (req, res, next) => {

  console.log("Request goes from /google 1 ")

  console.log(`The google GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID}`)

  console.log(`The Google Redirect_URI is: ${process.env.GOOGLE_REDIRECT_URI}`)

  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile`;

  console.log("The Url is: ",url)

  res.redirect(url);

});

authRouter.get('/google/callback',(req,res,next)=>{
console.log("Request Goes from /google/callback ")
next();
} ,googleLogin)







authRouter.post("/logout", authMiddleware, logout);


authRouter.post("/refreshtoken",(req,res , next)=>{
  
  console.log("Request goes for refresToken");
  
  
  next();
}, refreshAccessToken);







authRouter.post("/sendotp", sendOtp);

authRouter.post("/verifyotp", (req,res,next)=>{
  console.log("Request goes from /VerifyOtp ✅")
  next()
},verifyOtp);






authRouter.post("/verifyemail", verifyEmails);






authRouter.post("/checkemailforreset", checkmailforreset);
authRouter.post("/reset-password", resetpassword);


authRouter.post('/follow/:id', authMiddleware, (req,res,next)=>{
  console.log("authroutes /follow/:id")
  next();
},toggleFollowAuthor)

authRouter.get('/topfollowers',(req,res,next)=>{
  console.log("for Leaderboard ✅")
  next();
},getLeaderboard)

export default authRouter;
