var browserify = require('browserify');
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');

gulp.task('build', function(){
	return browserify('./NavigateClient.js', { standalone: 'NavigateClient' })
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('./'))
})