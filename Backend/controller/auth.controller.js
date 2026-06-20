import jwt from "jsonwebtoken";

import axios from "axios";

import { sendOtpService } from "../Service/otpService.js";

import bcrypt from "bcrypt"

import { oauth2client } from "../utils/googleconfig.js";

import { createAccessToken, createRefreshToken } from '../Service/Authentication.js'

import hashToken from "../utils/hashToken.js";

import { redisClient } from "../Config/redis.js";


import User from "../Models/User.js";
import VerifiedEmail from "../Models/VerifiedEmail.js";
import RefreshToken from "../Models/RefreshToken.js";
import { Plan } from "../Models/plans.js";
import { AIUsage } from "../Models/AIUsage.js";
import fs from "fs";
import imageKit from "../Config/imagekit.js";




export const signup = async (req, res) => {
  try {

    console.log("Local Signup Controller.js ↘️")


    let { fullName, email, password } = req.body;



    fullName = fullName.trim();
    email = email.toLowerCase().trim();

    if (!fullName || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }


    const existingUser = await User.findOne({ email });

    if (existingUser) {

      if (existingUser.authProvider === "GOOGLE") {
        return res.json({
          success: false,
          message: "Account exists with Google login. Please sign in with Google.",
        });
      }

      return res.json({
        success: false,
        message: "User already exists",
      });
    }


    const freePlan = await Plan.findOne({
      name: "free",
    });


    let avatarUrl = "";
    if (req.file) {
      try {

        const fileBuffer = fs.readFileSync(req.file.path);

        const uploadResponse = await imageKit.upload({
          file: fileBuffer,
          fileName: `${Date.now()}-${req.file.originalname}`,
          folder: "/Postify-Users",
        });

        if (uploadResponse?.url) {
          avatarUrl = uploadResponse.url;
        }

      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
      } finally {
        

        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting temp avatar file:", err);
        });
      }
    }

    const user = await User.create({
      fullName,
      email,
      password,
      avatar: avatarUrl || undefined,
      authProvider: "LOCAL",
      plan: freePlan._id,
    });


    await AIUsage.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { userId: user._id } },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );


    console.log("Local Signup Controller.js ✅")
    return res.json({
      success: true,
      message: "User signed up successfully",
    });

  } catch (error) {
    console.log("The Error in LocalSignup is", error)
    return res.json({
      success: false,
      message: error.message,
    });
  }
};



export const login = async (req, res) => {
  try {

    console.log("Local Login 1")

    let { email, password } = req.body;

    console.log("The data we recieved: ", email)

    console.log("Local Login 2")

    email = email.toLowerCase().trim();




    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Email and password are required",
      });
    }

    console.log("Local Login 3")


    const user = await User.findOne({ email }).populate("plan");

    console.log("Local Login 4")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.authProvider.includes("LOCAL")) {
      return res.status(400).json({
        success: false,
        message: "This account is registered with Google. Please continue with Google login.",
      });
    }

    console.log("Local Login 5")


    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    const accessToken = createAccessToken(user);

    const refreshToken = createRefreshToken(user);



    await RefreshToken.deleteMany({ userId: user._id });

    await RefreshToken.create({
      userId: user._id,
      token: hashToken(refreshToken),
    });




    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });


    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 1000
    });



    return res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        plan: user.plan, 
        createdAt: user.createdAt,
        planExpiresAt: user.planExpiresAt
      },
    });


  } catch (error) {
    console.log("The error in Local Login: ", error)
    return res.json({
      success: false,
      message: error.message,
    });
  }
};





