const express = require('express');
const middleware = require('./middleware');

const router = express.Router();

/**
 * GET ROUTES
 */

router.get('/me',
  middleware.getUser
);

router.get('/*',
  middleware.sendIndex
);


/**
 * POST ROUTES
 */

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
