import ServerMessage from '../services/ServerMessageService.mjs';
import UserService from '../services/UserService.mjs';

class UserController {
  // Permission 'nobody'
  static async createUser(req, res, next) {
    try {
      const { login, password } = req.body;
      switch (true) {
        case await UserService.isLoginValid(login):
          return next(ServerMessage.conflict('User with this login already exists'));
        default:
          await UserService.createUser(login, password);
          return next(ServerMessage.success('User created'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'nobody'
  static async login(req, res, next) {
    try {
      const { user } = req.session;
      const { login, password } = req.body;
      switch (false) {
        case await UserService.isEmpty(user):
          return next(ServerMessage.conflict('User already logged in'));
        case await UserService.isLoginValid(login):
          return next(ServerMessage.badRequest('User with this login not found'));
        case await UserService.isPasswordCorrect(login, password):
          return next(ServerMessage.badRequest('Password is incorrect'));
        default:
          req.session.user = await UserService.login(login);
          return next(ServerMessage.success('User logged in'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async logout(req, res, next) {
    try {
      const { userId } = req.session.user;
      switch (false) {
        case await UserService.isUserExists(userId):
          return next(ServerMessage.conflict('User already logged out'));
        default:
          req.session.destroy();
          return next(ServerMessage.success('User logged out'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async editProfile(req, res, next) {
    try {
      const { userId } = req.session.user;
      const { login, password, username } = req.body;
      switch (true) {
        case await UserService.isEmpty(req.body):
          return next(ServerMessage.badRequest('No data to update'));
        case await UserService.isLoginValid(login):
          return next(ServerMessage.conflict('User with this login already exists'));
        default:
          await UserService.editProfile(userId, { login, password, username });
          return next(ServerMessage.success('User updated'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async deleteUser(req, res, next) {
    try {
      const { userId } = req.session.user;
      await UserService.deleteUser(userId);
      req.session.destroy();
      return next(ServerMessage.success('User deleted'));
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async deleteByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      switch (false) {
        case await UserService.isUserExists(userId):
          return next(ServerMessage.notFound('User not found'));
        default:
          await UserService.deleteUser(userId);
          return next(ServerMessage.success('User deleted'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async banById(req, res, next) {
    try {
      const { userId } = req.params;
      switch (false) {
        case await UserService.isUserExists(userId):
          return next(ServerMessage.badRequest('User not found'));
        default:
          await UserService.banUser(userId);
          return next(ServerMessage.success('User banned'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async unbanById(req, res, next) {
    try {
      const { userId } = req.params;
      switch (false) {
        case await UserService.isUserExists(userId):
          return next(ServerMessage.badRequest('User not found'));
        default:
          await UserService.unbanUser(userId);
          return next(ServerMessage.success('User unbanned'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async getUsers(req, res, next) {
    try {
      const users = await UserService.getUsers();
      return next(ServerMessage.success('Users found', users));
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      switch (false) {
        case await UserService.isUserExists(userId):
          return next(ServerMessage.notFound('User not found'));
        default:
          const user = await UserService.getUserById(userId);
          return next(ServerMessage.success('User found', user));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
}

export default UserController;
