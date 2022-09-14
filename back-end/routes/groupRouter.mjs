import Router from 'express';
import GroupController from "../controllers/GroupController.mjs";
import Permission from '../middlewares/PermissionsMiddleware.mjs';

const router = new Router();

router.post('/create', Permission('user'), GroupController.create);
router.delete('/:groupId/delete', Permission('groupOwner'), GroupController.delete);
router.put('/:groupId/update', Permission('groupOwner'), GroupController.update);
router.get('/:groupId/leave', Permission('member'), GroupController.leave);
router.get('/:groupId/acceptInvite', Permission('user'), GroupController.acceptInvite);
router.get('/:groupId/declineInvite', Permission('user'), GroupController.declineInvite);
router.post('/:groupId/invite', Permission('member'), GroupController.invite);
router.post('/:groupId/kick', Permission('groupOwner'), GroupController.kick);
router.get('/:groupId/getMembers', Permission('user'), GroupController.getMembers);

export default router;