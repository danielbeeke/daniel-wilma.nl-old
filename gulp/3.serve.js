'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
global.reload = browserSync.reload;
global.stream = browserSync.stream;
const url = require('url');
const fs = require('fs');

process.setMaxListeners(0);

gulp.task('browsersync', () => {
  browserSync.init({
    server: ['public'],
    ghostMode: true,
    middleware: function(req, res, next) {
      var fileName = url.parse(req.url).pathname;
      var fileExists = fs.existsSync('public/' + fileName);
      if (!fileExists && fileName.indexOf("browser-sync-client") < 0 || fileName === '/') {
        req.url = '/404.html';
      }
      return next();
    }
  });

  gulp.watch(['public/javascript/**/*']).on('change', reload);
  gulp.watch('scss/**/*', { usePolling: true }, gulp.series('css'));
});

gulp.task('serve', gulp.series('nodemon', 'css', 'browsersync'));