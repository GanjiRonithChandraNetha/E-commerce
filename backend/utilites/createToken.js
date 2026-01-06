import jwt from 'jsonwebtoken';

export const createToken = (profile_id,expIn/* jwt acceptable string */)=>{
    const token = jwt.sign({profile_id:profile_id},'ronith_chandra',{expiresIn:expIn});
    return token;
}