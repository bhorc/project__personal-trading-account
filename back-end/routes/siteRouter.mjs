import Router from 'express';
import SiteController from '../controllers/SiteController.mjs';
import Permission from '../middlewares/PermissionsMiddleware.mjs';
const router = new Router();

router.post('/createSite', Permission('admin'), SiteController.createSite);
router.get('/getSites', SiteController.getSites);
router.get('/getSites/:siteId', SiteController.getSiteById);
router.delete('/getSites/:siteId', Permission('admin'), SiteController.deleteSite);
router.put('/getSites/:siteId', Permission('admin'), SiteController.updateSite);
router.put('/getSites/:siteId/history', Permission('user'), SiteController.createHistory);
router.get('/getSites/:siteId/history/', Permission('user'), SiteController.getHistories);
router.put('/getSites/:siteId/history/:historyId', Permission('user'), SiteController.updateHistory);
router.get('/getSites/:siteId/history/:historyId', Permission('user'), SiteController.getHistoriesById);

export default router;