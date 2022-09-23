import Router from 'express';
import SiteController from '../controllers/SiteController.mjs';
import Permission from '../middlewares/PermissionsMiddleware.mjs';

const router = new Router();

router.get('/getSites', SiteController.getSites);
router.get('/getSites/:siteId', SiteController.getSiteById);
router.post('/createSite', Permission('admin'), SiteController.createSite);
router.delete('/getSites/:siteId', Permission('admin'), SiteController.deleteSite);
router.put('/getSites/:siteId', Permission('admin'), SiteController.updateSite);
router.post('/getSites/:siteId/createHistory', Permission('user'), SiteController.createHistory);
router.get('/getSites/:siteId/histories/', Permission('user'), SiteController.getHistories);
router.get('/getSites/:siteId/histories/:historyId', Permission('user'), SiteController.getHistoriesById);
router.put('/getSites/:siteId/histories/:historyId', Permission('user'), SiteController.updateHistory);

export default router;
