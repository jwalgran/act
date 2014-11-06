var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var livereload = require('gulp-livereload');
var del = require('del');

gulp.task('default', ['build']);

gulp.task('build', ['browserify', 'static']);

gulp.task('clean', function (cb) {
    del(['dist/**'], cb);
});

gulp.task('browserify', function() {
    var b = browserify();
    b.transform(reactify);
    b.add('./src/main.js');
    return b.bundle()
             // Using vinyl-source-stream to make the
             // stream gulp compatible.
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./dist'));
});

var staticMarkupGlob = './src/*.html';
var staticCssGlob = './src/css/**/*';
var jsSrcGlobs = [
    './src/**/*.js',
    './src/**/*.jsx'
];

gulp.task('static', function () {
    gulp.src(staticMarkupGlob)
        .pipe(gulp.dest('./dist'));

    gulp.src(staticCssGlob)
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function() {
    gulp.watch(staticMarkupGlob, ['static']);
    gulp.watch(jsSrcGlobs, ['browserify']);
});

gulp.task('serve', function() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static('./dist'));
    app.listen(4000);
    process.stdout.write('Serving ./dist at http://localhost:4000\n');
});

gulp.task('live', ['build', 'watch', 'serve'], function() {
    livereload.listen();
    gulp.watch('dist/**').on('change', livereload.changed);
});
