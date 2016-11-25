const express = require('express');
const graphqlHTTP = require('express-graphql');
const { schema, queries } = require('./graphql');
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

module.exports = {
  rest: router,
  graphql: graphqlHTTP({
    schema,
    rootValue: queries,
    graphiql: true
  })
};
