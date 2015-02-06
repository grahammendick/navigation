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
        var d0s0 = dialogs.d0.states.s0;
        var d6s0 = dialogs.d6.states.s0;
        var d6s1 = dialogs.d6.states.s1;
        d0s0._route = crossroads.addRoute(d0s0.route, function (s) {
            data = { s: s };
        });
        d6s0.stateHandler = new StateHandler();
        d6s1.stateHandler = new StateHandler();
        Navigation.Router = {
            getData: (route: String) => {
                data = null;
                crossroads.parse(route);
                return data;
            },
            getRoute: (state: Navigation.State, data: any) => {
                return state['_route'] ? state['_route'].interpolate(data) : state.route;
            }
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
 