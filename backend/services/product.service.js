import { 
    getProductsByPriceRepo,
    getProductsByTimeRepo,
    getVariantsRepo,
    getVariantRepo
 } from "../repositories/products.repositories.js";

export const getProductsService = async(
    searchString,
    sortType,
    lastProductId,
    lastCreatedId,
    lastPrice
)=>{
    console.log(lastPrice);
    let product_data = null;
    switch(sortType){
        case "newest_first":
            console.log("new")
            product_data = await getProductsByTimeRepo(
                searchString,
                lastProductId,
                lastCreatedId || null,
                "ASC"
            );
            break;
        case "oldest_first":
            console.log("old")
            product_data = await getProductsByTimeRepo(
                searchString,
                lastProductId,
                lastCreatedId || null,
                "DESC"
            );
            break;
        case "lowest_first":
            console.log("low")
            product_data = await getProductsByPriceRepo(
                searchString,
                lastProductId,
                lastPrice || null,
                "ASC"
            );
            break;
        case "highest_first":
            console.log("hig")
            product_data = await getProductsByPriceRepo(
                searchString,
                lastProductId,
                lastPrice || null,
                "DESC"
            );
            break;
        default:
            console.log("no sort type given");
            return null;
    }
    return product_data;
}

export const getVariantsService = async(productId,variantId)=>{
    const all_varents = await getVariantsRepo(productId,variantId);
    return all_varents || null;
}

export const getVariantService = async(variantId)=>{
    const variant = await getVariantRepo(variantId);
    return variant || null;
}