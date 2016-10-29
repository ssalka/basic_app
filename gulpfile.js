const gulp = require('gulp');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const react = require('gulp-react');
const rimraf = require('gulp-rimraf');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const gulpWebpack = require("gulp-webpack");
const webpack = require('webpack');
const { argv } = require('yargs');

const path = require('path');
const config = require('./webpack.config.js');

const args = {
  skip: argv.s || argv.skip,
  inspect: argv.i || argv.inspect
};

const deps = {
  get nodemon() {
    const tasks = [];
    if (!args.skip) tasks.push('default');
    return tasks;
  }
};

const paths = {
  client: {
    js: ['src/client/**/*.js'],
    index: 'src/client/index.html'
  },
  public: 'src/public',
  node_modules: 'node_modules'
};

const script = path.join(__dirname, 'src/server/index.js');
const env = { NODE_ENV: 'development' };
const exec = 'node';
if (args.inspect) exec += ' --inspect';

gulp.task('default', ['build']);

gulp.task('build', ['public']);


gulp.task('nodemon', deps['nodemon'], () => {
  nodemon({ script, env, exec })
    .on('restart', ['build']);
});

gulp.task('clean', () => {
  return gulp.src(paths.public)
    .pipe(rimraf({ force: true }));
});

gulp.task('copy', ['clean'], () => {
  return gulp.src(paths.client.index)
    .pipe(gulp.dest(paths.public));
});

gulp.task('public', ['copy'], () => {
  if (process.env.NODE_ENV !== 'production') {
    return gulp.src(path.join(__dirname, 'src/client/index.js'))
      .pipe(plumber())
      .pipe(react())
      .pipe(gulpWebpack(config), webpack)
      .pipe(gulp.dest(paths.public));
  }
  return gulp.src(path.join(__dirname, 'src/client/index.js'))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(react())
    .pipe(gulpWebpack(config), webpack)
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.public));
});

gulp.task('watch', ['watch:js']);

gulp.task('watch:js', () => {
  gulp.watch(paths.client.js, ['public']);
});
