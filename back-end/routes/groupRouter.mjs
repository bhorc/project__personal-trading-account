import Router from 'express';
import GroupController from "../controllers/GroupController.mjs";
const router = new Router();

router.post('/create', GroupController.create);
router.post('/delete', GroupController.delete);
router.post('/leave', GroupController.leave);
router.post('/join', GroupController.join);
router.post('/update', GroupController.update);
router.get('/members', GroupController.members);

export default router;