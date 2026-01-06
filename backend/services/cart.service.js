import {
    getActiveCartQuery,
    upsertItemQuery,
    getCartDataQuery
} from "../repositories/cart.repositories.js";

export const addToCartService = async(profile_id,variantId)=>{
    const cart = await getActiveCartQuery(profile_id);
    if(!cart.cart_id) throw new Error("active cart doesnt exists");
    const result = await upsertItemQuery(cart.cart_id,variantId,1);
    console.log(result);
    return result.rowCount != 1 ? false : true;
}

export const getCartService = async(profile_id,cartId)=>{
    if(!cartId){
        const cart = getActiveCartQuery(profile_id);
        if(!cart.cart_id){ 
            console.log("could not create a active cart");
            return false;
        }
        cartId = cart.cart_id;
    }
    const cartData = await getCartDataQuery(cartId);
    return cartData;
}