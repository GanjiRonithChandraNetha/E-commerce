import bcrypt from 'bcrypt';
import {searchProfileWithEmail,
    searchProfileWithMobileNumber,
    createProfile,
    checkIfEmailExists
} from '../repositories/auth.respositories.js';

export const loginService = async(email,mobileNo,password)=>{
    // console.log(email,mobileNo,password);
    let profile_id;
    let profPwd;
    if(!email){
        const result = await searchProfileWithMobileNumber(mobileNo);
        profPwd = result.password;
        profile_id = result.profile_id;
    }else{
        const result = await searchProfileWithEmail(email);
        profPwd = result.password;
        profile_id = result.profile_id;
    }
    if(!profPwd){
        return null;
    }else{
        const result = await bcrypt.compare(password,profPwd);
        // console.log(result);
        if(!result) return null;
        return profile_id;
    }
}

export const signUpService = async({email,password,mobileNo,name})=>{
    try {
        const existingUser = await checkIfEmailExists(email);
        if(existingUser) throw new Error("user already exists");
        const hashedPassword = await bcrypt.hash(password,10);
        console.log(hashedPassword);
        const profile_id = await createProfile({email,hashedPassword,mobileNo,name});
        if(!profile_id){
            console.log("data base error from signUpService");
            return null;
        }
        return profile_id;
    } catch (error) {
        console.log("signUpSerive error");
        console.log(error.message);
        return null;
    }
}

// export default {
//     loginService,
//     signUpService
// }