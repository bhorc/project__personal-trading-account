import dotenv from 'dotenv';
import ServerError from '../services/ServerMessageService.mjs';
import permissionsPriority from '../models/PermissionsPriority.mjs';

dotenv.config();

const middleware = function (accessed = 'nobody', denied = 'banned') {
  return function (req, res, next) {
    const { user = {} } = req.session;
    const {
      userId,
      permission = 'nobody',
      isBanned = false,
      isAdmin = false,
    } = user;
    const accessedPermission = permissionsPriority[permission] < permissionsPriority[accessed];
    const deniedPermission = permissionsPriority[permission] > permissionsPriority[denied];

    switch (true) {
      case isAdmin:
        return next();
      case !userId:
        return next(ServerError.unauthorized('User not logged in'));
      case isBanned:
        return next(ServerError.forbidden('User is banned'));
      case accessedPermission && deniedPermission:
        return next(ServerError.forbidden('User has no permission'));
      default:
        return next();
    }
  };
};

export default middleware;
