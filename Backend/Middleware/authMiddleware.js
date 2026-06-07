import { redisClient } from "../Config/redis.js";

import { validateAccessToken } from "../Service/Authentication.js";

const authMiddleware = async (req, res, next) => {
  try {
    
   

    // console.log("1")
    
    // const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    //   ? req.headers.authorization.split(" ")[1]
    //   : null;


      // console.log("2")
      
    const token = req.cookies?.accessToken;

    
    // if(token) console.log("AccessToken is Present in auth middleware 🦹🏼‍♂️")

    // console.log("3")



    if (!token) {
      console.log("401 Response is going NO access Token")
      return res.status(401).json({ message: "Please Login" });
    }

// console.log("4")

    const isBlocked = await redisClient.get(`bl_${token}`);


    // console.log("5")

    if (isBlocked) {

      return res.status(401).json({

        message: "Session expired. Please login again.",

      });
    }

    // console.log("6")


    const decoded = validateAccessToken(token);

    // console.log("7")

  //    const payload = {
  //    name : user.fullName,
  //    id: user._id,
  //    role: user.role,
  //    email : user.email,
  //    avatar : user.avatar,
  //  createdAt: user.createdAt,
  // };

    
    req.user = decoded;

    console.log("authMiddleware 🏃‍♂️")

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {console.log("Access token expired authMiddleware ❌");}

    console.log("authMiddleware error:", error?.message || error);
    
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export default authMiddleware;
