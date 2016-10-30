const path = require('path');

const fileStructure = {
  public: path.resolve(__dirname, "../public")
};

const appConfig = {
  paths: {
    public: fileStructure.public,
    index: path.join(fileStructure.public, 'index.html')
  },
  session: {
    secret: 'the most secret secret ev4r blargharnarnar6g5h41er+8yh45w6+81sr7yu',
    resave: false,
    saveUninitialized: false
  }
};

module.exports = appConfig;
