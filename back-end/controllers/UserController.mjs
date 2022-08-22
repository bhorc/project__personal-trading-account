import ApiError from '../error/ApiError.mjs';
import { User } from '../models/models.mjs';
import dotenv from 'dotenv';
dotenv.config();

class UserController {
    async register(req, res, next) {
        try {
            const {login, password} = req.body;
            console.log({login, password});
            const user = await User.findOne({login});
            if (user) {
                return next(ApiError.badRequest("User already exists", 400));
            }
            const newUser = await User.create({login, password, registered: Date.now()});
            res.status(201).json({
                message: "User created",
                userId: newUser._id,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const {login, password} = req.body;
            const user = await User.findOne({login});
            if (!user) {
                return next(ApiError.badRequest("User not found", 400));
            }
            if (user.password !== password) {
                return next(ApiError.badRequest("Wrong password", 400));
            }
            res.status(200).json({
                message: "User logged in",
                userId: user._id,
            });
        } catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const {userId} = req.body;
            const user = await User.findOne({_id: userId});
            if (!user) {
                return next(ApiError.badRequest("User not found", 400));
            }
            await User.updateOne({_id: userId}, {$set: {isLoggedIn: false}});
            res.status(200).json({
                message: "User logged out",
            });
        } catch (error) {
            next(error);
        }
    }
    async check(req, res, next) {
        try {
            const {userId} = req.body;
            const user = await User.findOne({_id: userId});
            if (!user) {
                return next(ApiError.badRequest("User not found", 400));
            }
            res.status(200).json({
                message: "User is logged in",
                isLoggedIn: user.isLoggedIn,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();