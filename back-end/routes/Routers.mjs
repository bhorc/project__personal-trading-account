import Router from 'express';
import UserRouter from './UserRouter.mjs';
import NotificationRouter from './NotificationRouter.mjs';
import SiteRouter from './SiteRouter.mjs';
import GroupRouter from './GroupRouter.mjs';
import SwaggerRouter from './SwaggerRouter.mjs';

const routers = new Router();

routers.use('/user', UserRouter);
routers.use('/notifications', NotificationRouter);
routers.use('/site', SiteRouter);
routers.use('/group', GroupRouter);
routers.use('/docs', SwaggerRouter);

export default routers;
