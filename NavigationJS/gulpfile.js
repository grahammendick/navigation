var browserify = require('browserify');
var gulp = require('gulp');
var derequire = require('gulp-derequire');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');


gulp.task('build', function () {
	browserify('./src/Navigation.js', { standalone: 'Navigation' })
		.bundle()
		.pipe(source('navigation.js'))
		//.pipe(streamify(uglify()))
		.pipe(rename('navigation.js'))
		.pipe(derequire())
		.pipe(gulp.dest('./build'))
})