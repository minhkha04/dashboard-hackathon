import express from 'express';
import commitRouter from './commit.route.js';

const rootRouter = express.Router();

rootRouter.use('/commits', commitRouter);

export default rootRouter;

