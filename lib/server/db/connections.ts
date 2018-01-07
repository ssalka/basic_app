import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';
import * as async from 'async';
import * as _ from 'lodash';
import { appMongoURI, collectionsMongoURI } from './config';

_.assign(mongoose, { Promise });

export const connections: Record<string, Connection> = {
  app: mongoose.createConnection(appMongoURI),
  collections: mongoose.createConnection(collectionsMongoURI)
};

const openConnections = {};

_.forEach(connections, (conn: Connection, name: string) => {
  conn.on('open', () => {
    console.log(`connected to db ${name}\n`);
    openConnections[name] = true;
  });

  conn.on('error', err => {
    console.error('\nconnection error:', err, '\n');
    openConnections[name] = false;
  });
});

const allConnectionsOpen = () =>
  _.size(openConnections) === _.size(connections) && _.every(openConnections);

export const waitForConnection = new Promise(resolve =>
  async.until(allConnectionsOpen, setImmediate, resolve)
);

export const closeConnection = cb => mongoose.disconnect(cb);
