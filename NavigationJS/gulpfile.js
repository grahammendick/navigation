var browserify = require('browserify');
var gulp = require('gulp');
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
	{ name: 'NavigationDataTest', from: './test/NavigationDataTest.ts', to: 'navigationData.test.js' },
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

var buildTasks = [];
var builds = [
	{ name: 'Navigation', from: './src/Navigation.ts', to: 'navigation.js' },
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
for (var i = 0; i < builds.length; i++) {
	(function (build) {
		gulp.task(build.name, function () {
			return buildTask(build.name, build.from, build.to)
		});
	})(builds[i]);
	buildTasks.push(builds[i].name);
}
gulp.task('build', buildTasks);
