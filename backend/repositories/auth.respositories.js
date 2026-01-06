import {pool} from "../db/db.js";

export const searchProfileWithMobileNumber = async(mobileNo)=>{
    try {
        const result = await pool.query("Select profile_id,password from profiles where mobile_number = $1",[mobileNo]);
        // console.log(result);
        if(result.rows.length == 0) return null;
        return result.rows[0];
    } catch (error) {
        console.log("error in profile table profile_id retrival using mobile number")
        console.log(error.message);
        return null;
    }
}

export const searchProfileWithEmail = async(email)=>{
    try {
        const result = await pool.query("Select profile_id,password from profiles where email = $1",[email]);
        // console.log(result);
        if(result.rowCount == 0) return null;
        return result.rows[0];
    } catch (error) {
        console.log("error in profile table profile_id retrival using email number")
        console.log(error.message);
        return null;
    }
}

export const createProfile = async({email,hashedPassword,mobileNo,name})=>{
    try {
        console.log(hashedPassword);
        const result = await pool.query("insert into profiles (email,password,mobile_number,name ) values ($1,$2,$3,$4) returning profile_id"
            ,[email,hashedPassword,mobileNo,name]
        );
        if(result.rowCount == 0) return null;
        return result.rows[0].profile_id;
    } catch (error) {
        console.log("respository error");
        console.log(error.message);
    }
}

export const checkIfEmailExists = async(email)=>{
    const user = pool.query(`
        SELECT email FROM profiles
        WHERE email = $1`,
        [email]
    )
    return user || null;
}
// export default {
//     searchProfileWithEmail,
//     searchProfileWithMobileNumber,
//     createProfile
// };