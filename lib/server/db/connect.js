module.exports = (mongoose, uri) => {
  const db = mongoose.createConnection(uri);
  db.once('open', () => console.log('connected to db'));
  db.on('error', err => console.error('connection error:', err));
  return db;
};
