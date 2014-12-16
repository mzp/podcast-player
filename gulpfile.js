var requireDir = require('require-dir');
requireDir('./gulp/tasks', { recursive: true });


var gulp = require('gulp');
gulp.task('compile', ['coffee', 'webpack']);


