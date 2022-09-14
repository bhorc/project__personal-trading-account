import dotenv from 'dotenv';
import ServerMessage from "../utils/ServerMessage.mjs";
import models, {User, Notification} from '../models/models.mjs';
dotenv.config();

const notificationsTypes = Object.keys(models);

class NotificationController {
    async subscribe(req, res, next) {
        try {
            const {notificationType} = req.body;
            if (!notificationsTypes.includes(notificationType)) {
                return next(ServerMessage.badRequest("Subscription type not valid"));
            }
            const {_id, subscriptions} = req.session.user;
            if (subscriptions.includes(notificationType)) {
                return next(ServerMessage.conflict("User already subscribed to this type of notifications"));
            }
            const updatedUser = await User.findOneAndUpdate({_id}, {$push: {subscriptions: notificationType}}, {new: true});
            req.session.user = updatedUser;
            return next(ServerMessage.success("User successful subscribed to this type of notifications", undefined, updatedUser));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async unsubscribe(req, res, next) {
        try {
            const {notificationType} = req.body;
            if (!notificationsTypes.includes(notificationType)) {
                return next(ServerMessage.badRequest("Subscription type not valid"));
            }
            if (!req.session.user.subscriptions.includes(notificationType)) {
                return next(ServerMessage.conflict("User already unsubscribed from this type of notifications"));
            }
            const updatedUser = await User.findOneAndUpdate({_id: req.session.user._id}, {$pull: {subscriptions: notificationType}}, {new: true});
            req.session.user = updatedUser;
            return next(ServerMessage.success("User successful unsubscribed from this type of notifications", undefined, updatedUser));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async unsubscribeAll(req, res, next) {
        try {
            const updatedUser = await User.findOneAndUpdate({_id: req.session.user._id}, {$set: {subscription: []}}, {new: true});
            req.session.user = updatedUser;
            return next(ServerMessage.success("User successful unsubscribed from all notifications", undefined, updatedUser));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getSubscriptions(req, res, next) {
        try {
            const {subscriptions} = req.session.user;
            return next(ServerMessage.success("User subscriptions", subscriptions, subscriptions));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getNotifications(req, res, next) {
        try {
            const {_id, subscriptions} = req.session.user;
            const notifications = await Notification.find({userId: _id, location: {$in: subscriptions}});
            return next(ServerMessage.success("User notifications", notifications, notifications));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async readNotification(req, res, next) {
        try {
            const {notificationId} = req.params;
            const notification = await Notification.findOne({_id: notificationId});
            if (!notification) {
                return next(ServerMessage.notFound("Notification not found"));
            }
            const updatedNotification = await Notification.findOneAndUpdate({_id: notificationId}, {$set: {seen: true}}, {new: true});
            return next(ServerMessage.success("Notification read", undefined, updatedNotification));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
}

export default new NotificationController();