import * as express from 'express';
import { indexHtml } from '../config';
import api from './api';
import auth from './auth';

const router = express.Router();

/**
 * REST ROUTES
 */

router.use('/api', api);

router.use(auth);

router.get('/*', (_, res) => res.sendFile(indexHtml));

export default router;
