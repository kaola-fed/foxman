const gulp = require('gulp');
const clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src('dist').pipe(clean());
});

gulp.task('default', ['clean'], function () {
    return gulp.src([
        'src/**/crt/**',
        'src/**/client/**',
    ])
        .pipe(gulp.dest('dist'));
});