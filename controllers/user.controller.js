import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { UserModel } from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js"
import jwt from "jsonwebtoken";

export const register = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) return next(new ErrorHandler("Enter all fields", 400));

    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) return next(new ErrorHandler("User already exist", 409));

    const user = await UserModel.create({
        name,
        email,
        password
    })

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const options = {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        // httpOnly: true,
        // secure: true,
        sameSite: 'none'
    }

    res.status(201).cookie("token", token, options).json({
        success: true,
        message: 'Profile created successfully'
    });

});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorHandler("Please enter all fileds", 400));

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("Incorrect email or password", 401));

    const isMatched = await user.comparePassword(password);
    if (!isMatched) return next(new ErrorHandler("Incorrect email or password", 401));

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const options = {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        sameSite: 'none',
        // secure: true,
        // httpOnly: true
    }

    res.status(200).cookie("token", token, options).json({
        success: true,
        message: `Welcome back ${user.name}`
    });

});

export const logout = catchAsyncError(async (req, res, next) => {
    const options = {
        expires: new Date(Date.now()),
        sameSite: 'none',
        // secure: true,
        // httpOnly: true
    }
    res.status(200).cookie("token", null, options).json({
        success: true,
        message: "Logged Out Successfully",

    })
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id);

    res.status(200).json({
        success: true,
        user
    });
});