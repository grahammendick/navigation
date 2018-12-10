'use strict'
var cleanup = require('rollup-plugin-cleanup');
var gulp = require('gulp');
var insert = require('gulp-insert');
var mocha = require('gulp-mocha');
var nodeResolve = require('rollup-plugin-node-resolve');
var rename = require('gulp-rename');
var rollup = require('rollup');
var rollupTypescript = require('rollup-plugin-typescript');
var typescript = require('typescript');
var uglify = require('gulp-uglify');

var items = [
    require('./build/npm/navigation/package.json'),
    Object.assign({ globals: { navigation: 'Navigation', react: 'React',
            'react-dom': 'ReactDOM' } }, 
        require('./build/npm/navigation-react/package.json')),
    Object.assign({ globals: { knockout: 'ko' } },
        require('./build/npm/navigation-knockout/package.json')),
    Object.assign({ globals: { angular: 'angular' }, reserved: ['$parse'] },
        require('./build/npm/navigation-angular/package.json')),
    Object.assign({ globals: { '@cycle/dom': 'CycleDOM', rx: 'Rx' } },
        require('./build/npm/navigation-cycle/package.json')),
    Object.assign({ globals: { navigation: 'Navigation',
            'navigation-react': 'NavigationReact', react: 'React' } },
        require('./build/npm/navigation-react-mobile/package.json')),
    Object.assign({ globals: { navigation: 'Navigation', react: 'React',
            'navigation-react': 'NavigationReact', 'react-native': 'ReactNative' },
            format: 'es' },
        require('./build/npm/navigation-react-native/package.json')),
];
function rollupTask(name, input, file, globals, format) {
    return rollup.rollup({
        input,
        external: Array.isArray(globals) ? globals : Object.keys(globals),
        plugins: [
            rollupTypescript({
                typescript: typescript,
                importHelpers: true,
                target: 'es3',
                module: 'es6',
                jsx: 'react'
            }),
            nodeResolve({ jsnext: true, main: true }),
            cleanup()
        ]
    }).then((bundle) => bundle.write({ format, name, globals, file }));
}
function buildTask(name, input, file, globals, details) {
    var info = `/**
 * ${details.name} v${details.version}
 * (c) Graham Mendick - ${details.homepage}
 * License: ${details.license}
 */
`;
    return rollupTask(name, input, file, globals, 'iife')
        .then(() => (
            gulp.src(file)
                .pipe(insert.prepend(info))
                .pipe(gulp.dest('./build/dist'))
                .pipe(rename(file.replace(/js$/, 'min.js')))
                .pipe(uglify({ mangle: { reserved: details.reserved } }))
                .pipe(insert.prepend(info))
                .pipe(gulp.dest('.'))
        ));
}
var native = () => {
    var nativeFolders = ['android', 'ios']
        .map(folder => `./NavigationReactNative/src/${folder}/**/*`);
    return gulp.src(nativeFolders, {base: './NavigationReactNative/src'})
        .pipe(gulp.dest('./build/npm/navigation-react-native'));
};
var itemTasks = items.reduce((tasks, item) => {
    var packageName = item.name;
    var upperName = packageName.replace(/\b./g, (val) => val.toUpperCase());
    var name = upperName.replace(/-/g, '');
    var tsFrom = './' + name + '/src/' + name + '.ts';
    var jsTo = './build/dist/' + packageName.replace(/-/g, '.') + '.js';
    var jsPackageTo = './build/npm/' + packageName + '/' + packageName.replace(/-/g, '.') + '.js';
    item.name = upperName.replace(/-/g, ' ');
    var { globals = {}, format = 'cjs' } = item;
    //gulp.task('Build' + name, () => buildTask(name, tsFrom, jsTo, globals, item));
    //gulp.task('Package' + name, ['Native'], () => rollupTask(name, tsFrom, jsPackageTo, globals, format));
    var task = () => buildTask(name, tsFrom, jsTo, globals, item);
    task.displayName = 'build' + name;
    tasks.buildTasks.push(task);
    task = () => rollupTask(name, tsFrom, jsPackageTo, globals, format);
    task.displayName = 'package' + name;
    tasks.packageTasks.push(task);
    //tasks.packageTasks.push(() => rollupTask(name, tsFrom, jsPackageTo, globals, format));
    return tasks;
}, { buildTasks: [], packageTasks: [] });
exports.build = gulp.parallel(...itemTasks.buildTasks);
exports.package = gulp.parallel(native, ...itemTasks.packageTasks);
////gulp.task('build', itemTasks.buildTasks);
//gulp.task('package', itemTasks.packageTasks);

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
function testTask(name, input, file) {
    var globals = [
        'assert', 'react', 'react-dom', 'react-dom/test-utils',
        'jsdom', 'tslib', 'navigation', 'navigation-react'
    ];
    return rollupTask(name, input, file, globals, 'cjs')
        .then(() => gulp.src(file).pipe(mocha({ reporter: 'progress' })));
}
var testTasks = tests.reduce((tasks, test) => {
    var folder = './Navigation' + (test.folder || '') + '/test/';
    var file = folder + test.name + 'Test.' + (test.ext || 'ts');
    var to = './build/dist/' + test.to;
    var packageDeps = ['PackageNavigation', 'PackageNavigationReact'];
    //gulp.task('Test' + test.name, packageDeps, () => testTask(test.name, file, to));
    var task = () => testTask(test.name, file, to);
    task.displayName = 'test' + test.name;
    tasks.push(task);
    return tasks;
}, []);
var testPackages = gulp.parallel(
    itemTasks.packageTasks.find(task => task.displayName === 'packageNavigation'),
    itemTasks.packageTasks.find(task => task.displayName === 'packageNavigationReact')
);
exports.test = gulp.series(testPackages, gulp.parallel(...testTasks));
//gulp.task('test', testTasks);

