import * as express from 'express';
import * as middleware from './middleware';
import api from './api';

const router = express.Router();

/**
 * REST ROUTES
 */

router.use('/api', api);

router.get('/*',
  middleware.sendIndex
);

router.post('/register',
  middleware.registerUser,
  middleware.loginUser,
  middleware.startSession,
  middleware.loginSuccess
);

router.post('/login',
  middleware.loginUser,
  middleware.startSession,
  middleware.loginSuccess
);

router.post('/logout',
  middleware.closeSession,
  middleware.logout
);

export default router;
