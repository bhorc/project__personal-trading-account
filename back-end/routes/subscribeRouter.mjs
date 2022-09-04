import Router from 'express';
import Permission from "../middlewares/PermissionsMiddleware.mjs";
import SubscribeController from "../controllers/SubscribeController.mjs";
import router from "./userRouter.mjs";

const routers = new Router();

router.post('/subscribe', Permission('user'), SubscribeController.subscribe);
router.post('/unsubscribe', Permission('user'), SubscribeController.unsubscribe);
router.post('/unsubscribeAll', Permission('user'), SubscribeController.unsubscribeAll);
router.get('/subscriptions', Permission('user'), SubscribeController.subscriptions);

export default routers;