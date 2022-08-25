import Router from 'express';
import GroupController from "../controllers/GroupController.mjs";
import Permission from '../middlewares/PermissionsMiddleware.mjs';

const router = new Router();

router.post('/create', GroupController.create);
router.post('/delete', Permission('groupOwner'), GroupController.delete);
router.post('/update', Permission('groupOwner'), GroupController.update);
router.post('/leave', Permission('member'), GroupController.leave);
router.post('/join', Permission('user'), GroupController.join);
router.get('/members', GroupController.members);

export default router;