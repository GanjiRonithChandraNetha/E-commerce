import { userEditProfileSchema } from "../utilites/profileChecks.js";
import { 
    getUserData,    
    updateProfileSerive,
    updateProfilePicService
 } from "../services/profiles.service.js"

export const viewProfile = async(req,res)=>{
    try{
        console.log(req.user);
        const profile_id = req.user.profile_id;
        const data = await getUserData(profile_id);
        if(!data){
            return res.status(404).json({
                message:"user not found"
            });
        }
        return res.status(200).json(data);
    }
    catch(err){
        console.log("viewProfile error",err.message);
        res.status(500).json({message:"internal server error"});
    }
}

// must use multer - to s3 direclty during depolyment
export const updateProfilePic = async(req,res)=>{
    try {
        const profile_id = req.user.profile_id;
        const result = await updateProfilePicService(profile_id,req.file.path);
        if(!result){
            return res.status(500).json({message:"could not add path to DB"});
        }
        // console.log(result);
        res.status(200).json({message:"profile added to DB"});
    } catch (error) {
        console.log("error in updateProfilePic",error.message);
        res.status(500).json({message:"internal server error"});
    }
}

export const updateEditableCredentials = async (req,res)=>{
    try {
        const profile_id = req.user.profile_id;
        if(!profile_id) return res.status(404).json({message:"profile_id not found check token or login again"});
        const {mobileNumber,email,name} = req.body;
        const result = userEditProfileSchema.safeParse({mobileNumber,email,name});
        if(!mobileNumber && !email && !name){
            return res.status(200).json({message:"noting to update"});
        }
        if(!result.success){
            return res.status(401).json({message:result.error});
        }
        const update = await updateProfileSerive(profile_id,mobileNumber,email,name);
        if(!update){
            return res.status(500).json({message:"could not make changes"});
        }
        res.status(200).json({
            message:"data updated",
            data:update
        });
    } catch (error) {
        console.log("updateEditableCredentials",error.message,error);
        res.status(500).json({message:"internal server error"});
    }
}