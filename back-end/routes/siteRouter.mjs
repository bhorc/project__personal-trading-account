import Router from 'express';
import SiteController from '../controllers/SiteController.mjs';
const router = new Router();

router.delete('/list/:id', SiteController.deleteSite);
router.post('/createSite', SiteController.createSite);
router.put('/updateSite', SiteController.updateSite);
router.get('/getAllSites', SiteController.getAllSites);
router.get('/list/:id', SiteController.getSiteById);

router.get('/history', SiteController.history);
router.get('/options', SiteController.options);

export default router;