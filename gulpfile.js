/**
 * Gulpfile to automate build and release task
 * Most of it borrowed from Kitematic (https://github.com/kitematic/kitematic/blob/master/gulpfile.js)
 */

'use strict'

var packageJson = require('./package.json');
var sequence = require('run-sequence');
var gulp = require('gulp');
var fs = require('fs');
var del = require('del');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var shell = require('shelljs');
var Yoda = require('electron-connect').server.create();
var $ = require('gulp-load-plugins')({
  rename: {
    'gulp-download-electron': 'electron'
  }
});

// Application dependencies
var dependencies = Object.keys(packageJson.dependencies);

// Check the environment
var devEnv = (process.env.NODE_ENV === 'production') ? false : true;

// App options
var options = {
  dev: devEnv,
  name: 'Yoda',
  app: 'Yoda.app',
  dmg: 'yoda-installer-1.0.1.dmg',
  icon: './src/resources/utils/yoda.icns',
  plist: './src/resources/utils/Info.plist',
  bundle: 'com.whoisandie.yoda'
};

// Paths
var paths = {
  APP: ['src/index.html', 'src/browser.js', 'src/yoda.bundled.js', 'src/yoda.bundled.js.map'],
  BUILD_FILES: ['build/index.html', 'build/browser.js', 'build/yoda.bundled.js', 'build/yoda.bundled.js.map'],
  FONTS: 'src/resources/fonts/**',
  IMAGES: 'src/resources/images/**',
  JS_FILES: ['src/scripts/*.js'],
  CSS_FILES: ['src/styles/**/*.less', 'src/styles/*.less'],
  BUILD: './build',
  TMP: './tmp',
  RELEASE: './release'
};

// Clean build task
gulp.task('clean:build', function(cb){
  del([
    paths.BUILD
  ], cb);
});

// Clean Release task
gulp.task('clean:release', function(cb){
  del([
    paths.TMP,
    paths.RELEASE
  ], cb);
});

// Download task
gulp.task('download', ['clean:build'], function(cb){
  $.electron({
    version: packageJson['electron-version'],
    outputDir: 'cache'
  }, cb);
});

// Copy task
gulp.task('copy', function(){
  return gulp.src(paths.APP)
  .pipe(gulp.dest(options.dev ? paths.BUILD : paths.TMP));
});

// Fonts task
gulp.task('fonts', function(){
  return gulp.src(paths.FONTS)
  .pipe($.if(options.dev, $.changed(paths.BUILD)))
  .pipe(gulp.dest(options.dev ? paths.BUILD : paths.TMP));
});

// Images task
gulp.task('images', function(){
  return gulp.src(paths.IMAGES)
  .pipe($.if(options.dev, $.changed(paths.BUILD)))
  .pipe(gulp.dest(options.dev ? paths.BUILD : paths.TMP));
});

// Styles task
gulp.task('styles', function(){
  return gulp.src('src/styles/main.less')
  .pipe($.plumber(function(error) {
      $.util.log($.util.colors.red('Error (' + error.plugin + '): ' + error.message + ' in ' + error.fileName));
      this.emit('end');
  }))
  .pipe($.if(options.dev, $.changed(paths.BUILD)))
  .pipe($.less())
  .pipe($.if(!options.dev, $.cssmin()))
  .pipe(gulp.dest(options.dev ? paths.BUILD : paths.TMP));
});

// Scripts task
gulp.task('scripts', function(){
  return gulp.src(paths.JS_FILES)
  .pipe($.plumber(function(error) {
      $.util.log($.util.colors.red('Error (' + error.plugin + '): ' + error.message + ' in ' + error.fileName));
      this.emit('end');
  }))
  .pipe($.if(options.dev, $.changed(paths.BUILD)))
  .pipe($.babel({ blacklist: ['regenerator'] }))
  .pipe($.if(!options.dev, $.uglify({ mangle: false })))
  .pipe(gulp.dest(options.dev ? paths.BUILD : paths.TMP));
});

//Webpack task
gulp.task('webpack', function(cb){
  if (! options.dev) {
    var minifier = new webpack.optimize.UglifyJsPlugin({
      minimize: true
    });
    webpackConfig.plugins.push(minifier);
  }
  else {
    webpackConfig.devtool = 'sourcemap';
  }

  webpack(webpackConfig, function(error) {
    if (error) {
      throw error;
    }
    else {
      cb();
    }
  });
});

// Compile task
gulp.task('compile', function(cb){
  sequence('webpack', 'copy', 'fonts', 'images', 'styles', cb);
});

// Watch task
gulp.task('watch', ['compile'], function(){
  var env = process.env;
  env.NODE_ENV = 'development';

  Yoda.start({env: env});

  shell.exec('webpack --watch --devtool source-map', {
    async: true
  });

  gulp.watch(paths.APP, ['copy']);
  gulp.watch(paths.CSS_FILES, ['styles']);
  gulp.watch(paths.BUILD_FILES, Yoda.reload);
});

// Default task
gulp.task('default', ['watch']);
