'use strict'
var gulp = require('gulp');
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
function rollupTestTask(name, input, file) {
    return rollup.rollup({
        input,
        external: ['assert', 'react', 'react-dom', 'react-dom/test-utils', 'jsdom' , 'tslib'],
        plugins: [
            rollupTypescript({
                typescript: typescript,
                baseUrl: '.',
                paths: {
                    navigation: ['Navigation/src/Navigation'],
                    'navigation-react': ['NavigationReact/src/NavigationReact']
                },
                importHelpers: true,
                target: 'es3',
                module: 'es6',
                jsx: 'react'
            })
        ]
    }).then((bundle) => (
        bundle.write({
            format: 'cjs',
            file
        })
    ));
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
    Object.assign({ globals: { navigation: 'Navigation', react: 'React',
            'react-dom': 'ReactDOM' } }, 
        require('./build/npm/navigation-react/package.json'),
        require('./NavigationReact/src/tsconfig.json')),
    Object.assign({ globals: { knockout: 'ko' } },
        require('./build/npm/navigation-knockout/package.json')),
    Object.assign({ globals: { angular: 'angular' } },
        require('./build/npm/navigation-angular/package.json')),
    Object.assign({ globals: { '@cycle/dom': 'CycleDOM', rx: 'Rx' } },
        require('./build/npm/navigation-cycle/package.json')),
    Object.assign({ globals: { navigation: 'Navigation',
            'navigation-react': 'NavigationReact', react: 'React' } },
        require('./build/npm/navigation-react-mobile/package.json'),
        require('./NavigationReactMobile/src/tsconfig.json')),
    Object.assign({ globals: { react: 'React', 'react-native': 'ReactNative',
            'd3-interpolate': 'd3', 'd3-ease': 'd3' } },
        require('./build/npm/navigation-react-native/package.json'),
        require('./NavigationReactNative/src/tsconfig.json')),
];
function rollupTask(name, input, file, globals, format) {
    return rollup.rollup({
        input,
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
    }).then((bundle) => (
        bundle.write({
            format,
            name,
            globals,
            file
        })
    ));        
}
function buildTask(file, details) {
    var info = `/**
 * ${details.name} v${details.version}
 * (c) Graham Mendick - ${details.homepage}
 * License: ${details.license}
 */
`;
    return gulp.src(file)
        .pipe(strip())
        .pipe(insert.prepend(info))
        .pipe(gulp.dest('./build/dist'))
        .pipe(rename(file.replace(/js$/, 'min.js')))
        .pipe(uglify())
        .pipe(insert.prepend(info))
        .pipe(gulp.dest('.'));
}
var itemTasks = items.reduce((tasks, item) => {
    var packageName = item.name;
    var upperName = packageName.replace(/\b./g, (val) => val.toUpperCase());
    var name = upperName.replace(/-/g, '');
    var tsFrom = './' + name + '/src/' + name + '.ts';
    var jsTo = './build/dist/' + packageName.replace(/-/g, '.') + '.js';
    var jsPackageTo = './build/npm/' + packageName + '/' + packageName.replace(/-/g, '.') + '.js';
    item.name = upperName.replace(/-/g, ' ');
    gulp.task('Rollup' + name, () => rollupTask(name, tsFrom, jsTo, item.globals || {}, 'iife'));
    gulp.task('Build' + name, ['Rollup' + name], () => buildTask(jsTo, item));
    gulp.task('Package' + name, () => rollupTask(name, tsFrom, jsPackageTo, item.globals || {}, 'cjs'));
    tasks.buildTasks.push('Build' + name);
    tasks.packageTasks.push('Package' + name);
    return tasks;
}, { buildTasks: [], packageTasks: [] });
gulp.task('build', itemTasks.buildTasks);
gulp.task('package', itemTasks.packageTasks);
