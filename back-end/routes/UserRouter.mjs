import Router from 'express';
import UserController from '../controllers/UserController.mjs';
import Permission from '../middlewares/PermissionsMiddleware.mjs';

const router = new Router();

router.post('/createUser', UserController.createUser);
router.post('/login', UserController.login);
router.get('/logout', Permission('user'), UserController.logout);
router.post('/editProfile', Permission('user'), UserController.editProfile);
router.delete('/deleteUser', Permission('user'), UserController.deleteUser);
router.delete('/deleteUser/:userId', Permission('admin'), UserController.deleteByUserId);
router.post('/ban/:userId', Permission('admin'), UserController.banById);
router.post('/unban/:userId', Permission('admin'), UserController.unbanById);
router.get('/getUsers', Permission('admin'), UserController.getUsers);
router.get('/getUsers/:userId', Permission('admin'), UserController.getUserById);

export default router;
