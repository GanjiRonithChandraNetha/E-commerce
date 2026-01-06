import { profile } from "console";
import { pool } from "../db/db.js";

export const getUserQuery = async(profile_id)=>{
    const { rows } = await pool.query(
        `SELECT name, mobile_number, profile_pic, email
        FROM profiles
        WHERE profile_id = $1`,
        [profile_id]
    );
    return rows[0] || null;
}

export const updateProfileRepo = async(profile_id,fields)=>{
    const keys = Object.keys(fields);
    if(keys.length === 0) return null;
    const setClause = keys
    .map((key,idx)=>`${key} = $${idx+1}`)
    .join(", ");

    const values = Object.values(fields);
    const query  =`
        UPDATE PROFILES
        SET ${setClause}
        WHERE profile_id = $${keys.length + 1}
        RETURNING ${keys.join(",")};`

    const {rows} = await pool.query(query,[...values,profile_id]);
    return rows[0] ||null;
}

export const updateProfilePicRepo = async(profile_id,path)=>{
    const query = `UPDATE PROFILES
        SET profile_pic = $1
        WHERE profile_id = $2
        RETURNING profile_pic;`
    const {rows} = await pool.query(query,[path,profile_id]);
    return rows[0] || null;
}