const { randomBytes } = require('crypto');

module.exports = () => randomBytes(64).toString('hex');
