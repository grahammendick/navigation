'use strict'
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var header = require('gulp-header');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var typescript = require('gulp-tsc');
var uglify = require('gulp-uglify');
var rollup = require('rollup');
var rollupTypescript = require('rollup-plugin-typescript');

var tests = [
    { name: 'NavigationRouting', to: 'navigationRouting.test.js' },
    { name: 'StateConfig', to: 'stateConfig.test.js' },
    { name: 'Navigation', to: 'navigation.test.js' },
    { name: 'NavigationData', to: 'navigationData.test.js' },
    { name: 'NavigationLink', to: 'navigationLink.test.js', folder: 'React', ext: 'tsx' },
    { name: 'NavigationBackLink', to: 'navigationBackLink.test.js', folder: 'React', ext: 'tsx' },
    { name: 'RefreshLink', to: 'refreshLink.test.js', folder: 'React', ext: 'tsx' }
];
var testTasks = [];
function rollupTestTask(name, file, to) {
    return rollup.rollup({
        entry: file,
        external: ['assert', 'react', 'react-addons-test-utils'],
        plugins: [
            rollupTypescript({
                typescript: require('typescript'),
                jsx: 'react'
            })
        ]
    }).then((bundle) => {
        bundle.write({
            format: 'cjs',
            dest: to
        });
    });
}
function testTask(file) {
    return gulp.src(file)
        .pipe(mocha({ reporter: 'progress' }));
}
for (var i = 0; i < tests.length; i++) {
    let test = tests[i]; 
    let folder = './Navigation' + (test.folder || '') + '/test/';
    let file = folder + test.name + 'Test.' + (test.ext || 'ts');
    let to = './build/dist/' + test.to;
    gulp.task('RollupTest' + test.name, () => rollupTestTask(test.name, file, to));
    gulp.task('Test' + test.name, ['RollupTest' + test.name], () => testTask(to));
    testTasks.push('Test' + test.name);
}
gulp.task('test', testTasks);

var items = [
    require('./build/npm/navigation/package.json'),
    require('./build/npm/navigation-react/package.json'),
    require('./build/npm/navigation-knockout/package.json'),
    require('./build/npm/navigation-angular/package.json'),
    require('./build/npm/navigation-cycle/package.json'),
    require('./build/npm/navigation-inferno/package.json')
];
var buildTasks = [];
var packageTasks = [];
var info = ['/**',
  ' * <%= details.name %> v<%= details.version %>',
  ' * (c) Graham Mendick - <%= details.homepage %>',
  ' * License: <%= details.license %>',
  ' */',
  ''].join('\r\n');
function rollupTask(name, file, to) {
    return rollup.rollup({
        entry: file,
        plugins: [
            rollupTypescript({
                typescript: require('typescript'),
                target: 'es3',
                module: 'es6'
            })
        ]
    }).then((bundle) => {
        bundle.write({
            format: 'iife',
            moduleName: name,
            globals: {
                navigation: 'Navigation',
                angular: 'angular',
                knockout: 'ko',
                react: 'React',
                '@cycle/dom': 'CycleDOM',
                rx: 'Rx',
                'inferno-component': 'InfernoComponent',
                'inferno-create-element': 'InfernoCreateElement'
            },
            dest: './build/dist/' + to
        });
    });        
}
function buildTask(file, details) {
    return gulp.src('./build/dist/' + file)
        .pipe(buffer())
        .pipe(header(info, { details : details } ))
        .pipe(gulp.dest('./build/dist'))
        .pipe(rename(file.replace(/js$/, 'min.js')))
        .pipe(uglify())
        .pipe(buffer())
        .pipe(header(info, { details : details } ))
        .pipe(gulp.dest('./build/dist'));
}
function packageTask(name, file) {
    return gulp.src(file)
        .pipe(typescript())
        .pipe(gulp.dest('./build/npm/' + name + '/lib'));
}
for (var i = 0; i < items.length; i++) {
    let item = items[i];
    let packageName = item.name;
    let upperName = packageName.replace(/\b./g, (val) => val.toUpperCase());
    let name = upperName.replace('-', '');
    let tsFrom = './' + name + '/src/' + name + '.ts';
    let jsTo = packageName.replace('-', '.') + '.js';
    item.name = upperName.replace('-', ' ');
    gulp.task('Rollup' + name, () => rollupTask(name, tsFrom, jsTo));
    gulp.task('Build' + name, ['Rollup' + name], () => buildTask(jsTo, item));
    gulp.task('Package' + name, () => packageTask(packageName, tsFrom));
    buildTasks.push('Build' + name);
    packageTasks.push('Package' + name);
}
gulp.task('build', buildTasks);
gulp.task('package', packageTasks);
