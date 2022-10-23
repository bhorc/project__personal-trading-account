import Router from 'express';
import SiteController from '../controllers/SiteController.mjs';
import Permission from '../middlewares/PermissionsMiddleware.mjs';

const router = new Router();

router.get('/', SiteController.getSites);
router.delete('/', Permission('admin'), SiteController.deleteSite);
router.put('/', Permission('admin'), SiteController.updateSite);
router.post('/createSite', Permission('admin'), SiteController.createSite);
router.post('/createHistory', Permission('user'), SiteController.createHistory);
router.get('/getHistories', Permission('user'), SiteController.getHistories);

export default router;
