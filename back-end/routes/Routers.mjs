import Router from 'express';
import UserRouter from './UserRouter.mjs';
import NotificationRouter from './NotificationRouter.mjs';
import SiteRouter from './SiteRouter.mjs';
import GroupRouter from './GroupRouter.mjs';
import SwaggerRouter from './SwaggerRouter.mjs';
// import ItemRouter from './ItemRouter.mjs';
// import TransactionRouter from './TransactionRouter.mjs';

const routers = new Router();

routers.use('/user', UserRouter);
routers.use('/notifications', NotificationRouter);
routers.use('/site', SiteRouter);
routers.use('/group', GroupRouter);
routers.use('/docs', SwaggerRouter);
// routers.use('/item', ItemRouter);
// routers.use('/transaction', TransactionRouter);

export default routers;
