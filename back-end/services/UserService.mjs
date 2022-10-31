import bcrypt from 'bcrypt';
import { User } from '../models/Models.mjs';
import permissionsPriority from '../models/PermissionsPriority.mjs';
import ContainsService from './ContainsService.mjs';

class UserService extends ContainsService {
  // Services for group verification
  static async isUserExists(userId) {
    const findUser = await User.findById(userId);
    return !!findUser;
  }
  static async isLoginValid(login) {
    const findUser = await User.findOne({ login });
    return !!findUser;
  }
  static async isPasswordCorrect(login, password) {
    const { password: hashPassword } = await User.findOne({ login });
    const isPasswordValid = await bcrypt.compare(password, hashPassword);
    return isPasswordValid;
  }
  static async isBanned(userId) {
    const { isBanned } = await User.findOne({ _id: userId });
    return isBanned;
  }
  // Services for group middleware
  static getPriorityPermission(userPermission, setPermission) {
    switch (true) {
      case !userPermission:
      case !setPermission:
      case permissionsPriority[userPermission] > permissionsPriority[setPermission]:
        return userPermission;
      default:
        return setPermission;
    }
  }
  static async cryptPassword(password) {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  }
  // Services for group manipulation
  static async login(login) {
    const {
      _id: userId, permission, isBanned, isAdmin, steamId,
    } = await User.findOne({ login });
    return {
      userId, permission, isBanned, isAdmin, steamId,
    };
  }
  static async logout(session) {
    session.destroy();
  }
  static async deleteUser(userId) {
    await User.deleteOne({ _id: userId });
  }
  static async createUser(login, password) {
    const hashPassword = await this.cryptPassword(password);
    await User.create({ login, password: hashPassword, registered: Date.now() });
  }
  static async banUser(userId) {
    await User.updateOne({ _id: userId }, {
      $set: { isBanned: true },
    });
  }
  static async unbanUser(userId) {
    await User.updateOne({ _id: userId }, {
      $set: { isBanned: false },
    });
  }
  static async editProfile(userId, options = {}) {
    const { password: newPassword } = options;
    const updateOptions = { ...options };
    if (newPassword) {
      updateOptions.password = await this.cryptPassword(newPassword);
    }
    const {
      permission, isBanned, isAdmin, steamId,
    } = await User.findOneAndUpdate({ _id: userId }, { $set: updateOptions }, { new: true });
    return {
      userId, permission, isBanned, isAdmin, steamId,
    };
  }
  static async setPermission(userId, newPermission, priority) {
    const { permission: userPermission } = await UserService.getUserById(userId);
    let setPermission = newPermission;
    if (priority) {
      setPermission = await this.getPriorityPermission(userPermission, newPermission);
    }
    const {
      permission, isBanned, isAdmin, steamId,
    } = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { permission: setPermission } },
      { new: true },
    );
    return {
      userId, permission, isBanned, isAdmin, steamId,
    };
  }
  static async getUserById(userId) {
    const findUser = await User.findById(userId);
    return findUser;
  }
  static async getUsers() {
    const findUsers = await User.find();
    return findUsers;
  }
}

export default UserService;
