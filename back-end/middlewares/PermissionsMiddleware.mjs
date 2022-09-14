import dotenv from "dotenv";
import ServerError from "../utils/ServerMessage.mjs";
import permissionsPriority from "../models/permissionsPriority.mjs";
dotenv.config();

const middleware = function (accessed = "nobody", denied = "banned") {
    return function (req, res, next) {
        if (!req.session.user) {
            return next(ServerError.unauthorized("User is not logged in"));
        }
        const { permission, isBanned } = req.session.user;
        if (!permissionsPriority[permission] || isBanned) {
            return next(ServerError.forbidden("You have been banned"));
        }
        if (permissionsPriority[permission] < permissionsPriority[accessed] && permissionsPriority[permission] > permissionsPriority[denied]) {
            return next(ServerError.badRequest("You don't have permission to access this resource"));
        }
        next();
    }
}

export default middleware;