module NavigationTest {
    export class StateHandler extends Navigation.StateHandler {
        truncateCrumbTrail(state: Navigation.State, crumbs: Array<Navigation.Crumb>): Array<Navigation.Crumb> {
            var newCrumbs: Array<Navigation.Crumb> = [];
            var d6Crumbs: Array<Navigation.Crumb> = [];
            for (var i = 0; i < crumbs.length; i++) {
                if (crumbs[i].state.parent.key === 'd0' || crumbs[i].state.parent.key === 'd3')
                    newCrumbs.push(crumbs[i]);
                if (crumbs[i].state.parent.key === 'd6')
                    d6Crumbs.push(crumbs[i]);
            }
            newCrumbs = newCrumbs.concat(super.truncateCrumbTrail(state, d6Crumbs));
            return newCrumbs;
        }
    }

    class CrossroadsRouter implements Navigation.IRouter {
        private crossroads: any;
        supportsDefaults: boolean = false;
        constructor() {
            this.crossroads = window['crossroads'];
            this.crossroads.ignoreState = true;
        }

        getData(route: string): any {
            var data = {};
            var match = this.crossroads._getMatchedRoutes(route)[0];
            for (var i = 0; i < match.params.length; i++) {
                data[match.route._paramsIds[i]] = decodeURIComponent(match.params[i]);
            }
            return data;
        }

        getRoute(state: Navigation.State, data: any): string {
            var encodedData = {};
            for (var k in data)
                encodedData[k] = encodeURIComponent(data[k]);
            return state['_route'].interpolate(encodedData);
        }

        addRoutes(dialogs: Array<Navigation.Dialog>) {
            for (var i = 0; i < dialogs.length; i++) {
                for (var j = 0; j < dialogs[i]._states.length; j++) {
                    dialogs[i]._states[j]['_route'] = this.crossroads.addRoute(dialogs[i]._states[j].route);
                }
            }
            this.crossroads.removeRoute(dialogs[4]._states[1]['_route']);
            dialogs[4]._states[1]['_route'] = this.crossroads.addRoute(dialogs[4]._states[1].route);
        }
    }

    Navigation.router = new CrossroadsRouter();

