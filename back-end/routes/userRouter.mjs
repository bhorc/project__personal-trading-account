import Router from 'express';
import UserController from '../controllers/UserController.mjs';
import Permission from '../middlewares/PermissionsMiddleware.mjs';

const router = new Router();

router.post('/ban', Permission('admin'), UserController.ban);
router.post('/unban', Permission('admin'), UserController.unban);

router.get('/logout', Permission('user'), UserController.logout);
router.get('/auth', Permission('user'), UserController.auth);

router.post('/register', UserController.register);
router.post('/login', UserController.login);

export default router;