const gulp = require('gulp');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const rename = require("gulp-rename");

gulp.task('clean', function () {
    return gulp.src('dist').pipe(clean());
});

gulp.task('default', ['clean'], function () {
    return gulp.src('src/**/crt/**')
        .pipe(gulp.dest('dist'));
});