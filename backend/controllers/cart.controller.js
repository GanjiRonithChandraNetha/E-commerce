import {
    addToCartService,
    getCartService
} from "../services/cart.service.js"

export const addToCartController = async(req,res)=>{
    try {
        const variantId = req.params.variantId;
        const profile_id = req.user.profile_id;
        if(!profile_id || !variantId) 
            return res.status(400).json({message:"detials not provided"});
        const data = await addToCartService(profile_id,variantId);
        if(!data) return res.status(400).json({message:"not added to cart"});
        res.status(200).json({message:"item added to cart"});
    } catch (error) {
        console.log(error.message,error);
        res.status(500).json({message:"internal server error"});
    }
}

export const getCartConroller = async(req,res)=>{
    try {
        const profile_id = req.user.profile_id;
        const cartId = req.query.cartId;
        const data = await getCartService(profile_id,cartId);
        if(!data) return res.status(404).json({message:"cart not found"});
        return res.status(200).json(data);
    } catch (error) {
        console.log("inside getCartConroller",error.message,error);
        res.status(500).json({message:"internal server error"});
    }
}