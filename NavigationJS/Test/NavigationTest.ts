module NavigationTest {
    export class StateHandler extends Navigation.StateHandler {
        truncateCrumbTrail(state: Navigation.State, crumbs: Array<Navigation.Crumb>): Array<Navigation.Crumb> {
            var newCrumbs: Array<Navigation.Crumb> = [];
            var d6Crumbs: Array<Navigation.Crumb> = [];
            for (var i = 0; i < crumbs.length; i++) {
                if (crumbs[i].state.parent.key === 'd0')
                    newCrumbs.push(crumbs[i]);
                if (crumbs[i].state.parent.key === 'd6')
                    d6Crumbs.push(crumbs[i]);
            }
            newCrumbs = newCrumbs.concat(super.truncateCrumbTrail(state, d6Crumbs));
            return newCrumbs;
        }
    }

    Navigation.StateInfoConfig.build([
        { key: 'd0', initial: 's0', title: 'd0', states: [
            { key: 's0', route: 'd0s0/:s:', title: 's0', transitions: [
                { key: 't0', to: 's1' },
                { key: 't1', to: 's2' },
                { key: 't2', to: 's3' },
                { key: 't3', to: 's4' }]},
            { key: 's1', route: 'd0s1/:s:', title: 's1', transitions: [
                { key: 't0', to: 's2' },
                { key: 't1', to: 's3' },
                { key: 't2', to: 's4' }]},
            { key: 's2', route: 'd0s2/:s:', title: 's2', transitions: [
                { key: 't0', to: 's3' },
                { key: 't1', to: 's4' }]},
            { key: 's3', route: 'd0s3/:s:', title: 's3', transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd0s4/:s:', title: 's4'}
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
            { key: 's2', route: 'd2s2/:n:', title: 's2', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'r3', title: 's3', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'r4', title: 's4', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'r5', title: 's5', transitions: [
                { key: 't0', to: 's6' }]},
            { key: 's6', route: 'r6', title: 's6', transitions: [
                { key: 't0', to: 's0' }]}
        ]},
        { key: 'd6', initial: 's0', title: 'd6', states: [
            { key: 's0', route: 'r0', title: 's0', transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'r1', title: 's1'}
        ]}
    ]);

    (function () {
        var data;
        var crossroads = window['crossroads'];
        crossroads.ignoreState = true;
        var dialogs: any = Navigation.StateInfoConfig.dialogs;
        var d2s2 = dialogs.d2.states.s2;
        var d6s0 = dialogs.d6.states.s0;
        var d6s1 = dialogs.d6.states.s1;
        for (var key in dialogs.d0.states) {
            var state = dialogs.d0.states[key];
            state._route = crossroads.addRoute(state.route, function (s) {
                if (s) data = { s: s };
            });
        }
        d2s2._route = crossroads.addRoute(d2s2.route, function (n) {
            if (n) data = { n: n };
        });
        d6s0.stateHandler = new StateHandler();
        d6s1.stateHandler = new StateHandler();
        Navigation.router = {
            getData: (route: String) => {
                data = null;
                crossroads.parse(route);
                for (var k in data)
                    data[k] = decodeURIComponent(data[k]);
                return data;
            },
            getRoute: (state: Navigation.State, data: any) => {
                var encodedData = {};
                for (var k in data)
                    encodedData[k] = encodeURIComponent(data[k]);
                return state['_route'] ? state['_route'].interpolate(encodedData) : state.route;
            },
            ignoreDefaults: false
        };
    })();

    QUnit.module('NavigationTest', {
    });

    QUnit.test('NavigateDialogTest', function (assert) {
        Navigation.StateController.navigate('d0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].initial);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateInvalidDialogTest', function (assert) {
        assert.throws(() => Navigation.StateController.navigate('d9'));
    });

    QUnit.test('NavigateCrossDialogTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d1');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].initial);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d0']);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d1']);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateCrossDialogWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d2');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].initial);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s0']);
        assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d2']);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateDialogDialogTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('d0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].initial);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.state);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateDialogDialogWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('d2');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].initial);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateTransitionTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.dialog.initial);
        assert.equal(Navigation.StateController.crumbs.length, 1);
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
        assert.ok(Navigation.StateController.crumbs[0].last);
    });

    QUnit.test('NavigateTransitionFromWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s1']);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.dialog.initial);
        assert.equal(Navigation.StateController.crumbs.length, 1);
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
        assert.ok(Navigation.StateController.crumbs[0].last);
    });

    QUnit.test('NavigateTransitionTransitionTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t1');
        Navigation.StateController.navigate('t1');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s4']);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s2']);
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
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s2']);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateInvalidActionTest', function (assert) {
        Navigation.StateController.navigate('d1');
        assert.throws(() => Navigation.StateController.navigate('t1'));
    });

    QUnit.test('NavigateNullActionTest', function (assert) {
        Navigation.StateController.navigate('d1');
        assert.throws(() => Navigation.StateController.navigate(null));
    });

    QUnit.test('RefreshTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.refresh();
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.state);
        assert.equal(Navigation.StateController.crumbs.length, 1);
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
        assert.ok(Navigation.StateController.crumbs[0].last);
        assert.notEqual(Navigation.StateController.getRefreshLink(), null);
    });

    QUnit.test('RefreshWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.refresh();
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[2]._states[2]);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateController.crumbs.length, 0);
        assert.notEqual(Navigation.StateController.getRefreshLink(), null);
    });

    QUnit.test('NavigateBackOneTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t2');
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[3]);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateBackOneWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[2]._states[2]);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateBackTwoTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(2);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[2]);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[4]);
        assert.equal(Navigation.StateController.crumbs.length, 2);
        assert.ok(!Navigation.StateController.crumbs[0].last);
        assert.ok(Navigation.StateController.crumbs[1].last);
        for (var i = 0; i < Navigation.StateController.crumbs.length; i++) {
            assert.equal(Navigation.StateController.crumbs[i].state, Navigation.StateInfoConfig._dialogs[0]._states[i]);
        }
    });

    QUnit.test('NavigateBackTwoWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(2);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[2]._states[4]);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateBackOneByOneTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t1');
        Navigation.StateController.navigate('t1');
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
        assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]._states[0].parent);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.state._transitions[1].to);
        assert.equal(Navigation.StateContext.previousDialog, Navigation.StateContext.state._transitions[1].to.parent);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateBackOneByOneWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[2]._states[4]);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateCanNavigateBackTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t1');
        Navigation.StateController.navigate('t1');
        assert.ok(!Navigation.StateController.canNavigateBack(0));
        assert.ok(Navigation.StateController.canNavigateBack(1));
        assert.ok(Navigation.StateController.canNavigateBack(2));
        assert.ok(!Navigation.StateController.canNavigateBack(3));
    });

    QUnit.test('NavigateWithoutTrailCanNavigateBackTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.ok(!Navigation.StateController.canNavigateBack(0));
        assert.ok(!Navigation.StateController.canNavigateBack(1));
    });

    QUnit.test('NavigateBackInvalidTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.throws(() => Navigation.StateController.navigateBack(3));
    });

    QUnit.test('NavigateWithoutTrailBackInvalidTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.throws(() => Navigation.StateController.navigateBack(1));
    });

    QUnit.test('NavigateBackNavigateBackInvalidTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        try {
            Navigation.StateController.navigateBack(1);
        } catch (e) { }
        assert.throws(() => Navigation.StateController.navigateBack(2));
    });

    QUnit.test('NavigateBackNavigateBackWithoutTrailInvalidTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        try {
            Navigation.StateController.navigateBack(1);
        } catch (e) { }
        assert.throws(() => Navigation.StateController.navigateBack(1));
    });

    QUnit.test('NavigateBackRefreshTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t3');
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.refresh();
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0].initial);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.state);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateBackWithoutTrailRefreshTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.refresh();
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[2].initial);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateContext.previousDialog, null);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateBackRefreshTransitionTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t2');
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.refresh();
        Navigation.StateController.navigate('t1');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s3']);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(Navigation.StateController.crumbs.length, 2);
        assert.ok(!Navigation.StateController.crumbs[0].last);
        assert.ok(Navigation.StateController.crumbs[1].last);
        for (var i = 0; i < Navigation.StateController.crumbs.length; i++) {
            assert.equal(Navigation.StateController.crumbs[i].state, Navigation.StateInfoConfig._dialogs[0]._states[i]);
            assert.equal(Navigation.StateController.crumbs[i].title, Navigation.StateInfoConfig._dialogs[0]._states[i].title);
        }
    });

    QUnit.test('NavigateBackWithoutTrailRefreshTransitionTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.refresh();
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s3']);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d2'].states['s2']);
        assert.equal(Navigation.StateController.crumbs.length, 1);
        assert.ok(Navigation.StateController.crumbs[0].last);
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig._dialogs[2]._states[2]);
        assert.equal(Navigation.StateController.crumbs[0].title, Navigation.StateInfoConfig._dialogs[2]._states[2].title);
    });

    QUnit.test('NavigateTransitionWithoutTrailTransitionTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s3']);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d2'].states['s2']);
        assert.equal(Navigation.StateController.crumbs.length, 1);
        assert.ok(Navigation.StateController.crumbs[0].last);
    });

    QUnit.test('NavigateCrumbTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(Navigation.StateController.crumbs[1].state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(Navigation.StateController.crumbs[2].state, Navigation.StateInfoConfig.dialogs['d0'].states['s2']);
        assert.equal(Navigation.StateController.crumbs[3].state, Navigation.StateInfoConfig.dialogs['d0'].states['s3']);
        assert.equal(Navigation.StateController.crumbs.length, 4);
        assert.ok(!Navigation.StateController.crumbs[0].last);
        assert.ok(!Navigation.StateController.crumbs[1].last);
        assert.ok(!Navigation.StateController.crumbs[2].last);
        assert.ok(Navigation.StateController.crumbs[3].last);
    });

    QUnit.test('NavigateTransitionWithoutTrailTransitionTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        var state = Navigation.StateController.getNextState('t0');
        assert.equal(state, Navigation.StateInfoConfig.dialogs['d2'].states['s2']);
    });

    QUnit.test('NavigateTransitionTransitionGetCrumbTest', function (assert) {
        Navigation.StateController.navigate('d1');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var crumb = Navigation.StateController.crumbs[1];
        assert.equal(crumb.state, Navigation.StateInfoConfig.dialogs['d1'].states['s1']);
    });

    QUnit.test('NavigateDialogDialogCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('d6');
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(Navigation.StateController.crumbs.length, 1);
    });

    QUnit.test('NavigateCrossDialogCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(Navigation.StateController.crumbs[1].state, Navigation.StateInfoConfig.dialogs['d0']._states[1]);
        assert.equal(Navigation.StateController.crumbs.length, 2);
    });

    QUnit.test('NavigateDialogDialogBackCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0']._states[0]);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    QUnit.test('NavigateCrossDialogBackCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.refresh();
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0']._states[1]);
        assert.equal(Navigation.StateController.crumbs.length, 1);
    });

    QUnit.test('NavigateCrossDialogBackTwoCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(Navigation.StateController.crumbs[1].state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(Navigation.StateController.crumbs[2].state, Navigation.StateInfoConfig.dialogs['d6'].states['s0']);
        Navigation.StateController.navigateBack(2);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0']._states[1]);
        assert.equal(Navigation.StateController.crumbs.length, 1);
    });

    QUnit.test('NavigateDialogBackCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d6']._states[0]);
        assert.equal(Navigation.StateController.crumbs.length, 2);
    });

    QUnit.test('NavigateCrossDialogBackOneByOneCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[3]._states[0]);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        assert.equal(Navigation.StateController.crumbs.length, 1);
    });

    QUnit.module('NavigationDataTest', {
    });

    QUnit.test('NavigateDataTest', function (assert) {
        Navigation.StateController.navigate('d0', { n: 1 });
        assert.equal(Navigation.StateContext.data.s, null);
        assert.equal(Navigation.StateContext.data.n, 1);
    });

    QUnit.test('NavigateRouteDataTest', function (assert) {
        Navigation.StateController.navigate('d0', { s: 'hello' });
        assert.equal(Navigation.StateContext.data.s, 'hello');
        assert.equal(Navigation.StateContext.data.n, null);
    });

    QUnit.test('NavigateDataWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0', { s: 'hello' });
        assert.equal(Navigation.StateContext.data.s, 'hello');
        assert.equal(Navigation.StateContext.data.n, null);
    });

    QUnit.test('NavigateRouteDataWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0', { n: 1 });
        assert.equal(Navigation.StateContext.data.s, null);
        assert.equal(Navigation.StateContext.data.n, 1);
    });

    QUnit.test('ReservedUrlCharacterDataTest', function (assert) {
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#'] = '!#="/£$%^&*()\' - _ +~@:?><.;[], {}'
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#'], '!#="/£$%^&*()\' - _ +~@:?><.;[], {}');
    });

    QUnit.test('ReservedUrlCharacterRouteDataTest', function (assert) {
        var data = {};
        data['n'] = '!#="/£$%^&*()\' - _ +~@:?><.;[], {}'
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0', data);
        assert.equal(Navigation.StateContext.data['n'], '!#="/£$%^&*()\' - _ +~@:?><.;[], {}');
    });

    QUnit.test('SeparatorUrlCharacterDataTest', function (assert) {
        var data = {};
        data['_0_1_2_3_4_5_'] = '__00__11__22__33__44__55__';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['_0_1_2_3_4_5_'], '__00__11__22__33__44__55__');
    });

    QUnit.test('SeparatorUrlCharacterRouteDataTest', function (assert) {
        var data = {};
        data['s'] = '__00__11__22__33__44__55__';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['s'], '__00__11__22__33__44__55__');
    });

    QUnit.test('EmptyStringDataNavigateTest', function (assert) {
        var data = {};
        data['r'] = '';
        data['t'] = '1';
        Navigation.StateController.navigate('d0', data);
        assert.equal(Navigation.StateContext.data['r'], null);
        assert.equal(Navigation.StateContext.data['t'], '1');
    });

    QUnit.test('EmptyStringRouteDataNavigateTest', function (assert) {
        var data = {};
        data['s'] = '';
        data['t'] = '1';
        Navigation.StateController.navigate('d0', data);
        assert.equal(Navigation.StateContext.data['s'], null);
        assert.equal(Navigation.StateContext.data['t'], '1');
    });

    QUnit.test('EmptyStringDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['s'] = '';
        Navigation.StateContext.data['t'] = '1';
        assert.equal(Navigation.StateContext.data['s'], '');
        assert.equal(Navigation.StateContext.data['t'], '1');
    });

    QUnit.test('EmptyStringStateDataNavigateBackTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateContext.data['r'] = '';
        Navigation.StateContext.data['t'] = '1';
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['r'], null);
        assert.equal(Navigation.StateContext.data['t'], '1');
    });

    QUnit.test('EmptyStringStateRouteDataNavigateBackTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateContext.data['s'] = '';
        Navigation.StateContext.data['t'] = '1';
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['s'], null);
        assert.equal(Navigation.StateContext.data['t'], '1');
    });

    QUnit.test('NavigateDataNavigateBackTest', function (assert) {
        var data = {};
        data['r'] = 'Hello';
        data['t'] = '';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateController.crumbs[0].data['r'], 'Hello');
        assert.equal(Navigation.StateController.crumbs[0].data['t'], null);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['r'], 'Hello');
        assert.equal(Navigation.StateContext.data['t'], null);
    });

    QUnit.test('NavigateRouteDataNavigateBackTest', function (assert) {
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateController.crumbs[0].data['s'], 'Hello');
        assert.equal(Navigation.StateController.crumbs[0].data['t'], null);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['s'], 'Hello');
        assert.equal(Navigation.StateContext.data['t'], null);
    });

    QUnit.test('ChangeDataNavigateBackTest', function (assert) {
        var data = {};
        data['r'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.data['r'] = 'World';
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateController.crumbs[0].data['r'], 'World');
        assert.equal(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['r'], 'World');
        assert.equal(Navigation.StateContext.data['i'], 2);
    });

    QUnit.test('ChangeRouteDataNavigateBackTest', function (assert) {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.data['s'] = 'World';
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateController.crumbs[0].data['s'], 'World');
        assert.equal(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['s'], 'World');
        assert.equal(Navigation.StateContext.data['i'], 2);
    });

    QUnit.test('BlankDataNavigateBackTest', function (assert) {
        var data = {};
        data['r'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.data['r'] = null;
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateController.crumbs[0].data['r'], null);
        assert.equal(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['r'], null);
        assert.equal(Navigation.StateContext.data['i'], 2);
    });

    QUnit.test('BlankRouteDataNavigateBackTest', function (assert) {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.data['s'] = null;
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateController.crumbs[0].data['s'], null);
        assert.equal(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['s'], null);
        assert.equal(Navigation.StateContext.data['i'], 2);
    });

    QUnit.test('RemoveDataNavigateBackTest', function (assert) {
        var data = {};
        data['r'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        delete Navigation.StateContext.data['r'];
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateController.crumbs[0].data['r'], null);
        assert.equal(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['r'], null);
        assert.equal(Navigation.StateContext.data['i'], 2);
    });

    QUnit.test('RemoveRouteDataNavigateBackTest', function (assert) {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        delete Navigation.StateContext.data['s'];
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateController.crumbs[0].data['s'], null);
        assert.equal(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.data['s'], null);
        assert.equal(Navigation.StateContext.data['i'], 2);
    });

    QUnit.test('NavigateDataRefreshTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['r'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData());
        assert.equal(Navigation.StateContext.data['r'], 'Hello');
    });

    QUnit.test('NavigateRouteDataRefreshTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData());
        assert.equal(Navigation.StateContext.data['s'], 'Hello');
    });

    QUnit.test('NavigateRefreshDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['r'] = 'Hello';
        Navigation.StateController.navigate('t0');
        Navigation.StateController.refresh(data);
        assert.equal(Navigation.StateContext.data['r'], 'Hello');
    });

    QUnit.test('NavigateRefreshRouteDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0');
        Navigation.StateController.refresh(data);
        assert.equal(Navigation.StateContext.data['s'], 'Hello');
    });

    QUnit.test('NavigateDataRefreshDataOverrideTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['r'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        data = {};
        data['r'] = 'World';
        Navigation.StateController.refresh(data);
        assert.equal(Navigation.StateContext.data['r'], 'World');
    });

    QUnit.test('NavigateDataRefreshRouteDataOverrideTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        data = {};
        data['s'] = 'World';
        Navigation.StateController.refresh(data);
        assert.equal(Navigation.StateContext.data['s'], 'World');
    });

    QUnit.test('NavigateDataRefreshDataBlankTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['r'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh();
        assert.equal(Navigation.StateContext.data['r'], null);
    });

    QUnit.test('NavigateDataRefreshDataBlankTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh();
        assert.equal(Navigation.StateContext.data['s'], null);
    });

    QUnit.test('NavigateDataRefreshDataClearTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['r'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        delete Navigation.StateContext.data['r'];
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData());
        assert.equal(Navigation.StateContext.data['r'], null);
    });

    QUnit.test('NavigateDataRefreshRouteDataClearTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        delete Navigation.StateContext.data['s'];
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData());
        assert.equal(Navigation.StateContext.data['s'], null);
    });

    QUnit.test('ChangeDataRefreshTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['r'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.data['r'] = 'World';
        Navigation.StateContext.data['n'] = 1;
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData());
        assert.equal(Navigation.StateContext.data['r'], 'World');
        assert.equal(Navigation.StateContext.data['n'], 1);
    });

    QUnit.test('ChangeDataRefreshTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.data['s'] = 'World';
        Navigation.StateContext.data['n'] = 1;
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData());
        assert.equal(Navigation.StateContext.data['s'], 'World');
        assert.equal(Navigation.StateContext.data['n'], 1);
    });

    QUnit.test('ChangeRefreshDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['r'] = 'Hello';
        data['i'] = 3;
        Navigation.StateController.navigate('t0', data);
        data = {};
        data['r'] = 'World';
        data['n'] = 4;
        Navigation.StateController.refresh(data);
        assert.equal(Navigation.StateContext.data['r'], 'World');
        assert.equal(Navigation.StateContext.data['n'], 4);
        assert.equal(Navigation.StateContext.data['i'], null);
    });

    QUnit.test('ChangeRefreshRouteDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        data['i'] = 3;
        Navigation.StateController.navigate('t0', data);
        data = {};
        data['s'] = 'World';
        data['n'] = 4;
        Navigation.StateController.refresh(data);
        assert.equal(Navigation.StateContext.data['s'], 'World');
        assert.equal(Navigation.StateContext.data['n'], 4);
        assert.equal(Navigation.StateContext.data['i'], null);
    });

    QUnit.test('ChangeDynamicDataRefreshDataOverrideTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data: any = {};
        data.r = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.data.r = 'World';
        Navigation.StateContext.data.d = '2000-1-3';
        Navigation.StateContext.data.i = 3;
        data = Navigation.StateContext.newCurrentData();
        data.r = 'Hello World';
        data.i = null;
        data.n = 2;
        Navigation.StateController.refresh(data);
        assert.equal(Navigation.StateContext.data.r, 'Hello World');
        assert.equal(Navigation.StateContext.data.d, '2000-1-3');
        assert.equal(Navigation.StateContext.data.i, null);
        assert.equal(Navigation.StateContext.data.n, 2);
        assert.equal(Navigation.StateContext.data['n'], 2);
    });

    QUnit.test('ChangeDynamicDataRefreshRouteDataOverrideTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data: any = {};
        data.s = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.data.s = 'World';
        Navigation.StateContext.data.d = '2000-1-3';
        Navigation.StateContext.data.i = 3;
        data = Navigation.StateContext.newCurrentData();
        data.s = 'Hello World';
        data.i = null;
        data.n = 2;
        Navigation.StateController.refresh(data);
        assert.equal(Navigation.StateContext.data.s, 'Hello World');
        assert.equal(Navigation.StateContext.data.d, '2000-1-3');
        assert.equal(Navigation.StateContext.data.i, null);
        assert.equal(Navigation.StateContext.data.n, 2);
        assert.equal(Navigation.StateContext.data['n'], 2);
    });

    QUnit.test('NavigateWizardDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {
            r: 'Hello',
            n: 5
        };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t1', Navigation.StateContext.newCurrentData());
        assert.equal(Navigation.StateController.crumbs[1].data['r'], 'Hello');
        assert.equal(Navigation.StateController.crumbs[1].data['n'], 5);
        assert.equal(Navigation.StateContext.data['r'], 'Hello');
        assert.equal(Navigation.StateContext.data['n'], 5);
    });

    QUnit.test('NavigateWizardRouteDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {
            s: 'Hello',
            n: 5
        };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t1', Navigation.StateContext.newCurrentData());
        assert.equal(Navigation.StateController.crumbs[1].data['s'], 'Hello');
        assert.equal(Navigation.StateController.crumbs[1].data['n'], 5);
        assert.equal(Navigation.StateContext.data['s'], 'Hello');
        assert.equal(Navigation.StateContext.data['n'], 5);
    });
}
 