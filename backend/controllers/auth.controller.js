import { createToken } from '../utilites/createToken.js';
import {
    loginService,
    signUpService
} from '../services/auth.service.js'
import {
    loginCheckEmail,    // USE IN FUTCHER
    loginCheckMobileNo, // USE IN FUTCHER
    signUpCheck
} from "../utilites/aunthChecks.js"


export const loginController = async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const mobileNo = req.body.mobileNo;
        // console.log(email,password,mobileNo);
        if(!mobileNo && !email || !password) 
            return res.status(404).json({message:"doesnt have required fields"}); // add zod verificaiton in future
        const profile_id = await loginService(email,mobileNo,password);
        if(!profile_id){
            return res.status(404).json({message:"user not found"});
        }
        return res.status(200).json({token:createToken(profile_id,'3d')});
    }catch(err){
        res.status(500).json({message:"internal server error"});
    }
}

export const signUpController = async(req,res)=>{
    try {
        let {email,password,name,mobileNo} = req.body;
        
        email = email?.trim().toLowerCase();
        name = name?.trim();
        mobileNo = mobileNo?.trim();

        console.log(email,password,name,mobileNo)

        if(!email || !password || !name || !mobileNo){
            return res.status(400).json({
                message:"all fields are not sent"
            });
        }
        else{
            const result = signUpCheck.safeParse({email,password,name,mobileNo});
            if(!result.success){
                console.log("signUp error");
                return res.status(400).json({
                    message:result.error.format()      // check syntax
                })
            }
            const profile_id = await signUpService({email,password,mobileNo,name})
            if(!profile_id){
                return res.status(400).json({message:"could not find the user"});
            }
            res.status(200).json({token:createToken(profile_id,"3d")});
        }
    } catch (error) {
        if(error.message === "user already exists") //create db indexes 
            return res.status(400).json({message:"email already exists"});
        console.error("Signup controller error:", error.message);
        res.status(500).json({message:"internal server error"});
    }
}

// export default {
//     loginController,
//     signUpController
// }