const gulp = require('gulp');
const clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src([
        'dist',
        'src/**.js',
        'src/**.map',
        '!src/**/client/**',
    ]).pipe(clean());
});

gulp.task('default', ['clean'], function () {
    return gulp.src([
        'src/**/crt/**',
        'src/**/client/**',
        'src/**/views/**',
    ])
        .pipe(gulp.dest('dist'));
});