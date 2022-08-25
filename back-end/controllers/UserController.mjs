import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import ApiError from '../error/ApiError.mjs';
import { User } from '../models/models.mjs';
dotenv.config();

class UserController {
    async register(req, res, next) {
        try {
            const {login, password} = req.body;
            const user = await User.findOne({login});
            if (user) {
                return next(ApiError.badRequest("User already exists", 400));
            }
            const hashPassword = await bcrypt.hash(password, 10);
            await User.create({login, password: hashPassword, registered: Date.now()});
            res.status(200).json({
                message: "User created",
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            if (req.session.user) {
                return next(ApiError.badRequest("User is already logged in", 400));
            }
            const {login, password} = req.body;
            const user = await User.findOne({login});
            if (!user) {
                return next(ApiError.badRequest("User not found", 400));
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return next(ApiError.badRequest("Password is invalid", 400));
            }
            req.session.user = user;
            res.status(200).json({
                message: "User logged in",
            });
        } catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            req.session.destroy();
            res.status(200).json({
                message: "User logged out",
            });
        } catch (error) {
            next(error);
        }
    }
    async auth(req, res, next) {
        try {
            if (!req.session.user) {
                return next(ApiError.badRequest("User is not authorized", 400));
            }
            res.status(200).json({
                message: "User authorized"
            });
        } catch (error) {
            next(error);
        }
    }
    async ban(req, res, next) {
        try {
            const {userId} = req.body;
            await User.updateOne({_id: userId}, {$set: {isBanned: true}});
            res.status(200).json({
                message: "User banned",
            });
        } catch (error) {
            next(error);
        }
    }
    async unban(req, res, next) {
        try {
            const {userId} = req.body;
            await User.updateOne({_id: userId}, {$set: {isBanned: false}});
            res.status(200).json({
                message: "User unbanned",
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();