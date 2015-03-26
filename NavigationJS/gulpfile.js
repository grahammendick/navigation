var browserify = require('browserify');
var gulp = require('gulp');
var concat = require('gulp-concat');
var derequire = require('gulp-derequire');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

var testTasks = [];
var tests = [
	{ name: 'NavigationRoutingTest', from: './test/NavigationRoutingTest.ts', to: 'navigationRouting.test.js' },
	{ name: 'StateInfoTest', from: './test/StateInfoTest.ts', to: 'stateInfo.test.js' },
	{ name: 'NavigationTest', from: './test/NavigationTest.ts', to: 'navigation.test.js' },
	{ name: 'NavigationDataTest', from: './test/NavigationDataTest.ts', to: 'navigationData.test.js' }
];
function testTask(from, to) {
	return browserify(from)
		.plugin('tsify')
		.bundle()
		.pipe(source(to))
		.pipe(rename(to))
		.pipe(gulp.dest('./build'))
        .pipe(mocha({ reporter: 'nyan' }));
}
for (var i = 0; i < tests.length; i++) {
	(function (test) {
		gulp.task(test.name, function () {
			return testTask(test.from, test.to)
		});
	})(tests[i]);
	testTasks.push(tests[i].name);
}
gulp.task('test', testTasks);

gulp.task('Navigation', function () {
	return buildTask('Navigation', './src/Navigation.ts', 'navigation.js')
});
var buildTasks = ['Navigation'];
var plugins = [
	{ name: 'NavigationReact', from: './src/react/NavigationReact.ts', to: 'navigation.react.js' },
	{ name: 'NavigationKnockout', from: './src/knockout/NavigationKnockout.ts', to: 'navigation.knockout.js' }
];
function buildTask(name, from, to) {
	return browserify(from, { standalone: name })
		.plugin('tsify')
		.bundle()
		.pipe(source(to))
		.pipe(rename(to))
		.pipe(derequire())
		//.pipe(streamify(uglify()))
		.pipe(gulp.dest('./build'))
}
for (var i = 0; i < plugins.length; i++) {
	(function (plugin) {
		gulp.task(plugin.name, ['Navigation'], function () {
			return buildTask(plugin.name, plugin.from, plugin.to)
		});
	})(plugins[i]);
	buildTasks.push(plugins[i].name);
}
for (var i = 0; i < plugins.length; i++) {
	(function (plugin) {
		gulp.task(plugin.name + 'concat', [plugin.name], function () {
			return gulp.src(['./build/navigation.js', './build/' + plugin.to])
				.pipe(concat(plugin.to))
				.pipe(gulp.dest('./build'))
		});
	})(plugins[i]);
	buildTasks.push(plugins[i].name + 'concat');
}
gulp.task('build', buildTasks);
