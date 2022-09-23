import Router from 'express';
import Permission from '../middlewares/PermissionsMiddleware.mjs';
import NotificationController from '../controllers/NotificationController.mjs';

const router = new Router();

router.post('/subscribe', Permission('user'), NotificationController.subscribe);
router.post('/unsubscribe', Permission('user'), NotificationController.unsubscribe);
router.get('/unsubscribeAll', Permission('user'), NotificationController.unsubscribeAll);
router.get('/getSubscriptions', Permission('user'), NotificationController.getSubscriptions);
router.get('/getNotifications', Permission('user'), NotificationController.getNotifications);
router.get('/getNotifications/:notificationId', Permission('user'), NotificationController.seenNotification);

export default router;
