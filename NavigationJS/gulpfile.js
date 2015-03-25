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

function build(name, from, to) {
	browserify(from, { standalone: name })
		.plugin('tsify')
		.bundle()
		.pipe(source(to))
		.pipe(rename(to))
		.pipe(derequire())
		//.pipe(streamify(uglify()))
		.pipe(gulp.dest('./build'))
}

var items = [
	{ name: 'Navigation', from: './src/Navigation.ts', to: 'navigation.js' },
	{ name: 'NavigationReact', from: './src/react/NavigationReact.ts', to: 'navigation.react.js' },
	{ name: 'NavigationKnockout', from: './src/knockout/NavigationKnockout.ts', to: 'navigation.knockout.js' }
];
var tasks = ['test'];

for (var i = 0; i < items.length; i++) {
	(function (item) {
		gulp.task(item.name, function () {
			build(item.name, item.from, item.to)
		});
	})(items[i]);
	tasks.push(items[i].name);
}

gulp.task('build', tasks);