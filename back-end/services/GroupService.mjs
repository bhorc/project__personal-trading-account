import { Group } from '../models/Models.mjs';
import ContainsService from './ContainsService.mjs';

class GroupService extends ContainsService {
  // Services for group verification
  static async isGroupExists(groupId) {
    const group = await Group.findById(groupId);
    return !!group;
  }
  static async isUserInAnyGroup(userId) {
    const groups = await Group.find();
    return groups?.some(({ membersId }) => membersId.includes(userId));
  }
  static async isUserInGroup(userId, groupId) {
    const { membersId } = await Group.findById(groupId);
    return membersId.includes(userId);
  }
  static async isUserInGroupIsOwner(userId, groupId) {
    const { ownerId } = await Group.findById(groupId);
    return ownerId === userId;
  }
  static async isUserInGroupIsInvited(userId, groupId) {
    const { invitesId } = await Group.findById(groupId);
    return invitesId.includes(userId);
  }
  // Services for group manipulation
  static async createGroup(userId, options) {
    const { name } = options;
    await Group.create({ name, ownerId: userId, membersId: [userId] });
  }
  static async updateGroup(groupId, options) {
    const { name } = options;
    await Group.updateOne({ _id: groupId }, { $set: { name } });
  }
  static async deleteGroup(userId, groupId) {
    await Group.deleteOne({ _id: groupId });
  }
  static async acceptInvite(userId, groupId) {
    await Group.updateOne({ _id: groupId }, {
      $pull: { invitesId: userId },
      $push: { membersId: userId },
    });
  }
  static async declineInvite(userId, groupId) {
    await Group.updateOne({ _id: groupId }, { $pull: { invitesId: userId } });
  }
  static async inviteUserToGroup(userId, groupId) {
    await Group.updateOne({ _id: groupId }, { $push: { invitesId: userId } });
  }
  static async kickUserFromGroup(userId, groupId) {
    await Group.updateOne({ _id: groupId }, { $pull: { membersId: userId } });
  }
  static async getGroupMembers(groupId) {
    const { membersId } = await Group.findById(groupId);
    return membersId;
  }
}

export default GroupService;
