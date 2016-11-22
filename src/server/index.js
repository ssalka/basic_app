const express = require('express');
const graphqlHTTP = require('express-graphql');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { buildSchema } = require('graphql');
const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { types: { ObjectId } } = require('lib/server/utils');

const {
  db: { conn },
  models: { User, Collection },
  utils: { types }
} = require('lib/server');

const routes = require('./routes');
const config = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(config.publicPath));
app.use(express.static(config.blueprintPath));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const schema = buildSchema(`
  type Query {
    me: User
    hello: String
    user(id: String): User
    users(limit: Int): [User]
    collections(id: String, creator: String): [Collection]
  }

  type User {
    # A user on the site
    _id: String
    username: String
    email: String
    library: Library
  }

  type Library {
    # A user's content
    collections: [Collection]
  }

  type Collection {
    # A collection of documents owned by a user
    _id: String
    name: String
    creator: User
  }
`);

const loaders = {
  me: () => User.findOne({ _id: "581f60e5a3193e23932cd6eb" }),
  user: ({id}) => User.findById(id).populate('library.collections').exec(),
  users: ({ids, limit = 0}) => {
    const query = {};
    if (_.isArray(ids)) query._id = { $in: ids };
    return User.find(query).populate('library.collections').limit(limit).exec()
  },
  collections: ({id}) => Collection.find({ _id: id }).exec()
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: loaders,
  graphiql: true
}));

app.use('/', routes);


app.listen(3000, () => {
  console.log('Listening on port 3000');
});

module.exports = app;
