module NavigationTest {
    export class StateHandler extends Navigation.StateHandler {
        getNavigationLink(state: Navigation.State, data: any): string {
            var dataArray: Array<string> = [];
            for (var key in data) {
                dataArray.push(key + '=' + data[key]);
            }
            return dataArray.join('&');
        }

        navigateLink(state: Navigation.State, url: string) {
            var data = {};
            var dataArray = url ? url.split('&') : [];
            var keyValue: Array<string>;
            for (var i = 0; i < dataArray.length; i++) {
                keyValue = dataArray[i].split('=');
                data[keyValue[0]] = keyValue[1];
            }
            Navigation.StateController.setStateContext(state, data);
        }

        getNavigationData(state: Navigation.State, data: any): any {
            return data;
        }
    }

    Navigation.StateInfoConfig.build([
        { key: 'd0', initial: 's0', title: 'd0', states: [
            { key: 's0', route: 'r0', title: 's0', transitions: [
                { key: 't0', to: 's1' },
                { key: 't1', to: 's2' },
                { key: 't2', to: 's3' },
                { key: 't3', to: 's4' }]},
            { key: 's1', route: 'r1', title: 's1', transitions: [
                { key: 't0', to: 's2' },
                { key: 't1', to: 's3' },
                { key: 't2', to: 's4' }]},
            { key: 's2', route: 'r2', title: 's2', transitions: [
                { key: 't0', to: 's3' },
                { key: 't1', to: 's4' }]},
            { key: 's3', route: 'r3', title: 's3', transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'r4', title: 's4'}
        ]},
        { key: 'd1', initial: 's0', title: 'd1', states: [
            { key: 's0', route: 'r0', title: 's0', transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'r1', title: 's1', transitions: [
                { key: 't0', to: 's2' }]},
            { key: 's2', route: 'r2', title: 's2', transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'r3', title: 's3', transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'r4', title: 's4', transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'r5', title: 's5', transitions: [
                { key: 't0', to: 's0' },
                { key: 't1', to: 's1' },
                { key: 't2', to: 's2' },
                { key: 't3', to: 's3' },
                { key: 't4', to: 's4' }]}
        ]},
        { key: 'd2', initial: 's0', title: 'd2', states: [
            { key: 's0', route: 'r0', title: 's0', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'r1', title: 's1', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's2' }]},
            { key: 's2', route: 'r2', title: 's2', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'r3', title: 's3', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'r4', title: 's4', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'r5', title: 's5', transitions: [
                { key: 't0', to: 's6' }]},
            { key: 's6', route: 'r6', title: 's6', transitions: [
                { key: 't0', to: 's0' }]}
        ]}
    ]);
    for (var dialogKey in Navigation.StateInfoConfig._dialogs) {
        var dialog = Navigation.StateInfoConfig._dialogs[dialogKey];
        for (var stateKey in dialog._states) {
            dialog._states[stateKey].stateHandler = new StateHandler();
        }
    }

    QUnit.module('NavigationTest', {
    });

    QUnit.test('NavigateDialogTest', function (assert) {
        Navigation.StateController.navigate('d0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d0'].initial);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateInvalidDialogTest', function (assert) {
        assert.throws(() => Navigation.StateController.navigate('d9'));
    });

    QUnit.test('NavigateCrossDialogTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d1');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d1'].initial);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs['d0']._states['s1']);
        assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig._dialogs['d0']);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d1']._states['s0']);
        assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs['d1']);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateCrossDialogWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d2');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d2'].initial);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d2']._states['s0']);
        assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs['d2']);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateDialogDialogTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('d0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d0'].initial);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.state);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateDialogDialogWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('d2');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d2'].initial);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateTransitionTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d0']._states['s1']);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.dialog.initial);
        assert.equal(Navigation.StateController.crumbs.length, 1);
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
        assert.ok(Navigation.StateController.crumbs[0].last);
    });

    QUnit.test('NavigateTransitionFromWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d2']._states['s1']);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.dialog.initial);
        assert.equal(Navigation.StateController.crumbs.length, 1);
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
        assert.ok(Navigation.StateController.crumbs[0].last);
    });

    QUnit.test('NavigateTransitionTransitionTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t1');
        Navigation.StateController.navigate('t1');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d0']._states['s4']);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs['d0']._states['s2']);
        assert.equal(Navigation.StateController.crumbs.length, 2);
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
        assert.equal(Navigation.StateController.crumbs[1].state, Navigation.StateContext.previousState);
        assert.ok(!Navigation.StateController.crumbs[0].last);
        assert.ok(Navigation.StateController.crumbs[1].last);
    });

    QUnit.test('NavigateTransitionTransitionToWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d2']._states['s2']);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('RefreshTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.refresh();
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs[0].states[1]);
    });

    QUnit.module('NavigationDataTest', {
    });

    QUnit.test('NavigateStringDataTest', function (assert) {
        Navigation.StateController.navigate('d0', { s: 'hello' });
        assert.equal(Navigation.StateContext.data.s, 'hello');
    });

    QUnit.test('NavigateNumberDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0', { n: 1 });
        assert.equal(Navigation.StateContext.data.n, 1);
    });

    QUnit.test('NavigateRefreshDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.refresh({ s: 'hello' });
        assert.equal(Navigation.StateContext.data.s, 'hello');
    });}
 