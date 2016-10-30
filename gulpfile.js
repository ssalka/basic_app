const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const path = require('path');
const { argv } = require('yargs');

gulp.task('default', () => {
  nodemon({
    script: path.resolve('./src/server/index.js'),
    env: { NODE_ENV: 'development' },
    exec: argv.i || argv.inspect ? 'node --inspect' : 'node'
  });
});
