const path = require('path');

const publicPath = path.resolve(__dirname, '../../dist');

module.exports = {
  publicPath,
  index: path.join(publicPath, 'index.html'),
  session: {
    secret: 'the most secret secret ev4r blargharnarnar6g5h41er+8yh45w6+81sr7yu',
    resave: false,
    saveUninitialized: false
  }
};
