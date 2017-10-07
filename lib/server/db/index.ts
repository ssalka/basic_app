import * as mongoose from 'mongoose';
import * as async from 'async';
import * as _ from 'lodash';

_.assign(mongoose, { Promise });

export const systemDbName = process.env.NODE_ENV
  .replace('production', 'appname')
  .replace('development', 'dev');

export const collectionsDbName = `${systemDbName}_collections`;

// TODO set up production db
const appMongoURI = `mongodb://localhost:27017/${systemDbName}`;
const collectionsMongoURI = `mongodb://localhost:27017/${collectionsDbName}`;

export const connections = {
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

export const waitForConnection = cb => async.until(
  () => _.isEqualWith(connections, openConnections, _.keys as any),
  setImmediate,
  () => cb(_.some(openConnections, isOpen => !isOpen))
);

export const closeConnection = cb => mongoose.disconnect(cb);
