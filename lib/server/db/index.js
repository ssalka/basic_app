const mongoose = Object.assign(require('mongoose'), { Promise });
const mongoURI = process.env.NODE_ENV === 'production'
  ? '' // TODO set up production db
  : "mongodb://localhost:27017/test";

const db = mongoose.createConnection(mongoURI);
db.once('open', () => console.log('connected to db'));
db.on('error', err => console.error('connection error:', err));

module.exports = db;