    Navigation.StateInfoConfig.build([
        { key: 'd0', initial: 's0', title: 'd0', states: [
            { key: 's0', route: 'd0s0', title: 's0', transitions: [
                { key: 't0', to: 's1' },
                { key: 't1', to: 's2' },
                { key: 't2', to: 's3' },
                { key: 't3', to: 's4' }]},
            { key: 's1', route: 'd0s1', title: 's1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, 
                defaultTypes: { _bool: 'number', 'number': 'number' }, transitions: [
                { key: 't0', to: 's2' },
                { key: 't1', to: 's3' },
                { key: 't2', to: 's4' }]},
            { key: 's2', route: 'd0s2', title: 's2', defaults: { emptyString: '', 'number': 4, char: 7 }, 
                defaultTypes: { 'string': 'string' }, transitions: [
                { key: 't0', to: 's3' },
                { key: 't1', to: 's4' }]},
            { key: 's3', route: 'd0s3', title: 's3', defaultTypes: { s1: 'string', s2: 'number', b1: 'boolean', n1: 'number' },
                 transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd0s4', title: 's4', defaultTypes: { 'string': 'string', 'number': 'number', 'boolean': 'boolean' }}
        ]},
        { key: 'd1', initial: 's0', title: 'd1', states: [
            { key: 's0', route: 'd1s0', title: 's0', defaultTypes: { _0_1_2_3_4_5_ : 'number', '*/()-_+~@:?><.;[]{}!£$%^#&': 'number' }, 
                transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'd1s1', title: 's1', defaults: { ' &s0': 'a', s1: 'b', s2: 'c', s3: 'd', b1: true, b2: false, b3: true, n1: 0, n2: 1, n3: 2 }, 
                defaultTypes: { s1: 'string', s2: 'boolean', b1: 'boolean', b2: 'number', n1: 'number', n2: 'string' },  transitions: [
                { key: 't0', to: 's2' }]},
            { key: 's2', route: 'd1s2', title: 's2', transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'd1s3', title: 's3', transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd1s4', title: 's4', transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'd1s5', title: 's5', transitions: [
                { key: 't0', to: 's0' },
                { key: 't1', to: 's1' },
                { key: 't2', to: 's2' },
                { key: 't3', to: 's3' },
                { key: 't4', to: 's4' }]}
        ]},
        { key: 'd2', initial: 's0', title: 'd2', states: [
            { key: 's0', route: 'd2s0', title: 's0', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'd2s1', title: 's1', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's2' }]},
            { key: 's2', route: 'd2s2', title: 's2', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'd2s3', title: 's3', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd2s4', title: 's4', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'd2s5', title: 's5', transitions: [
                { key: 't0', to: 's6' }]},
            { key: 's6', route: 'd2s6', title: 's6', transitions: [
                { key: 't0', to: 's0' }]}
        ]},
        { key: 'd3', initial: 's0', title: 'd0', states: [
            { key: 's0', route: 'd3s0', title: 's0', transitions: [
                { key: 't0', to: 's1' },
                { key: 't1', to: 's2' },
                { key: 't2', to: 's3' },
                { key: 't3', to: 's4' }]},
            { key: 's1', route: 'd3s1/{string}/{number}', title: 's1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, 
                defaultTypes: { _bool: 'number', 'number': 'number' }, transitions: [
                { key: 't0', to: 's2' },
                { key: 't1', to: 's3' },
                { key: 't2', to: 's4' }]},
            { key: 's2', route: 'd3s2/{char}/:number:', title: 's2', defaults: { emptyString: '', 'number': 4, char: 7 }, 
                defaultTypes: { 'string': 'string' }, transitions: [
                { key: 't0', to: 's3' },
                { key: 't1', to: 's4' }]},
            { key: 's3', route: 'd3s3/:s:', title: 's3', defaultTypes: { s1: 'string', s2: 'number', b1: 'boolean', n1: 'number' },
                 transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd3s4', title: 's4', defaultTypes: { 'string': 'string', 'number': 'number', 'boolean': 'boolean' }}
        ]},
        { key: 'd4', initial: 's0', title: 'd1', states: [
            { key: 's0', route: 'd4s0', title: 's0', defaultTypes: { _0_1_2_3_4_5_ : 'number', '*/()-_+~@:?><.;[]{}!£$%^#&': 'number' }, 
                transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: '{s1}/:s:', title: 's1', defaults: { ' &s0': 'a', s1: 'b', s2: 'c', s3: 'd', b1: true, b2: false, b3: true, n1: 0, n2: 1, n3: 2 }, 
                defaultTypes: { s1: 'string', s2: 'boolean', b1: 'boolean', b2: 'number', n1: 'number', n2: 'string' },  transitions: [
                { key: 't0', to: 's2' }]},
            { key: 's2', route: 'd4s2', title: 's2', transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'd4s3', title: 's3', transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd4s4/{s1}/{s2}', title: 's4', transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'd4s5', title: 's5', transitions: [
                { key: 't0', to: 's0' },
                { key: 't1', to: 's1' },
                { key: 't2', to: 's2' },
                { key: 't3', to: 's3' },
                { key: 't4', to: 's4' }]}
        ]},
        { key: 'd5', initial: 's0', title: 'd2', states: [
            { key: 's0', route: 'd5s0', title: 's0', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'd5s1', title: 's1', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's2' }]},
            { key: 's2', route: 'd5s2', title: 's2', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'd5s3', title: 's3', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd5s4', title: 's4', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'd5s5', title: 's5', transitions: [
                { key: 't0', to: 's6' }]},
            { key: 's6', route: 'd5s6', title: 's6', transitions: [
                { key: 't0', to: 's0' }]}
        ]},
        { key: 'd6', initial: 's0', title: 'd6', states: [
            { key: 's0', route: 'd6s0', title: 's0', transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'd6s1', title: 's1'}
        ]}
    ]);

    var dialogs: any = Navigation.StateInfoConfig.dialogs;
    dialogs.d6.states.s0.stateHandler = new StateHandler();
    dialogs.d6.states.s1.stateHandler = new StateHandler();

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
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[6]._states[0]);
        Navigation.StateController.navigateBack(1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        assert.equal(Navigation.StateController.crumbs.length, 1);
    });

    var individualNavigationData = {};
    individualNavigationData['string'] = 'Hello';
    individualNavigationData['boolean'] = true;
    individualNavigationData['number'] = 0;

    var arrayNavigationData = {};
    arrayNavigationData['array_string'] = ['He-llo', 'World'];
    arrayNavigationData['array_boolean'] = [true, false];
    arrayNavigationData['array_number'] = [1, 2];

    QUnit.module('NavigationDataTest', {
        setup: () => {
            Navigation.StateContext.clear();
        }
    });

    QUnit.test('NavigateIndividualDataTest', function (assert) {
        Navigation.StateController.navigate('d0', individualNavigationData);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key], individualNavigationData[key]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['boolean'], true);
        assert.equal(i, 3);
    });

    QUnit.test('NavigateIndividualDataWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0', individualNavigationData);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key], individualNavigationData[key]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['number'], 0);
        assert.equal(i, 3);
    });

    QUnit.test('NavigateArrayDataTest', function (assert) {
        Navigation.StateController.navigate('d0', arrayNavigationData);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key][0], arrayNavigationData[key][0]);
            assert.strictEqual(Navigation.StateContext.data[key][1], arrayNavigationData[key][1]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['array_boolean'][0], true);
        assert.strictEqual(Navigation.StateContext.data['array_number'][1], 2);
        assert.equal(i, 3);
    });

    QUnit.test('NavigateArrayDataRouteTest', function (assert) {
        Navigation.StateController.navigate('d3', arrayNavigationData);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key][0], arrayNavigationData[key][0]);
            assert.strictEqual(Navigation.StateContext.data[key][1], arrayNavigationData[key][1]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['array_boolean'][0], true);
        assert.strictEqual(Navigation.StateContext.data['array_number'][1], 2);
        assert.equal(i, 3);
    });

    QUnit.test('InvalidIndividualDataTest', function (assert) {
        var data = {};
        data['item'] = new Date();
        assert.throws(() => Navigation.StateController.navigate('d0', data));
    });

    QUnit.test('InvalidArrayDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateContext.data['item'] = [new Date()];
        assert.throws(() => Navigation.StateController.navigate('t0'));
    });

    QUnit.test('InvalidDataGetNavigationLinkTest', function (assert) {
        var data = {};
        data['item'] = new Date();
        assert.throws(() => Navigation.StateController.getNavigationLink('d0', data));
    });

    QUnit.test('InvalidDataRefreshTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateContext.data['item'] = new Date();
        assert.throws(() => Navigation.StateController.refresh(Navigation.StateContext.newCurrentData()));
    });

    QUnit.test('InvalidRefreshDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        assert.throws(() => Navigation.StateController.refresh({ item: new Date() }));
    });

    QUnit.test('InvalidDataGetRefreshLinkTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateContext.data['item'] = new Date();
        assert.throws(() => Navigation.StateController.getRefreshLink(Navigation.StateContext.newCurrentData()));
    });

    QUnit.test('InvalidGetRefreshLinkDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        assert.throws(() => Navigation.StateController.getRefreshLink({ item: new Date() }));
    });

    QUnit.test('InvalidTypesArrayDataTest', function (assert) {
        var data = {};
        data['item0'] = ['0', 1];
        data['item1'] = [0, '1'];
        Navigation.StateController.navigate('d0', data);
        assert.strictEqual(Navigation.StateContext.data['item0'][0], '0');
        assert.strictEqual(Navigation.StateContext.data['item0'][1], '1');
        assert.strictEqual(Navigation.StateContext.data['item1'][0], 0);
        assert.strictEqual(Navigation.StateContext.data['item1'][1], 1);
    });

    QUnit.test('NavigateInvalidContextDataWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateContext.data['item'] = new Date();
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    QUnit.test('RefreshInvalidContextDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateContext.data['item'] = new Date();
        Navigation.StateController.refresh(data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    QUnit.test('NavigateInvalidDataWithoutTrailTest', function (assert) {
        var data = {};
        data['item'] = new Date();
        assert.throws(() => Navigation.StateController.navigate('d2', data));
    });

    QUnit.test('ReservedUrlCharacterDataTest', function (assert) {
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
    });

    QUnit.test('ReservedUrlCharacterRouteDataTest', function (assert) {
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['string'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['_bool'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['number'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
        assert.strictEqual(Navigation.StateContext.data['string'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
        assert.strictEqual(Navigation.StateContext.data['_bool'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
        assert.strictEqual(Navigation.StateContext.data['number'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
    });

    QUnit.test('SeparatorUrlCharacterDataTest', function (assert) {
        var data = {};
        data['_0_1_2_3_4_5_'] = '__00__11__22__33__44__55__';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['_0_1_2_3_4_5_'], '__00__11__22__33__44__55__');
    });

    QUnit.test('EmptyStringDataNavigateTest', function (assert) {
        var data = {};
        data['s'] = '';
        data['t'] = '1';
        Navigation.StateController.navigate('d0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], '1');
    });

    QUnit.test('EmptyStringDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['s'] = '';
        Navigation.StateContext.data['t'] = '1';
        assert.strictEqual(Navigation.StateContext.data['s'], '');
        assert.strictEqual(Navigation.StateContext.data['t'], '1');
    });

    QUnit.test('EmptyStringStateDataNavigateBackTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateContext.data['s'] = '';
        Navigation.StateContext.data['t'] = '1';
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], '1');
    });

    QUnit.test('NavigateDataNavigateBackTest', function (assert) {
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    QUnit.test('ChangeDataNavigateBackTest', function (assert) {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.data['s'] = 'World';
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], 'World');
        assert.strictEqual(Navigation.StateContext.data['i'], 2);
    });

    QUnit.test('BlankDataNavigateBackTest', function (assert) {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.data['s'] = null;
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['i'], 2);
    });

    QUnit.test('ClearDataNavigateBackTest', function (assert) {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.clear();
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], undefined);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['i'], undefined);
    });

    QUnit.test('RemoveDataNavigateBackTest', function (assert) {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.clear('s');
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['i'], 2);
    });

    QUnit.test('NavigateDataRefreshTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData());
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    QUnit.test('NavigateRefreshDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0');
        Navigation.StateController.refresh(data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    QUnit.test('NavigateDataRefreshDataOverrideTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        data = {};
        data['s'] = 'World';
        Navigation.StateController.refresh(data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'World');
    });

    QUnit.test('NavigateDataRefreshDataBlankTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh();
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
    });

    QUnit.test('NavigateDataRefreshDataClearTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.clear();
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData());
        assert.equal(Navigation.StateContext.data['s'], undefined);
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
        data['s'] = 'Hello';
        data['i'] = 3;
        Navigation.StateController.navigate('t0', data);
        data = {};
        data['s'] = 'World';
        data['n'] = 4;
        Navigation.StateController.refresh(data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'World');
        assert.strictEqual(Navigation.StateContext.data['n'], 4);
        assert.strictEqual(Navigation.StateContext.data['i'], undefined);
    });

    QUnit.test('ChangeDynamicDataRefreshRouteOverrideTest', function (assert) {
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
        assert.strictEqual(Navigation.StateContext.data.s, 'Hello World');
        assert.strictEqual(Navigation.StateContext.data.d, '2000-1-3');
        assert.strictEqual(Navigation.StateContext.data.i, undefined);
        assert.strictEqual(Navigation.StateContext.data.n, 2);
        assert.strictEqual(Navigation.StateContext.data['n'], 2);
    });

    QUnit.test('NavigateWizardDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {
            s: 'Hello',
            n: 5
        };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t1', Navigation.StateContext.newCurrentData());
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['n'], 5);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['n'], 5);
    });

    QUnit.test('NavigateDataNavigateTransitionTransitionTest', function (assert) {
        var data = {};
        data['s'] = 1;
        Navigation.StateController.navigate('d0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
        data['s'] = 2;
        data['t'] = '2';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateContext.data['s'], 2);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
        data['s'] = 3;
        data['t'] = '3';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 2);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
        assert.strictEqual(Navigation.StateContext.data['s'], 3);
        assert.strictEqual(Navigation.StateContext.data['t'], '3');
    });

    QUnit.test('NavigateDynamicDataNavigateTransitionTransitionTest', function (assert) {
        var data: any = {};
        data.s = 1;
        Navigation.StateController.navigate('d0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        data.s = '2';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data.s, 1);
        assert.strictEqual(Navigation.StateContext.data.s, '2');
        data.s = '3';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data.s, 1);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data.s, '2');
        assert.strictEqual(Navigation.StateContext.data.s, '3');
    });

    QUnit.test('ChangeDataNavigateTransitionTransitionTest', function (assert) {
        var data = {};
        data['s'] = 1;
        Navigation.StateController.navigate('d0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        Navigation.StateContext.data['s'] = 11;
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
        data['s'] = 2;
        data['t'] = '2';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 11);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateContext.data['s'], 2);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
        Navigation.StateContext.data['s'] = '22';
        data['s'] = 3;
        data['t'] = '3';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 11);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], '22');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
        assert.strictEqual(Navigation.StateContext.data['s'], 3);
        assert.strictEqual(Navigation.StateContext.data['t'], '3');
    });

    QUnit.test('ChangeCrumbDataNavigateBackTest', function (assert) {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        var crumb = Navigation.StateController.crumbs[0];
        crumb.data['s'] = 'Changed';
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 'Changed');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    QUnit.test('NavigateDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    QUnit.test('NavigateDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    QUnit.test('NavigationDataDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['string'] = null;
        Navigation.StateContext.data['number'] = 'Hello';
        assert.strictEqual(Navigation.StateContext.data['string'], null);
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 'Hello');
    });

    QUnit.test('NavigationDataDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['string'] = null;
        Navigation.StateContext.data['number'] = 'Hello';
        assert.strictEqual(Navigation.StateContext.data['string'], null);
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 'Hello');
    });

    QUnit.test('RemoveDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.clear('emptyString');
        Navigation.StateContext.clear('number');
        Navigation.StateContext.clear('char');
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
    });

    QUnit.test('RemoveDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.clear('emptyString');
        Navigation.StateContext.clear('number');
        Navigation.StateContext.clear('char');
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
    });

    QUnit.test('NavigateDataAndDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '', 'number': '' };
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    QUnit.test('NavigateDataAndDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '', 'number': '' };
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    QUnit.test('NavigateOverrideDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 2, 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 2);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    QUnit.test('NavigateOverrideDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 2, 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 2);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    QUnit.test('OverrideDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['emptyString'] = 'Hello';
        Navigation.StateContext.data['number'] = 4;
        Navigation.StateContext.data['char'] = 5;
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    QUnit.test('OverrideDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['emptyString'] = 'Hello';
        Navigation.StateContext.data['number'] = 4;
        Navigation.StateContext.data['char'] = 5;
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    QUnit.test('ClearDataAndDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.clear();
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    QUnit.test('ClearDataAndDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.clear();
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    QUnit.test('NavigateBackDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    QUnit.test('NavigateBackDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    QUnit.test('NavigateBackDataAndDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(2);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    QUnit.test('NavigateBackDataAndDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(2);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    QUnit.test('NavigateBackOverrideDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    QUnit.test('NavigateBackOverrideDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    QUnit.test('CrumbDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['_bool'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    QUnit.test('CrumbDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['_bool'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    QUnit.test('CrumbDataAndDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    QUnit.test('CrumbDataAndDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    QUnit.test('NavigateOverrideCrumbDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    QUnit.test('NavigateOverrideCrumbDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    QUnit.test('OverrideCrumbDefaultsTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    QUnit.test('OverrideCrumbDefaultsRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        var data = {};
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    QUnit.test('NavigateBackDefaultsCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(3);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    QUnit.test('NavigateBackDefaultsCustomTrailRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(3);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    QUnit.test('NavigateBackDataAndDefaultsCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.refresh();
        Navigation.StateController.navigateBack(3);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    QUnit.test('NavigateBackDataAndDefaultsCustomTrailRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.refresh();
        Navigation.StateController.navigateBack(3);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    QUnit.test('NavigateBackOverrideDefaultsCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    QUnit.test('NavigateBackOverrideDefaultsCustomTrailRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    QUnit.test('CrumbDefaultsCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['number'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    QUnit.test('CrumbDefaultsCustomTrailRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['number'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    QUnit.test('NavigateDataNavigateBackCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        Navigation.StateController.navigate('d6', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], undefined);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    QUnit.test('NavigateDataNavigateBackCustomTrailRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        Navigation.StateController.navigate('d6', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], undefined);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    QUnit.test('CrumbDataAndDefaultsCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    QUnit.test('CrumbDataAndDefaultsCustomTrailRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    QUnit.test('NavigateOverrideCrumbDefaultsCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    QUnit.test('NavigateOverrideCrumbDefaultsCustomTrailRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    QUnit.test('OverrideCrumbDefaultsCustomTrailTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigateBack(1);
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    QUnit.test('OverrideCrumbDefaultsCustomTrailRouteTest', function (assert) {
        Navigation.StateController.navigate('d3');
        var data = {};
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigateBack(1);
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    QUnit.test('NavigateLinkTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateContext.data['_number'] = 1;
        Navigation.StateContext.data['string'] = 'Hello';
        var link = Navigation.StateController.getNavigationLink('t0');
        assert.notEqual(link.indexOf('c1'), -1);
        assert.notEqual(link.indexOf('_number'), -1);
        assert.notEqual(link.indexOf('string'), -1);
    });

    QUnit.test('NavigateLinkWithoutTrailTest', function (assert) {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['_number'] = 1;
        Navigation.StateContext.data['string'] = 'Hello';
        var link = Navigation.StateController.getNavigationLink('t0');
        assert.equal(link.indexOf('c1'), -1);
        assert.equal(link.indexOf('_number'), -1);
        assert.equal(link.indexOf('string'), -1);
    });

    QUnit.test('NavigateDefaultTypesTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0', individualNavigationData);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key], individualNavigationData[key]);
            i++;
        }
        assert.equal(i, 3);
    });

    QUnit.test('NavigateLinkDefaultTypesStringTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var data = { s1: 'hello', s2: 'world' };
        var url = Navigation.StateController.getNavigationLink('t0', data);
        assert.notEqual(url.indexOf('s1=hello&'), -1);
        assert.notEqual(url.indexOf('s2=world2_'), -1);
    });

    QUnit.test('NavigateLinkDefaultTypesBoolTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var data = { b1: true, b2: false };
        var url = Navigation.StateController.getNavigationLink('t0', data);
        assert.notEqual(url.indexOf('b1=true&'), -1);
        assert.notEqual(url.indexOf('b2=false2_'), -1);
    });

    QUnit.test('NavigateLinkDefaultTypesNumberTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var data = { n1: 0, n2: 1 };
        var url = Navigation.StateController.getNavigationLink('t0', data);
        assert.notEqual(url.indexOf('n1=0&'), -1);
        assert.notEqual(url.indexOf('n2=12_'), -1);
    });

    QUnit.test('NavigateBackLinkDefaultTypesTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var data = {
            s2: 'world',
            n1: 0,
            n2: 1
        };
        data['s1'] = 'hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        var url = Navigation.StateController.getNavigationBackLink(1);
        assert.notEqual(url.indexOf('s1=hello&'), -1);
        assert.notEqual(url.indexOf('s2=world2_'), -1);
        assert.notEqual(url.indexOf('n1=0&'), -1);
        assert.notEqual(url.indexOf('n2=12_'), -1);
    });

    QUnit.test('NavigateRefreshLinkDefaultTypesTest', function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var data = {
            s2: 'world',
            n1: 0,
            n2: 1
        };
        data['s1'] = 'hello';
        Navigation.StateController.navigate('t0', data);
        var url = Navigation.StateController.getRefreshLink(Navigation.StateContext.newCurrentData());
        assert.notEqual(url.indexOf('s1=hello&'), -1);
        assert.notEqual(url.indexOf('s2=world2_'), -1);
        assert.notEqual(url.indexOf('n1=0&'), -1);
        assert.notEqual(url.indexOf('n2=12_'), -1);
    });

    QUnit.test('NavigateBack2LinkDefaultTypesTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {
            _bool: 1
        };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var url = Navigation.StateController.getNavigationBackLink(2);
        assert.notEqual(url.indexOf('_bool=1&'), -1);
    });

    QUnit.test('NavigateOverrideDefaultTypesTest', function (assert) {
        Navigation.StateController.navigate('d1');
        var data = {};
        data['s1'] = true;
        data['b1'] = 0;
        data['n1'] = 'hello';
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['s1'], true);
        assert.strictEqual(Navigation.StateContext.data['b1'], 0);
        assert.strictEqual(Navigation.StateContext.data['n1'], 'hello');
    });

    QUnit.test('NavigateRefreshOverrideDefaultTypesTest', function (assert) {
        Navigation.StateController.navigate('d1');
        var data = {};
        data['s1'] = true;
        data['b1'] = 0;
        data['n1'] = 'hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData());
        assert.strictEqual(Navigation.StateContext.data['s1'], true);
        assert.strictEqual(Navigation.StateContext.data['b1'], 0);
        assert.strictEqual(Navigation.StateContext.data['n1'], 'hello');
    });

    QUnit.test('NavigateBackOverrideDefaultTypesTest', function (assert) {
        Navigation.StateController.navigate('d1');
        var data = {};
        data['s1'] = true;
        data['b1'] = 0;
        data['n1'] = 'hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(2);
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData());
        assert.strictEqual(Navigation.StateContext.data['s1'], true);
        assert.strictEqual(Navigation.StateContext.data['b1'], 0);
        assert.strictEqual(Navigation.StateContext.data['n1'], 'hello');
    });

    QUnit.test('ReservedUrlCharacterDefaultTypesTest', function (assert) {
        var data = {};
        data['*/()-_+~@:?><.;[]{}!£$%^#&'] = 0;
        data['**=/()-_+~@:?><.;[]{}!£$%^#&&'] = 1;
        Navigation.StateController.navigate('d1', data);
        var url = Navigation.StateController.getRefreshLink(Navigation.StateContext.newCurrentData());
        assert.notEqual(url.indexOf('=0&'), -1);
        assert.notEqual(url.indexOf('=12_'), -1);
        assert.strictEqual(Navigation.StateContext.data['*/()-_+~@:?><.;[]{}!£$%^#&'], 0);
        assert.strictEqual(Navigation.StateContext.data['**=/()-_+~@:?><.;[]{}!£$%^#&&'], 1);
        Navigation.StateController.navigate('t0');
        url = Navigation.StateController.getNavigationBackLink(1);
        assert.notEqual(url.indexOf('=0&'), -1);
        assert.notEqual(url.indexOf('=12_'), -1);
    });

    QUnit.test('SeparatorUrlCharacterDefaultTypesTest', function (assert) {
        var data = {};
        data['_0_1_2_3_4_5_'] = 10;
        data['__0_1_2_3_4_5_'] = 20;
        Navigation.StateController.navigate('d1', data);
        var url = Navigation.StateController.getRefreshLink(Navigation.StateContext.newCurrentData());
        assert.notEqual(url.indexOf('=10&'), -1);
        assert.notEqual(url.indexOf('=202_'), -1);
        assert.strictEqual(Navigation.StateContext.data['_0_1_2_3_4_5_'], 10);
        assert.strictEqual(Navigation.StateContext.data['__0_1_2_3_4_5_'], 20);
        Navigation.StateController.navigate('t0');
        url = Navigation.StateController.getNavigationBackLink(1);
        assert.notEqual(url.indexOf('=10&'), -1);
        assert.notEqual(url.indexOf('=202_'), -1);
    });

    QUnit.test('NavigateRefreshCurrentDataTest', function (assert) {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        data['n'] = 1;
        data['c'] = '1';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh(Navigation.StateContext.newCurrentData(['s', 'c']));
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['c'], '1');
        assert.strictEqual(Navigation.StateContext.data['n'], undefined);
    });

    QUnit.test('NavigateCurrentDataDefaultsTest', function (assert) {
        var data = {};
        data['emptyString'] = 'Hello';
        data['number'] = 1;
        data['char'] = '6';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0', Navigation.StateContext.newCurrentData());
        Navigation.StateController.navigate('t0', Navigation.StateContext.newCurrentData(['number', 'char']));
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], '6');
    });

    QUnit.test('NavigateMissingRouteDataTest', function (assert) {
        Navigation.StateController.navigate('d4');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.throws(() => Navigation.StateController.navigate('t0'));
    });

    QUnit.test('NavigateRefreshMissingRouteDataTest', function (assert) {
        Navigation.StateController.navigate('d4');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0', { s1: 1, s2: 2 });
        assert.throws(() => Navigation.StateController.refresh());
    });
}
 