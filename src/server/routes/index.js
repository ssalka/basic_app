const express = require('express');
const middleware = require('./middleware');
const api = require('./api');

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

module.exports = router;
