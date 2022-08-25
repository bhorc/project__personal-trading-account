import Router from 'express';
import SiteController from '../controllers/SiteController.mjs';
import Permission from '../middlewares/PermissionsMiddleware.mjs';
const router = new Router();

router.delete('/list/:id', Permission('admin'), SiteController.deleteSite);
router.post('/addSite', Permission('admin'), SiteController.addSite);
router.post('/updateSite', Permission('admin'), SiteController.updateSite);
router.get('/getAllSites', SiteController.getAllSites);
router.get('/list/:id', SiteController.getSiteById);

router.post('/history', Permission('user'), SiteController.setHistory);
router.get('/history', Permission('user'), SiteController.getHistory);
router.get('/options', Permission('user'), SiteController.options);

export default router;