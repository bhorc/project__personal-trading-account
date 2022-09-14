import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import ServerMessage from "../utils/ServerMessage.mjs";
import {User} from '../models/models.mjs';
dotenv.config();

class UserController {
    async ban(req, res, next) {
        try {
            const {userId} = req.body;
            const user = await User.findOne({_id: userId});
            if (!user) {
                return next(ServerMessage.badRequest("User not found"));
            }
            const bannedUser = await User.findOneAndUpdate({_id: userId}, {$set: {isBanned: true}}, {new: true});
            return next(ServerMessage.success("User banned", undefined, bannedUser));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async unban(req, res, next) {
        try {
            const {userId} = req.body;
            const user = await User.findOne({_id: userId});
            if (!user) {
                return next(ServerMessage.badRequest("User not found"));
            }
            const unBannedUser = await User.findOneAndUpdate({_id: userId}, {$set: {isBanned: false}}, {new: true});
            return next(ServerMessage.success("User unbanned", undefined, unBannedUser));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getUsers(req, res, next) {
        try {
            const users = await User.find();
            return next(ServerMessage.success('Users found', users, users));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getUser(req, res, next) {
        try {
            const {userId} = req.params;
            const user = await User.findById(userId);
            if (!user) {
                return next(ServerMessage.notFound("User not found"));
            }
            return next(ServerMessage.success("User found", user, user));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }

    async editProfile(req, res, next) {
        try {
            const { user } = req.session;
            const { password, login = user.login, username = user.username } = req.body;
            const newPassword = password ? await bcrypt.hash(password, 10) : user.password;
            const updatedUser = await User.findOneAndUpdate({_id: user._id}, {$set: { login, username, password: newPassword }}, {new: true});
            req.session.user = updatedUser;
            return next(ServerMessage.success("User profile edited", undefined, updatedUser));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async deleteUser(req, res, next) {
        try {
            const {user} = req.session;
            await User.deleteOne({_id: user._id});
            next(ServerMessage.success("User deleted", undefined, user));
            req.session.destroy();
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async deleteByUserId(req, res, next) {
        try {
            const {userId} = req.params;
            const user = await User.findOne({_id: userId});
            if (!user) {
                return next(ServerMessage.notFound("User not found"));
            }
            await User.deleteOne({_id: userId});
            return next(ServerMessage.success("User deleted", undefined, user));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async logout(req, res, next) {
        try {
            const {user} = req.session;
            next(ServerMessage.success("User logged out", undefined, user));
            req.session.destroy();
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async auth(req, res, next) {
        try {
            return next(ServerMessage.success("User is logged in"));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }

    async register(req, res, next) {
        try {
            const {login, password} = req.body;
            const isExist = await User.findOne({login});
            if (isExist) {
                return next(ServerMessage.conflict("User already exists"));
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ login, password: hashPassword, registered: Date.now() });
            return next(ServerMessage.success('User registered', undefined, user));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async login(req, res, next) {
        try {
            if (req.session.user) {
                return next(ServerMessage.conflict("User is already logged in"));
            }
            const {login, password} = req.body;
            const user = await User.findOne({login});
            if (!user) {
                return next(ServerMessage.notFound("User not found"));
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return next(ServerMessage.badRequest("Password is invalid"));
            }
            req.session.user = user;
            return next(ServerMessage.success("User logged in", undefined, user));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
}

export default new UserController();