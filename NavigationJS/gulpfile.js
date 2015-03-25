var browserify = require('browserify');
var gulp = require('gulp');
var derequire = require('gulp-derequire');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

gulp.task('test', function () {
	return gulp.src('./test/*.js', { read: false })
        .pipe(mocha({ reporter: 'nyan' }));
});

gulp.task('build', function () {
	browserify('./src/Navigation.ts', { standalone: 'Navigation' })
		.plugin('tsify')
		.bundle()
		.pipe(source('navigation.js'))
		.pipe(rename('navigation.js'))
		.pipe(derequire())
		//.pipe(streamify(uglify()))
		.pipe(gulp.dest('./build'))
})