var gulp = require('gulp');
var coffee = require('gulp-coffee')
gulp.task('coffee', function () {
  gulp.src('./src/js/**/*.coffee')
      .pipe(coffee())
      .pipe(gulp.dest('./temp'));
});