export const googleLogin = async (req, res) => {
  try {

    console.log("GoogleLogin 1")
    

    const code = req.query.code;

    console.log("GoogleLogin 2 code: ", code)

    

    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code",
        },
      }
    );

    console.log("GoogleLogin 3")

    const { access_token } = data;

    console.log("GoogleLogin 4")

    console.log("The data we get: ",data)

    

    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    
    console.log("GoogleLogin 5")
    

    let user = await User.findOne({
      email: googleUser.email,
    });

    console.log("GoogleLogin 6")

    

    if (!user) {

      const freePlan = await Plan.findOne({ name: "free" });


      user = await User.create({

        fullName: googleUser.name,

        email: googleUser.email.toLowerCase().trim(),

        avatar: googleUser.picture,

        authProvider: ["GOOGLE"],
        plan: freePlan._id,
      });


      await AIUsage.findOneAndUpdate(
        { userId: user._id },
        { $setOnInsert: { userId: user._id } },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log("The User is New and AIUsage Created 🚨")


    }



    

    else {

      
      if (!user.avatar && googleUser.picture) {
        user.avatar = googleUser.picture;
      }

      
      if (user.authProvider && !user.authProvider.includes("GOOGLE")) {
        user.authProvider.push("GOOGLE");
      }

      await user.save();

      console.log("The User is Old and AIUsage does not created 🚨")
    }

    console.log("GoogleLogin 8")

    

    const accessToken = createAccessToken(user);


    console.log("GoogleLogin 9")

    const refreshToken = createRefreshToken(user);

    

    await RefreshToken.deleteMany({
      userId: user._id,
    });

    console.log("GoogleLogin 10")

    await RefreshToken.create({

      userId: user._id,

      token: hashToken(refreshToken),
    });

    console.log("GoogleLogin 11")

    

    res.cookie("refreshToken", refreshToken, {

      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

      path: "/",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {

      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

      path: "/",

      maxAge: 15 * 60 * 1000,
    });

    

    console.log("GoogleLogin successFully ✅")

    res.redirect(`${process.env.FRONTEND_URL}`);

  } catch (error) {

    console.log("GoogleLogin ERROR:", error);

    return res.status(500).json({

      success: false,

      message: error.message || "Google login failed",
    });
  }
};





export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

    if (refreshToken) {
      const hashedToken = hashToken(refreshToken);
      await RefreshToken.deleteOne({ token: hashedToken });
    }

    
    if (accessToken) {
      const decoded = jwt.decode(accessToken);
      const expiresIn = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 0;

      if (expiresIn > 0) {
        await redisClient.set(`bl_${accessToken}`, "blocked", { EX: expiresIn });
      }
    }

    res.clearCookie("refreshToken", { path: "/" });
    res.clearCookie("accessToken", { path: "/" });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};



export const refreshAccessToken = async (req, res) => {
  try {

    const currentTime = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });

    console.log(
      "Request comes for Generate New AccessTime at ✅ :",
      currentTime
    );


    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token"
      });
    }


    const hashedToken = hashToken(refreshToken);




    
    const storedToken = await RefreshToken.findOne({
      token: hashedToken,
    });



    if (!storedToken) {
      return res.status(403).json({
        message: "Invalid refresh token"
      });
    }





    
    
    

    if (storedToken.used) {


      const timeDifference =
        Date.now() - storedToken.usedAt.getTime();




      if (timeDifference < 30000) {


        console.log(
          "♻️ Refresh token reused within grace period"
        );


        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );


        const user = await User.findById(decoded.id);



        if (!user) {
          return res.status(403).json({
            message: "User not found"
          });
        }



        const newAccessToken =
          createAccessToken(user);



        const newRefreshToken =
          createRefreshToken(user);




        await RefreshToken.create({
          userId: user._id,
          token: hashToken(newRefreshToken),
        });





        res.cookie(
          "refreshToken",
          newRefreshToken,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
              process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
          }
        );



        res.cookie(
          "accessToken",
          newAccessToken,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
              process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            path: "/",
            maxAge: 60 * 1000
          }
        );




        return res.status(200).json({
          success: true,
          user
        });

      }

      
      
      


      console.log(
        "🚨 Refresh token reuse attack detected"
      );


      await RefreshToken.deleteMany({
        userId: storedToken.userId
      });



      return res.status(403).json({
        message: "Refresh token reuse detected"
      });

    }





    
    
    


    storedToken.used = true;
    
    storedToken.usedAt = new Date();

    await storedToken.save();





    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );



    const user = await User.findById(decoded.id);



    if (!user) {
      return res.status(403).json({
        message: "User not found"
      });
    }




    const newAccessToken =
      createAccessToken(user);



    const newrefreshToken =
      createRefreshToken(user);





    await RefreshToken.create({

      userId: user._id,

      token: hashToken(newrefreshToken),

    });






    res.cookie(
      "refreshToken",
      newrefreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    );



    res.cookie(
      "accessToken",
      newAccessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        path: "/",
        maxAge: 60 * 1000
      }
    );



    const currentTimeIST = new Date().toLocaleTimeString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        hour12: false,
      }
    );


    console.log(
      "AccessToken Generated at ✅ :",
      currentTimeIST
    );



    return res.status(200).json({
      success: true,
      user,
    });



  }
  catch (error) {

    console.log(
      "REFRESH ERROR:",
      error
    );


    return res.status(403).json({
      message: "Expired or invalid refresh token",
    });

  }
};



