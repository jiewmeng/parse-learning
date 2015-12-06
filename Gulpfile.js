var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var babelify = require('babelify');
var gutil = require('gulp-util');

gulp.task('libs', function() {
  return browserify()
    .require('parse')
    .require('react')
    .require('react-dom')
    .require('parse-react')
    .require('validator')
    .bundle()
    .on('error', function(err) {
      console.error(err);
    })
    .pipe(source('libs.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

var recompile = function() {
  return w.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('public/js'));
};

var b = browserify('js_src/app.js', watchify.args);
b.transform('babelify', {
  presets: ['es2015', 'react']
});
b.exclude('parse');
b.exclude('react');
b.exclude('react-dom');
b.exclude('parse-react');
b.exclude('validator');

var w = watchify(b);
w.on('update', recompile);
w.on('log', gutil.log);

gulp.task('watch', recompile);

gulp.task('default', ['libs', 'watch']);
