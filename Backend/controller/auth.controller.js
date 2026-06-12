import jwt from "jsonwebtoken";

import axios from "axios";

import { sendOtpService } from "../Service/otpService.js";

import bcrypt from "bcrypt"

import { oauth2client } from "../utils/googleconfig.js";

import { createAccessToken, createRefreshToken } from '../Service/Authentication.js'

import hashToken from "../utils/hashToken.js";

import { redisClient } from "../Config/redis.js";

/*------------------------------------- Model Import ----------------------------------- */
import User from "../Models/User.js";
import VerifiedEmail from "../Models/VerifiedEmail.js";
import RefreshToken from "../Models/RefreshToken.js";
import { Plan } from "../Models/Plans.js";
import { AIUsage } from "../Models/AIUsage.js";


/*-----------------------User Login / Signup / google-Login  -------------------------------- */

export const signup = async (req, res) => {
  try {

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



    const user = await User.create({
      fullName,
      email,
      password,
      authProvider: "LOCAL",
      plan: freePlan._id,
    });


    await AIUsage.create({
      user: user._id,
    });

    return res.json({
      success: true,
      message: "User signed up successfully",
    });

  } catch (error) {
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
      sameSite: "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
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
        plan: user.plan, // 👈 Populated plan object containing name, price, etc.
        createdAt: user.createdAt,
        planExpiresAt:user.planExpiresAt
      },
    });


  } catch (error) {
    console.log("The error is Login: ", error)
    return res.json({
      success: false,
      message: error.message,
    });
  }
};





export const googleLogin = async (req, res) => {
  try {

    console.log("GoogleLogin 1")
    // ---------------- GET CODE ----------------

    const code = req.query.code;

    console.log("GoogleLogin 2 code:", code)

    // ---------------- EXCHANGE CODE FOR TOKEN ----------------

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

    // ---------------- GET GOOGLE USER ----------------

    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log("GoogleLogin 5")
    // ---------------- FIND USER ----------------

    let user = await User.findOne({
      email: googleUser.email,
    });

    console.log("GoogleLogin 6")

    // ---------------- CREATE USER ----------------





    if (!user) {



      const freePlan = await Plan.findOne({ name: "free" });


      user = await User.create({

        fullName: googleUser.name,

        email: googleUser.email.toLowerCase().trim(),

        avatar: googleUser.picture,

        authProvider: ["GOOGLE"],
        plan: freePlan._id,
      });


      await AIUsage.create({
        user: user._id,
      });

      console.log("The User is New and AIUsage Created 🚨")


    }



    // ---------------- UPDATE EXISTING USER ----------------

    else {

      // update avatar if missing
      if (!user.avatar && googleUser.picture) {
        user.avatar = googleUser.picture;
      }

      // add GOOGLE provider if not exists
      if (user.authProvider && !user.authProvider.includes("GOOGLE")) {
        user.authProvider.push("GOOGLE");
      }

      await user.save();

      console.log("The User is Old and AIUsage does not created 🚨")
    }

    console.log("GoogleLogin 8")

    // ---------------- TOKENS ----------------

    const accessToken = createAccessToken(user);


    console.log("GoogleLogin 9")

    const refreshToken = createRefreshToken(user);

    // ---------------- STORE REFRESH TOKEN ----------------

    await RefreshToken.deleteMany({
      userId: user._id,
    });

    console.log("GoogleLogin 10")

    await RefreshToken.create({

      userId: user._id,

      token: hashToken(refreshToken),
    });

    console.log("GoogleLogin 11")

    // ---------------- COOKIES ----------------

    res.cookie("refreshToken", refreshToken, {

      httpOnly: true,

      secure: false,

      sameSite: "lax",

      path: "/",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {

      httpOnly: true,

      secure: false,

      sameSite: "lax",

      path: "/",

      maxAge: 15 * 60 * 1000,
    });

    // ---------------- REDIRECT ----------------

    console.log("GoogleLogin successFully ✅")

    res.redirect(`${process.env.FRONTEND_URL}/`);

  } catch (error) {

    console.log("GoogleLogin ERROR:", error);

    return res.status(500).json({

      success: false,

      message: error.message || "Google login failed",
    });
  }
};



/*--------------------------- Logout & refreshAccessToken---------------------------------- */

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

    if (refreshToken) {
      const hashedToken = hashToken(refreshToken);
      await RefreshToken.deleteOne({ token: hashedToken });
    }

    // Optional: blacklist access token if you want
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

    const now = new Date();

    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    console.log("Request comes for refreshAccesToken 🚫 at: ", time);

    console.log("refreshAccessToken: 1")

    const refreshToken = req.cookies.refreshToken;

    const accessToken = req.cookies.accessToken;


    console.log("The refreshtoken from Browser is: ",refreshToken)
    


    if (!refreshToken) {
      return res.status(401).json({ message: "Invalid email or Password" });
    }

    console.log("refreshAccessToken: 2")


    const hashedToken = hashToken(refreshToken);

    console.log("refreshAccessToken: 3")

    const storedToken = await RefreshToken.findOneAndDelete({
      token: hashedToken,
    });

    console.log("refreshAccessToken: 4")

    console.log("The StoredToken is: ", storedToken)

    if (!storedToken) {
      return res.status(403).json({ message: "Invalid Email or Password" });
    }

    console.log("refreshAccessToken: 5")

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    console.log("refreshAccessToken: 6")

    const user = await User.findById(decoded.id);


    console.log("refreshAccessToken: 7")

    console.log("user is: ", user)

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    console.log("refreshAccessToken: 8")

    const newAccessToken = createAccessToken(user);

    console.log("refreshAccessToken: 9")

    const newrefreshToken = createRefreshToken(user);

    console.log("refreshAccessToken: 10")



    await RefreshToken.create({
      userId: user._id,
      token: hashToken(newrefreshToken),
    });


    console.log("refreshAccessToken: 11")



    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 1000
    });

    const now2 = new Date();

    const time2 = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    console.log("\n\n\n accessToken generated at ✅ : ", time2)


    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log("REFRESH ERROR:", error);
    return res.status(403).json({
      message: "Expired or invalid refresh token",
    });
  }
};




