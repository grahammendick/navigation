var browserify = require('browserify');
var gulp = require('gulp');
var rename = require('gulp-rename');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');

gulp.task('build', function () {
	//var b = browserify();
	//b.add('./src/Navigation.js', {standalone : 'Navigation'});
	var bundleStream = browserify('./src/Navigation.js', { standalone: 'Navigation' }).bundle()

	bundleStream
	  .pipe(source('navigation.js'))
	  //.pipe(streamify(uglify()))
	  .pipe(rename('navigation.js'))
	  .pipe(gulp.dest('./build'))
})