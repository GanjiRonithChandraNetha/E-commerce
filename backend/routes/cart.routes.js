import { 
    addToCartController,
    getCartConroller
} from "../controllers/cart.controller.js";
import {Router} from "express";

const cartRouter = Router();
cartRouter.put("/add-to-cart/:variantId",addToCartController);
cartRouter.get("/get-cart",getCartConroller);
// cartRouter.get("/get-cart",()=>{console.log("hello")});
export default cartRouter;