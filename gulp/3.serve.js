'use strict';

const proxy = require('proxy-middleware');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
global.reload = browserSync.reload;
global.stream = browserSync.stream;
const url = require('url');
const fs = require('fs');

process.setMaxListeners(0);

gulp.task('browsersync', () => {

  const proxyOptions = url.parse('http://localhost:3005/api');
  proxyOptions.route = '/api';

  browserSync.init({
    server: {
      baseDir: 'public',
      middleware: [proxy(proxyOptions), function(req, res, next) {
        var fileName = url.parse(req.url).pathname;
        var fileExists = fs.existsSync('public/' + fileName);
        if (!fileExists && fileName.indexOf("browser-sync-client") < 0 || fileName === '/') {
          req.url = '/404.html';
        }
        return next();
      }]
    },
    https: true,
    ghostMode: true,
  });

  gulp.watch(['public/javascript/**/*']).on('change', reload);
  gulp.watch('scss/**/*', { usePolling: true }, gulp.series('css'));
});

gulp.task('serve', gulp.series('css', 'browsersync'));