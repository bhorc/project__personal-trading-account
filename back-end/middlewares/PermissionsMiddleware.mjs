import dotenv from "dotenv";
import ApiError from "../error/ApiError.mjs";
dotenv.config();

const permissionsPriority = {
    superAdmin: 9999,
    admin: 10,
    groupOwner: 9,
    member: 8,
    user: 7,
    nobody: 0,
    banned: -1,
}

const middleware = function (accessed = "nobody", denied = "banned") {
    return function (req, res, next) {
        if (!req.session.user) {
            return next(ApiError.unauthorized("Unauthorized", 401));
        }
        const { permission } = req.session.user;
        if (permission === 'banned') {
            return next(ApiError.forbidden("You have been banned"));
        }
        if (permissionsPriority[permission] < permissionsPriority[accessed] || permissionsPriority[permission] === permissionsPriority[denied]) {
            return next(ApiError.badRequest("You don't have permission to access this resource", 400));
        }
        next();
    }
}

export default middleware;