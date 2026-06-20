import jwt from "jsonwebtoken";
import crypto from "crypto";




function createAccessToken(user) {
  
  const payload = {
     name : user.fullName,
     id: user._id,
     role: user.role,
     plan:user.plan,
     email : user.email,
     avatar : user.avatar,
   createdAt: user.createdAt,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });
}




function createRefreshToken(user) {
  return jwt.sign(

    { 
      id: user._id,
      jti: crypto.randomUUID() 
    },

    process.env.REFRESH_TOKEN_SECRET,
    
    {
      expiresIn: "7d",
    }
  );
}



function validateAccessToken(token) {



  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 

}




export {
  createAccessToken,
  createRefreshToken,
  validateAccessToken,
};

