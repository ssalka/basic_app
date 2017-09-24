const mongoose = Object.assign(require('mongoose'), { Promise });
const async = require('async');
const _ = require('lodash');

const systemDbName = process.env.NODE_ENV
  .replace('production', 'appname')
  .replace('development', 'dev');

const collectionsDbName = `${systemDbName}_collections`;

// TODO set up production db
const appMongoURI = `mongodb://localhost:27017/${systemDbName}`;
const collectionsMongoURI = `mongodb://localhost:27017/${collectionsDbName}`;

const connections = {
  app: mongoose.createConnection(appMongoURI),
  collections: mongoose.createConnection(collectionsMongoURI)
};

const openConnections = {};

_.forEach(connections, (conn, name) => {
  conn.on('open', () => {
    console.log(`connected to db ${name}`);
    openConnections[name] = true;
  });

  conn.on('error', err => {
    console.error('connection error:', err);
    openConnections[name] = false;
  });
});

module.exports = {
  connections,
  systemDbName,
  collectionsDbName,
  waitForConnection: cb => async.until(
    () => _.isEqualWith(connections, openConnections, _.keys),
    setImmediate,
    () => cb(_.some(openConnections, isOpen => !isOpen))
  ),
  closeConnection: cb => mongoose.disconnect(cb)
};
