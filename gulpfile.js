var browserify = require('browserify');
var shim = require('browserify-shim');
var gulp = require('gulp');
var concat = require('gulp-concat');
var derequire = require('gulp-derequire');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var typescript = require('gulp-tsc');
var uglify = require('gulp-uglify');

var tests = [
	{ name: 'NavigationRouting', to: 'navigationRouting.test.js' },
	{ name: 'StateInfo', to: 'stateInfo.test.js' },
	{ name: 'Navigation', to: 'navigation.test.js' },
	{ name: 'NavigationData', to: 'navigationData.test.js' }
];
var plugins = [
	{ name: 'NavigationReact', to: 'navigation.react.js' },
	{ name: 'NavigationKnockout', to: 'navigation.knockout.js' },
	{ name: 'NavigationAngular', to: 'navigation.angular.js' }
];
var testTasks = [];
function testTask(from, to) {
	return browserify(from)
		.plugin('tsify')
		.bundle()
		.pipe(source(to))
		.pipe(rename(to))
		.pipe(gulp.dest('./build/dist'))
        .pipe(mocha());
}
for (var i = 0; i < tests.length; i++) {
	(function (test) {
		gulp.task('Test' + test.name, function () {
			return testTask('./NavigationJS/test/' + test.name + 'Test.ts', test.to)
		});
	})(tests[i]);
	testTasks.push('Test' + tests[i].name);
}
gulp.task('test', testTasks);

var buildTasks = ['BuildNavigation'];
var packageTasks = ['PackageNavigation'];
gulp.task('BuildNavigation', function () {
	return buildTask('Navigation', './NavigationJS/src/Navigation.ts', 'navigation.js');
});
gulp.task('PackageNavigation', function () {
	return packageTask('Navigation', './NavigationJS/src/Navigation.ts');
})
function buildTask(name, from, to) {
	return browserify(from, { standalone: name })
		.plugin('tsify')
		.transform(shim)
		.bundle()
		.pipe(source(to))
		.pipe(rename(to))
		.pipe(derequire())
		.pipe(gulp.dest('./build/dist'))
		.pipe(rename(to.replace(/js$/, 'min.js')))
		.pipe(streamify(uglify()))
		.pipe(gulp.dest('./build/dist'));
}
function packageTask(name, from) {
	return gulp.src(from)
		.pipe(typescript())
		.pipe(gulp.dest('./build/lib/' + name));
}

for (var i = 0; i < plugins.length; i++) {
	(function (plugin) {
		var from = './' + plugin.name + '/src/' + plugin.name + '.ts';
		gulp.task('Build' + plugin.name, function () {
			return buildTask(plugin.name, from, plugin.to);
		});
		gulp.task('Package' + plugin.name, function () {
			return packageTask(plugin.name, from);
		});
	})(plugins[i]);
	buildTasks.push('Build' + plugins[i].name);
	packageTasks.push('Package' + plugins[i].name);
}
gulp.task('build', buildTasks);
gulp.task('package', packageTasks);
