import { userProfileSchema } from "../utilites/profileChecks.js";
import { 
    getUserQuery,
    updateProfileRepo,
    updateProfilePicRepo
 } from "../repositories/profiles.repositories.js";
import path from 'path';

export const getUserData = async(profile_id)=>{
    const user = await getUserQuery(profile_id);
    if (!user) return null;

    const result = userProfileSchema.safeParse(user);
    console.log(result);
    if (!result.success) {
    throw new Error("Corrupt user data");
    }

    return result.data;    
}

export const updateProfileSerive = async(
    profile_id,
    mobileNumber,
    email,
    name)=>{
    const fields = {};
    if(mobileNumber) fields.mobile_number = mobileNumber;
    if(email) fields.email = email;
    if(name) fields.name = name;

    if(Object.keys(fields).length === 0){
        throw new Error("no fields to update")
    }

    return await updateProfileRepo(profile_id,fields);
}

export const updateProfilePicService = async(profile_id,filePath)=>{
    const completePath = path.resolve(filePath);
    const updated = await updateProfilePicRepo(profile_id,completePath);
    if(!updated){
        throw new Error("data not updated");
    }
    return updated;
}