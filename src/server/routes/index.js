const express = require('express');
const middleware = require('./middleware');

const router = express.Router();

/**
 * GRAPHQL ROUTES
 */

router.get('/graphiql',
  middleware.graphiql
);

router.get('/schema',
  middleware.schema
);

router.post('/graphql',
middleware.graphql
);


/**
 * REST ROUTES
 */

router.get('/me',
  middleware.getUser
);

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
