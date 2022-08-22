import dotenv from 'dotenv';
import ApiError from '../error/ApiError.mjs';
import { User, Group } from '../models/models.mjs';
dotenv.config();

class GroupController {
    async create(req, res, next) {
        try {
            const {name, userId} = req.body;
            const user = await User.findById(userId);
            const group = await Group.create({name, owner: userId, members: [userId]});
            if (!user) {
                return next(ApiError.badRequest("User not found", 400));
            }
            await User.updateOne({_id: userId}, {$set: {groupId: group._id}});
            res.status(201).json({
                message: "Group created",
                groupId: group._id,
            });
        } catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const {groupId} = req.body;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ApiError.badRequest("Group not found", 400));
            }
            await Group.deleteOne({_id: groupId});
            res.status(200).json({
                message: "Group deleted",
            });
        } catch (error) {
            next(error);
        }
    }
    async leave(req, res, next) {
        try {
            const {groupId, userId} = req.body;
            const user = await User.findById(userId);
            const group = await Group.findById(groupId);
            if (!user) {
                return next(ApiError.badRequest("User not found", 400));
            }
            if (!group) {
                return next(ApiError.badRequest("Group not found", 400));
            }
            await Group.updateOne({_id: groupId}, {$pull: {userIds: userId}});
            await User.updateOne({_id: userId}, {$pull: {groupIds: groupId}});
            res.status(200).json({
                message: "User left group",
            });
        } catch (error) {
            next(error);
        }
    }
    async join(req, res, next) {
        try {
            const {groupId, userId} = req.body;
            const user = await User.findById(userId);
            const group = await Group.findById(groupId);
            if (!user) return next(ApiError.badRequest("User not found", 400));
            if (user.groupIds) return next(ApiError.badRequest("User already in group", 400));
            if (!group) return next(ApiError.badRequest("Group not found", 400));
            await User.updateOne({_id: userId}, {$set: {groupId}});
            await Group.updateOne({_id: groupId}, {$push: {members: userId}});
            res.status(200).json({ message: "User joined group" });
        } catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const {groupId, name} = req.body;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ApiError.badRequest("Group not found", 400));
            }
            await Group.updateOne({_id: groupId}, {$set: {name}});
            res.status(200).json({
                message: "Group updated",
            });
        } catch (error) {
            next(error);
        }
    }
    async members(req, res, next) {
        try {
            const {groupId} = req.query;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ApiError.badRequest("Group not found", 400));
            }
            res.status(200).json({
                message: "Group members",
                members: group.members,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new GroupController();