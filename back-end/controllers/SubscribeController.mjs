import dotenv from 'dotenv';
import ServerMessage from "../union/ServerMessage.mjs";
import models, {User} from '../models/models.mjs';
dotenv.config();

const subscriptionTypes = Object.keys(models);

class SubscribeController {
    async subscribe(req, res, next) {
        try {
            const {subscriptionType} = req.body;
            if (!req.session.user) {
                return next(ServerMessage.badRequest("User not found"));
            }
            if (!subscriptionTypes.includes(subscriptionType)) {
                return next(ServerMessage.badRequest("Invalid subscription type"));
            }
            if (req.session.user.subscriptions.includes(subscriptionType)) {
                return next(ServerMessage.badRequest("You are already subscribed to this type of notifications"));
            }
            const data = await User.findOneAndUpdate({_id: req.session.user._id}, {$push: {subscriptions: subscriptionType}}, {new: true});
            const { _id, type } = data;

            req.session.user = data;
            return next(ServerMessage.success("You are now subscribed to this type of notifications", { _id, type }));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async unsubscribe(req, res, next) {
        try {
            const {subscriptionType} = req.body;
            if (!req.session.user) {
                return next(ServerMessage.badRequest("User not found"));
            }
            if (!subscriptionTypes.includes(subscriptionType)) {
                return next(ServerMessage.badRequest("Invalid subscription type"));
            }
            if (!req.session.user.subscriptions.includes(subscriptionType)) {
                return next(ServerMessage.badRequest("You are not subscribed to this type of notifications"));
            }
            const user = await User.findOneAndUpdate({_id: req.session.user._id}, {$pull: {subscriptions: subscriptionType}}, {new: true});
            req.session.user = user;
            return next(ServerMessage.success("You are now unsubscribed from this type of notifications"));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async unsubscribeAll(req, res, next) {
        try {
            if (!req.session.user) {
                return next(ServerMessage.badRequest("User not found"));
            }
            const user = await User.findOneAndUpdate({_id: req.session.user._id}, {$set: {subscription: []}}, {new: true});
            req.session.user = user;
            return next(ServerMessage.success("You are now unsubscribed from all types of notifications"));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async subscriptions(req, res, next) {
        try {
            if (!req.session.user) {
                return next(ServerMessage.badRequest("User not found"));
            }
            const {subscriptions} = req.session.user;
            return next(ServerMessage.success({ subscriptions }));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
}

export default new SubscribeController();