'use strict'
var gulp = require('gulp');
var gulpTypescript = require('gulp-tsc');
var insert = require('gulp-insert');
var mocha = require('gulp-mocha');
var nodeResolve = require('rollup-plugin-node-resolve');
var rename = require('gulp-rename');
var rollup = require('rollup');
var rollupTypescript = require('rollup-plugin-typescript');
var strip = require('gulp-strip-comments');
var typescript = require('typescript');
var uglify = require('gulp-uglify');

var tests = [
    { name: 'NavigationRouting', to: 'navigationRouting.test.js' },
    { name: 'StateConfig', to: 'stateConfig.test.js' },
    { name: 'Navigation', to: 'navigation.test.js' },
    { name: 'NavigationData', to: 'navigationData.test.js' },
    { name: 'FluentNavigation', to: 'fluentNavigation.test.js' },
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
                typescript: typescript,
                importHelpers: true,
                target: 'es3',
                module: 'es6',
                jsx: 'react'
            }),
            nodeResolve({ jsnext: true, main: true })
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
    Object.assign({ globals: { react: 'React' } }, 
        require('./build/npm/navigation-react/package.json')),
    Object.assign({ globals: { knockout: 'ko' } },
        require('./build/npm/navigation-knockout/package.json')),
    Object.assign({ globals: { angular: 'angular' } },
        require('./build/npm/navigation-angular/package.json')),
    Object.assign({ globals: { '@cycle/dom': 'CycleDOM', rx: 'Rx' } },
        require('./build/npm/navigation-cycle/package.json')),
    Object.assign({ globals: { 'inferno-component': 'InfernoComponent',
            'inferno-create-element': 'InfernoCreateElement' } },
        require('./build/npm/navigation-inferno/package.json')),
    Object.assign({ globals: { react: 'React', 
            'd3-interpolate': 'd3', 'd3-ease': 'd3' } },
        require('./build/npm/navigation-react-mobile/package.json'),
        require('./NavigationReactMobile/src/tsconfig.json')),
    Object.assign({ globals: { react: 'React', 'react-native': 'ReactNative',
            'd3-interpolate': 'd3', 'd3-ease': 'd3' } },
        require('./build/npm/navigation-react-native/package.json'),
        require('./NavigationReactNative/src/tsconfig.json')),
];
function rollupTask(name, file, to, globals) {
    return rollup.rollup({
        entry: file,
        external: Object.keys(globals),
        plugins: [
            rollupTypescript({
                typescript: typescript,
                importHelpers: true,
                target: 'es3',
                module: 'es6',
                jsx: 'react'
            }),
            nodeResolve({ jsnext: true, main: true })
        ]
    }).then((bundle) => {
        bundle.write({
            format: 'iife',
            moduleName: name,
            globals: Object.assign({ navigation: 'Navigation'}, globals),
            dest: './build/dist/' + to
        });
    });        
}
function buildTask(file, details) {
    var info = `/**
 * ${details.name} v${details.version}
 * (c) Graham Mendick - ${details.homepage}
 * License: ${details.license}
 */
`;
    return gulp.src('./build/dist/' + file)
        .pipe(strip())
        .pipe(insert.prepend(info))
        .pipe(gulp.dest('./build/dist'))
        .pipe(rename(file.replace(/js$/, 'min.js')))
        .pipe(uglify())
        .pipe(insert.prepend(info))
        .pipe(gulp.dest('./build/dist'));
}
function packageTask(name, file, details) {
    return gulp.src(file)
        .pipe(gulpTypescript(details.compilerOptions))
        .pipe(gulp.dest('./build/npm/' + name + '/lib'));
}
var itemTasks = items.reduce((tasks, item) => {
    var packageName = item.name;
    var upperName = packageName.replace(/\b./g, (val) => val.toUpperCase());
    var name = upperName.replace(/-/g, '');
    var tsFrom = './' + name + '/src/' + name + '.ts';
    var jsTo = packageName.replace(/-/g, '.') + '.js';
    item.name = upperName.replace(/-/g, ' ');
    gulp.task('Rollup' + name, () => rollupTask(name, tsFrom, jsTo, item.globals || {}));
    gulp.task('Build' + name, ['Rollup' + name], () => buildTask(jsTo, item));
    gulp.task('Package' + name, () => packageTask(packageName, tsFrom, item));
    tasks.buildTasks.push('Build' + name);
    tasks.packageTasks.push('Package' + name);
    return tasks;
}, { buildTasks: [], packageTasks: [] });
gulp.task('build', itemTasks.buildTasks);
gulp.task('package', itemTasks.packageTasks);
