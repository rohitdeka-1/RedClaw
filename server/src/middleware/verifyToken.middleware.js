    import jwt from "jsonwebtoken";
import envConfig from "../config/env.config.js";


const ACCESS_TOKEN_SECRET = envConfig.ACCESS_TOKEN;

export const verifyJWT = async (req, res, next) => {


    try {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"User not authenticated."})
    };
    const decode = await jwt.verify(token,envConfig.ACCESS_TOKEN);
    if(!decode){    
        return res.status(401).json({message:"Invalid token"});
    };
    req.id = decode.userId;
    next();
  } catch (error) { 
    console.log(error);
  }
}




