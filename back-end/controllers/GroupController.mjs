import dotenv from 'dotenv';
import ServerError from '../union/ServerMessage.mjs';
import { User, Group } from '../models/models.mjs';
import ServerMessage from "../union/ServerMessage.mjs";
import permissionsPriority from "../models/permissionsPriority.mjs";
dotenv.config();

class GroupController {
    async create(req, res, next) {
        try {
            const {name} = req.body;
            if (!req.session.user) {
                return next(ServerError.badRequest("User not found"));
            }
            if (req.session.user.groupId) {
                return next(ServerError.badRequest("User already in group"));
            }
            let { _id, permission } = req.session.user;
            if (permissionsPriority[permission] < permissionsPriority["groupOwner"]) {
                permission = "groupOwner";
            }
            const group = await Group.create({name, owner: _id, members: [_id]});
            const user = await User.findOneAndUpdate({_id}, {$set: {groupId: group._id, permission}}, {new: true});
            req.session.user = user;
            return next(ServerMessage.success("Group created", group));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async delete(req, res, next) {
        try {
            const {groupId} = req.body;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.badRequest("Group not found"));
            }
            await Group.deleteOne({_id: groupId});
            return next(ServerMessage.success("Group deleted", group));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async leave(req, res, next) {
        try {
            const { id } = req.body;
            let { _id, permission, groupId } = req.session.user;
            if (groupId !== id){
                return next(ServerError.badRequest("User not in this group"));
            }
            const group = await Group.findById(id);
            if (!group) {
                return next(ServerError.badRequest("Group not found"));
            }
            if (group.owner == _id) {
                return next(ServerError.badRequest("Group owner can't leave group"));
            }
            if (permission === "member") {
                permission = "user";
            }
            await Group.updateOne({_id: id}, {$pull: {members: _id}});
            const user = await User.findOneAndUpdate({_id}, {$set: {groupId: null, permission}}, {new: true});
            req.session.user = user;
            return next(ServerMessage.success("User left group", group));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async join(req, res, next) {
        try {
            const {id} = req.body;
            let { _id, permission, groupId } = req.session.user;
            if (groupId) return next(ServerError.badRequest("User already in group"));
            const group = await Group.findById(id);
            if (!group) return next(ServerError.badRequest("Group not found"));
            if (permission === "user") {
                permission = "member";
            }
            await Group.updateOne({_id: id}, {$push: {members: _id}});
            const user = await User.findOneAndUpdate({_id}, {$set: {groupId: id, permission}}, {new: true});
            req.session.user = user;
            return next(ServerMessage.success("User joined group", group));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async update(req, res, next) {
        try {
            const {groupId, name} = req.body;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.badRequest("Group not found"));
            }
            await Group.updateOne({_id: groupId}, {$set: {name}});
            return next(ServerMessage.success("Group updated", group));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getMembers(req, res, next) {
        try {
            const {groupId} = req.query;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.badRequest("Group not found"));
            }
            return next(ServerMessage.success("Group members", group, group.members));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
}

export default new GroupController();