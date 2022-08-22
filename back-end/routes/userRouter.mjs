import Router from 'express';
import UserController from '../controllers/UserController.mjs';
const router = new Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/auth', UserController.check);

export default router;