import {
    getProductsController,
    getVariantsController,
    getVariantController
} from "../controllers/product.controller.js";
import {Router} from "express";

const productRouter = Router();
productRouter.get("/get-products",getProductsController);
productRouter.get("/get-variants/:productId/:variantId",getVariantsController);
productRouter.get("/get-variant/:variantId",getVariantController);

export default productRouter;