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

function build(from, to, name) {
	browserify(from, { standalone: name })
		.plugin('tsify')
		.bundle()
		.pipe(source(to))
		.pipe(rename(to))
		.pipe(derequire())
		//.pipe(streamify(uglify()))
		.pipe(gulp.dest('./build'))
}

gulp.task('navigation', function () {
	build('./src/Navigation.ts', 'navigation.js', 'Navigation')
});

gulp.task('navigationReact', function () {
	build('./src/react/NavigationReact.ts', 'navigation.react.js', 'NavigationReact')
});

gulp.task('navigationKnockout', function () {
	build('./src/knockout/NavigationKnockout.ts', 'navigation.knockout.js', 'NavigationKnockout')
});

gulp.task('build', ['test', 'navigation', 'navigationReact', 'navigationKnockout']);