import Router from 'express';
import userRouter from './userRouter.mjs';
import siteRouter from './siteRouter.mjs';
import groupRouter from './groupRouter.mjs';

const routers = new Router();

routers.use('/user', userRouter);
routers.use('/site', siteRouter);
routers.use('/group', groupRouter);

export default routers;