export const sendOtp = async (req, res) => {
  try {
    let { email, purpose } = req.body;
    email = email.toLowerCase().trim();
    purpose = purpose.toUpperCase().trim();

    await sendOtpService(email, purpose);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    

    let { email, otp, purpose } = req.body;

    

    if (!email || !otp || !purpose) {
      return res.status(400).json({
        success: false,
        message: "email, otp and purpose are required",
      });
    }

    

    email = email.toLowerCase().trim();
    purpose = purpose.toUpperCase().trim(); 

    const otpKey = `otp:${purpose}:${email}`;
    const attemptsKey = `otpAttempts:${purpose}:${email}`;

    

    
    console.log("The status of redisClient: ", redisClient.isOpen)

    const storedOtp = await redisClient.get(otpKey);

    

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    

    
    const attempts = await redisClient.incr(attemptsKey);

    


    if (attempts === 1) {
      await redisClient.expire(attemptsKey, 300); 
    }

    

    if (attempts > 5) {
      return res.status(429).json({
        success: false,
        message: "Too many wrong attempts. Try again later.",
      });
    }

    

    
    const isMatch = await bcrypt.compare(otp.toString(), storedOtp);


    

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    

    
    await redisClient.del(otpKey);
    await redisClient.del(attemptsKey);

    

    





    await VerifiedEmail.updateOne(
      { email, purpose },
      { $set: { email, purpose, verifiedAt: new Date() } },
      { upsert: true }
    );

    

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log("verifyOtp error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};



export const verifyEmails = async (req, res) => {
  try {

    let { email } = req.body;

    console.log("The email for Refresh secure: ", email)

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = email.toLowerCase().trim();

    const record = await VerifiedEmail.findOne({ email });

    return res.status(200).json({
      success: !!record,
      verified: !!record,
      message: record
        ? "Email is verified"
        : "Email is not verified",
    });

  } catch (error) {
    console.log("verifyemails error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
} 





export const resetpassword = async (req, res) => {
  try {

    let { email, newpassword } = req.body;

    console.log("Entered in resetpassword backend:", email, newpassword)

    email = email.toLowerCase().trim();



    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email",
      });
    }




    user.password = newpassword;


    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Error : Password Not Reset ",
    });
  }
};



export const checkmailforreset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User Does not exits"
      })
    }

    await sendOtpService(email)

    return res.json({
      success: true,
      message: "OTP Sent successfully"
    })


  } catch (error) {

    console.log("OTP ERROR:", error.message);

    return res.status(429).json({
      success: false,
      message: error.message,
    })
  }
}



export const toggleFollowAuthor = async (req, res) => {
  const authorId = req.params.id;
  const currentUserId = req.user.id;

  const author = await User.findById(authorId);
  const followersArray = author.followers || [];
  const isFollowing = followersArray.some(id => id.toString() === currentUserId.toString());

  if (isFollowing) {
    
    await User.findByIdAndUpdate(authorId, { $pull: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $pull: { following: authorId } });
    return res.json({ following: false });
  } else {
    
    await User.findByIdAndUpdate(authorId, { $addToSet: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: authorId } });
    return res.json({ following: true });
  }
};


export const getLeaderboard = async (req, res) => {
  try {


    const users = await User.aggregate([
      {
        $project: {
          fullName: 1,
          avatar: 1,
          role: 1,
          followersCount: {
            $size: {
              $ifNull: ["$followers", []]
            }
          }
        }
      },
      {
        $sort: {
          followersCount: -1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};