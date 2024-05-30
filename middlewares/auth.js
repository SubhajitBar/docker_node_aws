import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { catchAsyncError } from './catchAsyncError.js';
import ErrorHandler from '../utils/ErrorHandler.js';


export const isAuthenticated = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) return next(new ErrorHandler('Please login to access this resources!', 401));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded._id);
    next();
});