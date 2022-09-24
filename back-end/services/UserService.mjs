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
  static async getUser(...options) {
    const user = await User.findOne({ options });
    return user;
  }
  static async cryptPassword(password) {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  }
  // Services for group manipulation
  static async login(login, user) {
    const {
      _id: userId, permission, isBanned, isAdmin,
    } = await User.findOne({ login });
    Object.assign(user, {
      userId, permission, isBanned, isAdmin,
    });
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
    const { password } = options;
    const updateOptions = { ...options, updated: Date.now() };
    if (password) {
      updateOptions.password = await this.cryptPassword(password);
    }
    await User.updateOne({ _id: userId }, { $set: updateOptions });
  }
  static async setPermission(userId, permission, isImportant = false) {
    const { permission: userPermission } = await User.findOne({ _id: userId });
    const updateOptions = { permission, updated: Date.now() };
    if (!isImportant) {
      updateOptions.permission = this.getPriorityPermission(userPermission, permission);
    }
    await User.updateOne({ _id: userId }, { $set: updateOptions });
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
