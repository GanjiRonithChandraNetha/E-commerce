import express from 'express';
import authRouter from './routes/aunth.routes.js';
import profileRouter from './routes/profile.router.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import { jwtChecker } from './middlewares/jwtChecker.js';

const app = express();
app.use(express.json());

app.use('/auth',authRouter);
app.use("/products",productRouter);

app.use("/profile",jwtChecker, profileRouter);
app.use("/cart",jwtChecker,cartRouter);

app.listen(3000,()=>console.log("hello"))