/*------------------------------------------ OTP-----------------------------------------*/

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
    console.log("1 ✅")

    let { email, otp, purpose } = req.body;

    console.log("2 ✅")

    if (!email || !otp || !purpose) {
      return res.status(400).json({
        success: false,
        message: "email, otp and purpose are required",
      });
    }

    console.log("3 ✅")

    email = email.toLowerCase().trim();
    purpose = purpose.toUpperCase().trim(); // e.g. SIGNUP, RESET_PASSWORD

    const otpKey = `otp:${purpose}:${email}`;
    const attemptsKey = `otpAttempts:${purpose}:${email}`;

    console.log("4 ✅")

    // ✅ Get OTP from Redis (purpose-based)
    console.log("The status of redisClient: ", redisClient.isOpen)

    const storedOtp = await redisClient.get(otpKey);

    console.log("5 ✅")

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    console.log("6 ✅")

    // ✅ Attempts limiter (purpose-based)
    const attempts = await redisClient.incr(attemptsKey);

    console.log("7 ✅")


    if (attempts === 1) {
      await redisClient.expire(attemptsKey, 300); // 5 minutes
    }

    console.log("8 ✅")

    if (attempts > 5) {
      return res.status(429).json({
        success: false,
        message: "Too many wrong attempts. Try again later.",
      });
    }

    console.log("9 ✅")

    // ✅ Compare OTP
    const isMatch = await bcrypt.compare(otp.toString(), storedOtp);


    console.log("10 ✅")

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    console.log("11 ✅")

    // ✅ Success: delete OTP + attempts
    await redisClient.del(otpKey);
    await redisClient.del(attemptsKey);

    console.log("12 ✅")

    /**
     * ✅ IMPORTANT:
     * Store verification per purpose.
     * Otherwise "verified" for signup can wrongly allow password reset etc.
     */

    await VerifiedEmail.updateOne(
      { email, purpose },
      { $set: { email, purpose, verifiedAt: new Date() } },
      { upsert: true }
    );

    console.log("13 ✅")

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


/*---------------------------------------verifyemails------------------------------------- */
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
} // VerifyEmails for refresh



/*-------------------------------- Password Reset------------------------------------------- */

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