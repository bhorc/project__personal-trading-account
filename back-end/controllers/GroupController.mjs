import ServerMessage from '../services/ServerMessageService.mjs';
import GroupService from '../services/GroupService.mjs';
import UserService from '../services/UserService.mjs';

class GroupController {
  // Permission 'user'
  static async create(req, res, next) {
    try {
      const { userId } = req.session.user;
      const { name } = req.body;
      switch (true) {
        case await GroupService.isUserInAnyGroup(userId):
          return next(ServerMessage.badRequest('User already in group'));
        default:
          await GroupService.createGroup(userId, { name });
          req.session.user = await UserService.setPermission(userId, 'groupOwner', true);
          return next(ServerMessage.success('Group created'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'groupOwner'
  static async update(req, res, next) {
    try {
      const { userId } = req.session.user;
      const { groupId } = req.params;
      const { name } = req.body;
      switch (false) {
        case await GroupService.isGroupExists(groupId):
          return next(ServerMessage.badRequest('Group not found'));
        case await GroupService.isUserInGroup(userId, groupId):
          return next(ServerMessage.badRequest('User not in this group'));
        default:
          await GroupService.updateGroup(groupId, { name });
          return next(ServerMessage.success('Group updated'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'groupOwner'
  static async delete(req, res, next) {
    try {
      const { userId } = req.session.user;
      const { groupId } = req.params;
      switch (false) {
        case await GroupService.isGroupExists(groupId):
          return next(ServerMessage.badRequest('Group not found'));
        case await GroupService.isUserInGroup(userId, groupId):
          return next(ServerMessage.badRequest('User not in this group'));
        default:
          await GroupService.deleteGroup(userId, groupId);
          req.session.user = await UserService.setPermission(userId, 'user', false);
          return next(ServerMessage.success('Group deleted'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'member'
  static async leave(req, res, next) {
    try {
      const { userId } = req.session.user;
      const { groupId } = req.params;
      switch (false) {
        case await GroupService.isGroupExists(groupId):
          return next(ServerMessage.badRequest('Group not found'));
        case await GroupService.isUserInGroup(userId, groupId):
          return next(ServerMessage.badRequest('User not in this group'));
        default:
          await GroupService.kickUserFromGroup(userId, groupId);
          return next(ServerMessage.badRequest('User left group'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async acceptInvite(req, res, next) {
    try {
      const { userId } = req.session.user;
      const { groupId } = req.params;
      switch (false) {
        case await GroupService.isGroupExists(groupId):
          return next(ServerMessage.badRequest('Group not found'));
        case await GroupService.isUserInGroup(userId, groupId):
          return next(ServerMessage.badRequest('User not in this group'));
        default:
          await GroupService.acceptInvite(userId, groupId);
          return next(ServerMessage.success('Invite accepted'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async declineInvite(req, res, next) {
    try {
      const { userId } = req.session.user;
      const { groupId } = req.params;
      switch (false) {
        case await GroupService.isGroupExists(groupId):
          return next(ServerMessage.badRequest('Group not found'));
        default:
          await GroupService.declineInvite(userId, groupId);
          return next(ServerMessage.success('Invite declined'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'member'
  static async invite(req, res, next) {
    try {
      const { userId } = req.body;
      const { groupId } = req.params;
      switch (false) {
        case await UserService.isUserExists(userId):
          return next(ServerMessage.badRequest('User not found'));
        case await GroupService.isGroupExists(groupId):
          return next(ServerMessage.badRequest('Group not found'));
        default:
          await GroupService.inviteUserToGroup(userId, groupId);
          return next(ServerMessage.success('User invited to group'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'groupOwner'
  static async kick(req, res, next) {
    try {
      const { userId } = req.body;
      const { groupId } = req.params;
      switch (false) {
        case await UserService.isUserExists(userId):
          return next(ServerMessage.badRequest('User not found'));
        case await GroupService.isGroupExists(groupId):
          return next(ServerMessage.badRequest('Group not found'));
        case await GroupService.isUserInGroup(userId, groupId):
          return next(ServerMessage.badRequest('User not in this group'));
        default:
          await GroupService.kickUserFromGroup(userId, groupId);
          return next(ServerMessage.success('User kicked from group'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async getMembers(req, res, next) {
    try {
      const { groupId } = req.params;
      switch (false) {
        case await GroupService.isGroupExists(groupId):
          return next(ServerMessage.badRequest('Group not found'));
        default:
          // eslint-disable-next-line no-case-declarations
          const groupMembers = await GroupService.getGroupMembers(groupId);
          return next(ServerMessage.success('Group members', groupMembers));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
}

export default GroupController;
