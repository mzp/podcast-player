var requireDir = require('require-dir');
requireDir('./gulp/tasks', { recursive: true });


var gulp = require('gulp');
gulp.task('compile', ['coffee', 'webpack']);

gulp.task('watch', ['webpack'], function() {
  gulp.watch('src/**/*.coffee', ['coffee']);
  gulp.watch('temp/**/*.js', ['webpack']);
  gulp.watch('src/**/*.html', ['copy']);
  gulp.task('default', ['webpack', 'copy']);
});
