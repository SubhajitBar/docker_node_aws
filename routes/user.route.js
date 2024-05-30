import express from 'express';
import { getMyProfile, login, logout, register } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.route('/register').post(register);
userRouter.route('/login').get(login);
userRouter.route('/logout').get(logout);
userRouter.route('/me').get(isAuthenticated, getMyProfile);

export default userRouter;