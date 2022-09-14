import dotenv from 'dotenv';
import ServerError from '../utils/ServerMessage.mjs';
import { User, Group } from '../models/models.mjs';
import ServerMessage from "../utils/ServerMessage.mjs";
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
            return next(ServerMessage.success("Group created", undefined, group));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async delete(req, res, next) {
        try {
            const {groupId} = req.params;
            let { _id, permission, groupId: userGroupId } = req.session.user;
            if (userGroupId !== groupId){
                return next(ServerError.badRequest("User not in this group"));
            }
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.badRequest("Group not found"));
            }
            if (group.owner !== _id) {
                return next(ServerError.badRequest("User not group owner"));
            }
            if (permission === "groupOwner") {
                permission = "user";
            }
            await Group.deleteOne({_id: groupId});
            const user = await User.findOneAndUpdate({_id}, {$set: {groupId: null, permission}}, {new: true});
            // TODO: fix the bug of changing access rights to the users with permission higher than "member"
            await User.updateMany({groupId, permission: 'member'}, {$set: {groupId: null, permission: "user"}});
            req.session.user = user;
            return next(ServerMessage.success("Group deleted", undefined, group));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async leave(req, res, next) {
        try {
            const {groupId} = req.params;
            let { _id, permission, groupId: userGroupId } = req.session.user;
            if (userGroupId !== groupId){
                return next(ServerError.badRequest("User not in this group"));
            }
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.badRequest("Group not found"));
            }
            if (group.owner == _id) {
                return next(ServerError.badRequest("Group owner can't leave group"));
            }
            if (permission === "member") {
                permission = "user";
            }
            await Group.updateOne({_id: groupId}, {$pull: {members: _id}});
            const user = await User.findOneAndUpdate({_id}, {$set: {groupId: null, permission}}, {new: true});
            req.session.user = user;
            return next(ServerMessage.success("User left group", undefined, group));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async acceptInvite(req, res, next) {
        try {
            const {groupId} = req.params;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.badRequest("Group not found"));
            }
            let { _id, permission } = req.session.user;
            if (permission === "user") {
                permission = "member";
            }
            await Group.updateOne({_id: groupId}, {$push: {members: _id}, $pull: {invites: _id}});
            const user = await User.findOneAndUpdate({_id}, {$set: {groupId, permission}}, {new: true});
            req.session.user = user;
            return next(ServerMessage.success("User joined group", undefined, user));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async declineInvite(req, res, next) {
        try {
            const {groupId} = req.params;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.badRequest("Group not found"));
            }
            let { _id } = req.session.user;
            const updatedGroup = await Group.findOneAndUpdate({_id: groupId}, {$pull: {invites: _id}});
            return next(ServerMessage.success("Invite declined", undefined, updatedGroup));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async invite(req, res, next) {
        try {
            const {groupId} = req.params;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.badRequest("Group not found"));
            }
            const {userId} = req.body;
            const user = await User.findById(userId);
            if (!user) {
                return next(ServerError.badRequest("User not found"));
            }
            if (user.groupId) {
                return next(ServerError.badRequest("User already in group"));
            }
            const updatedGroup = await Group.findOneAndUpdate({_id: groupId}, {$push: {invites: userId}}, {new: true});
            return next(ServerMessage.success("User invited to group", undefined, updatedGroup));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async kick(req, res, next) {
        try {
            const {groupId} = req.params;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.notFound("Group not found"));
            }
            const {userId} = req.body;
            const user = await User.findById(userId);
            if (!user) {
                return next(ServerError.notFound("User not found"));
            }
            if (user.groupId !== groupId) {
                return next(ServerError.badRequest("User not in group"));
            }
            if (user._id === group.owner) {
                return next(ServerError.conflict("Group owner can't be kicked"));
            }
            const updatedGroup = await Group.findOneAndUpdate({_id: groupId}, {$pull: {members: userId}});
            await User.updateOne({_id: userId}, {$set: {groupId: null, permission: "user"}});
            return next(ServerMessage.success("User kicked from group", undefined, updatedGroup));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async update(req, res, next) {
        try {
            const {groupId} = req.params;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.badRequest("Group not found"));
            }
            const {name} = req.body;
            await Group.updateOne({_id: groupId}, {$set: {name}});
            return next(ServerMessage.success("Group updated", undefined, group));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getMembers(req, res, next) {
        try {
            const {groupId} = req.params;
            const group = await Group.findById(groupId);
            if (!group) {
                return next(ServerError.notFound("Group not found"));
            }
            return next(ServerMessage.success("Group members", group.members, group));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
}

export default new GroupController();