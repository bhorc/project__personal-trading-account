import ServerMessage from '../services/ServerMessageService.mjs';
import NotificationService from '../services/NotificationService.mjs';

class NotificationController {
  // Permission 'user'
  static async subscribe(req, res, next) {
    try {
      const { userId } = req.session.user;
      const { notificationType } = req.body;
      switch (false) {
        case await NotificationService.isSubscriptionValid(notificationType):
          return next(ServerMessage.badRequest('Subscription type not valid'));
        case !await NotificationService.isUserSubscribed(userId, notificationType):
          return next(ServerMessage.conflict('User already subscribed to this type of notifications'));
        default:
          await NotificationService.subscribe(userId, notificationType);
          return next(ServerMessage.success('User successful subscribed to this type of notifications'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async unsubscribe(req, res, next) {
    try {
      const { userId } = req.session.user;
      const { notificationType } = req.body;
      switch (false) {
        case await NotificationService.isSubscriptionValid(notificationType):
          return next(ServerMessage.badRequest('Subscription type not valid'));
        case await NotificationService.isUserSubscribed(userId, notificationType):
          return next(ServerMessage.conflict('User already unsubscribed from this type of notifications'));
        default:
          await NotificationService.unsubscribe(userId, notificationType);
          return next(ServerMessage.success('User successful unsubscribed from this type of notifications'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async unsubscribeAll(req, res, next) {
    try {
      const { userId } = req.session.user;
      await NotificationService.unsubscribeAll(userId);
      return next(ServerMessage.success('User successful unsubscribed from all notifications'));
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async getSubscriptions(req, res, next) {
    try {
      const { userId } = req.session.user;
      const subscriptions = await NotificationService.getSubscriptions(userId);
      return next(ServerMessage.success('User subscriptions', subscriptions));
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async getNotifications(req, res, next) {
    try {
      const { userId } = req.session.user;
      const notifications = await NotificationService.getNotifications(userId);
      return next(ServerMessage.success('User notifications', notifications));
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async seenNotification(req, res, next) {
    try {
      const { userId } = req.session.user;
      const { notificationId } = req.params;
      switch (false) {
        case await NotificationService.isNotificationExist(notificationId):
          return next(ServerMessage.badRequest('Notification not found'));
        default:
          await NotificationService.seenNotification(userId, notificationId);
          return next(ServerMessage.success('Notification successful seen'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
}

export default NotificationController;
