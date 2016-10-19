'use strict'
var gulp = require('gulp');
var gulpTypescript = require('gulp-tsc');
var header = require('gulp-header');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var rollup = require('rollup');
var rollupTypescript = require('rollup-plugin-typescript');
var uglify = require('gulp-uglify');

var tests = [
    { name: 'NavigationRouting', to: 'navigationRouting.test.js' },
    { name: 'StateConfig', to: 'stateConfig.test.js' },
    { name: 'Navigation', to: 'navigation.test.js' },
    { name: 'NavigationData', to: 'navigationData.test.js' },
    { name: 'NavigationLink', to: 'navigationLink.test.js', folder: 'React', ext: 'tsx' },
    { name: 'NavigationBackLink', to: 'navigationBackLink.test.js', folder: 'React', ext: 'tsx' },
    { name: 'RefreshLink', to: 'refreshLink.test.js', folder: 'React', ext: 'tsx' }
];
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
var testTasks = tests.reduce((tasks, test) => {
    var folder = './Navigation' + (test.folder || '') + '/test/';
    var file = folder + test.name + 'Test.' + (test.ext || 'ts');
    var to = './build/dist/' + test.to;
    gulp.task('RollupTest' + test.name, () => rollupTestTask(test.name, file, to));
    gulp.task('Test' + test.name, ['RollupTest' + test.name], () => testTask(to));
    tasks.push('Test' + test.name);
    return tasks;
}, []);
gulp.task('test', testTasks);

var items = [
    require('./build/npm/navigation/package.json'),
    require('./build/npm/navigation-react/package.json'),
    require('./build/npm/navigation-knockout/package.json'),
    require('./build/npm/navigation-angular/package.json'),
    require('./build/npm/navigation-cycle/package.json'),
    require('./build/npm/navigation-inferno/package.json')
];
var info = ['/**',
  ' * <%= details.name %> v<%= details.version %>',
  ' * (c) Graham Mendick - <%= details.homepage %>',
  ' * License: <%= details.license %>',
  ' */',
  ''].join('\r\n');
function rollupTask(name, file, to) {
    return rollup.rollup({
        entry: file,
        external: ['knockout', 'react'],
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
        .pipe(header(info, { details : details } ))
        .pipe(gulp.dest('./build/dist'))
        .pipe(rename(file.replace(/js$/, 'min.js')))
        .pipe(uglify())
        .pipe(header(info, { details : details } ))
        .pipe(gulp.dest('./build/dist'));
}
function packageTask(name, file) {
    return gulp.src(file)
        .pipe(gulpTypescript())
        .pipe(gulp.dest('./build/npm/' + name + '/lib'));
}
var itemTasks = items.reduce((tasks, item) => {
    var packageName = item.name;
    var upperName = packageName.replace(/\b./g, (val) => val.toUpperCase());
    var name = upperName.replace('-', '');
    var tsFrom = './' + name + '/src/' + name + '.ts';
    var jsTo = packageName.replace('-', '.') + '.js';
    item.name = upperName.replace('-', ' ');
    gulp.task('Rollup' + name, () => rollupTask(name, tsFrom, jsTo));
    gulp.task('Build' + name, ['Rollup' + name], () => buildTask(jsTo, item));
    gulp.task('Package' + name, () => packageTask(packageName, tsFrom));
    tasks.buildTasks.push('Build' + name);
    tasks.packageTasks.push('Package' + name);
    return tasks;
}, { buildTasks: [], packageTasks: [] });
gulp.task('build', itemTasks.buildTasks);
gulp.task('package', itemTasks.packageTasks);
