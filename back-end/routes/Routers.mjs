import Router from 'express';
import userRouter from './userRouter.mjs';
import siteRouter from './siteRouter.mjs';
import groupRouter from './groupRouter.mjs';
import subscribeRouter from "./subscribeRouter.mjs";

const routers = new Router();

routers.use('/user', userRouter);
routers.use('/notifications', subscribeRouter);
routers.use('/site', siteRouter);
routers.use('/group', groupRouter);

export default routers;