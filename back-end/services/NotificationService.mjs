import models, { User, Notification } from '../models/Models.mjs';
import ContainsService from './ContainsService.mjs';

const notificationsTypes = Object.keys(models);

class NotificationService extends ContainsService {
  // Services for group verification
  static async isNotificationExist(notificationId) {
    return Notification.exists({ _id: notificationId });
  }
  static async isSubscriptionValid(notificationType) {
    return notificationsTypes.includes(notificationType);
  }
  static async isUserSubscribed(userId, notificationType) {
    const { subscriptions } = await User.findById(userId);
    return subscriptions.includes(notificationType);
  }
  // Services for group manipulation
  static async subscribe(userId, notificationType) {
    await User.updateOne({ _id: userId }, {
      $push: { subscriptions: notificationType },
    });
  }
  static async unsubscribe(userId, notificationType) {
    await User.updateOne({ _id: userId }, {
      $pull: { subscriptions: notificationType },
    });
  }
  static async unsubscribeAll(userId) {
    await User.updateOne({ _id: userId }, {
      $set: { subscriptions: [] },
    });
  }
  static async getSubscriptions(userId) {
    const { subscriptions } = await User.findById(userId);
    return subscriptions;
  }
  static async getNotifications(userId) {
    const notifications = await Notification.find({ userId });
    return notifications;
  }
  static async seenNotification(userId, notificationId) {
    await Notification.updateOne({ _id: notificationId, userId }, {
      $set: { seen: true },
    });
  }
}

export default NotificationService;
