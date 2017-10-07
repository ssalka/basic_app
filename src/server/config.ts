import * as path from 'path';

export const publicPath = path.resolve(__dirname, '../../dist');

export const indexHtml = path.join(publicPath, 'index.html');

export const sessionConfig = {
  secret: 'the most secret secret ev4r blargharnarnar6g5h41er+8yh45w6+81sr7yu',
  resave: false,
  saveUninitialized: false
};
