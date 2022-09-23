import { User, Group } from '../models/Models.mjs';
import UserService from './UserService.mjs';
import ContainsService from './ContainsService.mjs';

class GroupService extends ContainsService {
  // Services for group verification
  static async isGroupExists(groupId) {
    const group = await Group.findById(groupId);
    return !!group;
  }
  static async isUserInAnyGroup(userId) {
    const { groupId } = await User.findById(userId);
    return groupId !== null;
  }
  static async isUserInGroup(userId, groupId) {
    const { members = [] } = await Group.findById(groupId);
    return members.includes(userId);
  }
  static async isUserInGroupIsOwner(userId, groupId) {
    const { ownerId } = await Group.findById(groupId);
    return ownerId === userId;
  }
  static async isUserInGroupIsInvited(userId, groupId) {
    const { invites } = await Group.findById(groupId);
    return invites.includes(userId);
  }
  // Services for group manipulation
  static async createGroup(userId, options) {
    const { name } = options;
    const { _id: groupId } = await Group.create({
      name,
      ownerId: userId,
      members: [userId],
      created: new Date(),
      updated: new Date(),
    });
    await UserService.editProfile(userId, { groupId, updated: new Date() });
    await UserService.setPermission(userId, 'groupOwner');
  }
  static async updateGroup(groupId, options) {
    const { name } = options;
    await Group.updateOne({ _id: groupId }, { $set: { name } });
  }
  static async deleteGroup(userId, groupId) {
    await Group.deleteOne({ _id: groupId });
    await UserService.editProfile(userId, { groupId: null, updated: new Date() });
    await UserService.setPermission(userId, 'user', true);
  }
  static async acceptInvite(userId, groupId) {
    await Group.updateOne({ _id: groupId }, {
      $pull: { invites: userId },
      $push: { members: userId },
    });
  }
  static async declineInvite(userId, groupId) {
    await Group.updateOne({ _id: groupId }, { $pull: { invites: userId } });
  }
  static async inviteUserToGroup(userId, groupId) {
    await Group.updateOne({ _id: groupId }, { $push: { invites: userId } });
  }
  static async kickUserFromGroup(userId, groupId) {
    await Group.updateOne({ _id: groupId }, { $pull: { members: userId } });
  }
  static async getGroupMembers(groupId) {
    const members = await User.find({ groupId });
    return members;
  }
}

export default GroupService;
