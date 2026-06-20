import { redisClient } from "../Config/redis.js";

import { validateAccessToken } from "../Service/Authentication.js";

const authMiddleware = async (req, res, next) => {
  try {
    

    const token = req.cookies?.accessToken;

    

    

    if (!token) {
      console.log("401 Response is going NO access Token")
      return res.status(401).json({ message: "Please Login" });
    }



    const isBlocked = await redisClient.get(`bl_${token}`);

    

    if (isBlocked) {

      return res.status(401).json({

        message: "Session expired. Please login again.",

      });
    }

    

    const decoded = validateAccessToken(token);

    

  
  
  
  
  
  
  
  

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
