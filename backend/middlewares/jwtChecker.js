import jwt from 'jsonwebtoken';
import {createToken} from '../utilites/createToken.js'

// use tokens
export const jwtChecker = (req,res,next)=>{
    console.log("inside jwt checker");
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message:"Autherization header missing"});
    }
    console.log(authHeader);
    const token = authHeader.split(" ")[1];
    if(!token){
        res.status(401).json({message:"token not found"});
        return;
    }

    try {
        const decoded = jwt.verify(token,"ronith_chandra"); //key
        req.user = {profile_id:decoded.profile_id};
        console.log(req.user);
        const remTime = (decoded.exp - Date.now()/1000) / (60*60);
        if(remTime < 2){
            res.locals.newToken = createToken(req.user.profile_id,'3d') // local section created so that these details are directly stored in the local storage
        }
        next();
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({ message: error.message });
    }
}