import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/error.js";
import userRouter from "./routes/user.route.js";

config({
    path: './.env'
});
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use('/api/v1',userRouter);

app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Api is working'
    })
})

app.all("*", (req,res,next)=>{
    const err = new Error(`Route ${req.originalUrl} not found.`);
    err.statusCode = 404;
    next(err);
   
})

export default app;
app.use(ErrorMiddleware);