import { 
    getProductsService,
    getVariantsService,
    getVariantService
} from "../services/product.service.js";


export const getProductsController = async(req,res)=>{
    try {
        console.log("in product list");
        const set = new Set(["newest_first","oldest_first","lowest_first","highest_first"]);
        let sortType = req.query.sortType;
        const searchString = req.query.search;
        const lastProductId = req.query.lastPoductId?Number(req.query.lastPoductId):null;
        const lastCreatedId = req.query.lastCreatedId?new Date(req.query.lastCreatedId):null;
        const lastPrice = req.query.lastPrice ? Number(req.query.lastPrice): null;
        if(!sortType || !set.has(sortType)) sortType = "newest_first";
        const product_data = await getProductsService(
            searchString,
            sortType,
            lastProductId,
            lastCreatedId,
            lastPrice
        );
        res.status(200).json(product_data);
    } catch (error) {
        console.log(error.message,error);
        res.status(500).json({message:"internal server error"});
    }
}

export const getVariantsController = async(req,res)=>{
    try {
        console.log("inside get variants");
        console.log(req.params);
        const productId = req.params.productId? Number(req.params.productId) : null;
        const currentVariantId = req.params.variantId ? Number(req.params.variantId): null; 
        if(!productId || !currentVariantId){
            return res.status(400).json({message:"product_id not sent"});
        }
        const variants = await getVariantsService(productId,currentVariantId);
        if(!variants) return res.status(404).json({message:"no variants found"});
        return res.status(200).json(variants);
    } catch (error) {
        console.log(error.message,error);
        res.status(500).json({message:"internal server error"});
    }
}

export const getVariantController = async(req,res)=>{
    try{
        const variantId = req.params.variantId
        if(!variantId){
            return res.status(400).json({message:"data not sent"});
        }
        const variant = await getVariantService(variantId);
        if(!variant) return res.status(404).json({message:"variant not found"});
        res.status(200).json(variant);
    }catch(error){
        console.log(error.message,error);
        res.status(500).json({message:"internal server error"});
    }
}