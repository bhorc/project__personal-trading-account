import Router from 'express';
import userRouter from './userRouter.mjs';
import siteRouter from './siteRouter.mjs';
import groupRouter from './groupRouter.mjs';
import notificationRouter from "./notificationRouter.mjs";
import swaggerDocs from '../utils/swagger.mjs';

const routers = new Router();

routers.use('/user', userRouter);
routers.use('/notifications', notificationRouter);
routers.use('/site', siteRouter);
routers.use('/group', groupRouter);
routers.use('/docs', swaggerDocs);

export default routers;