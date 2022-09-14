import Router from 'express';
import UserController from '../controllers/UserController.mjs';
import Permission from '../middlewares/PermissionsMiddleware.mjs';

const router = new Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/logout', Permission('user'), UserController.logout);
router.get('/auth', Permission('user'), UserController.auth);
router.post('/editProfile', Permission('user'), UserController.editProfile);
router.delete('/deleteUser', Permission('user'), UserController.deleteUser);
router.delete('/deleteUser/:userId', Permission('admin'), UserController.deleteByUserId);
router.post('/ban', Permission('admin'), UserController.ban);
router.post('/unban', Permission('admin'), UserController.unban);
router.get('/getUsers', Permission('admin'), UserController.getUsers);
router.get('/getUsers/:userId', Permission('admin'), UserController.getUser);

export default router;