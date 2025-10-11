import express from 'express';
import CommitController from '../controllers/commit.controller.js';

const commitRouter = express.Router();
commitRouter.get('/grouped-by-repo', CommitController.getCommitsGroupedByRepo);

export default commitRouter;