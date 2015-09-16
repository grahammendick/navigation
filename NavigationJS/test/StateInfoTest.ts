/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
import initStateInfo = require('./initStateInfo');
import State = require('../src/config/State');
import Navigation = require('../src/Navigation');

describe('StateInfoTest', function () {
    beforeEach(function () {
        initStateInfo();
        Navigation.StateController.clearStateContext();
    });

    describe('Dialog', function () {
        it('should configure State Info', function(){
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', title: 't0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's1', title: 't1', states: [
                    { key: 's1', route: 'r1' }]}
                ]);
            assert.equal(Navigation.StateInfoConfig._dialogs.length, 2);
            var dialog = Navigation.StateInfoConfig._dialogs[0];
            assert.equal(dialog.key, 'd0');
            assert.equal(dialog.title, 't0');
            assert.equal(dialog.index, 0);
            assert.equal(dialog.initial.key, 's0');
            dialog = Navigation.StateInfoConfig._dialogs[1];
            assert.equal(dialog.key, 'd1');
            assert.equal(dialog.title, 't1');
            assert.equal(dialog.index, 1);
            assert.equal(dialog.initial.key, 's1');
        })
    });

    describe('State', function () {
        it('should configure State Info', function(){
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', title: 't0', transitions: [
                        { key: 't', to: 's1' }]},
                    { key: 's1', route: 'r1', title: 't1' },]}
                ]);
            var dialogs: any = Navigation.StateInfoConfig.dialogs;
            var dialog = dialogs.d;
            var state: State = dialog.states.s0;
            assert.equal(state.key, 's0');
            assert.equal(state.route, 'r0');
            assert.equal(state.title, 't0');
            assert.equal(state.index, 0);
            state = dialog.states.s1;
            assert.equal(state.key, 's1');
            assert.equal(state.route, 'r1');
            assert.equal(state.title, 't1');
            assert.equal(state.index, 1);
        })
    });

    it('TransitionTest', function () {
        for (var i = 0; i < Navigation.StateInfoConfig._dialogs.length; i++) {
            var dialog = Navigation.StateInfoConfig._dialogs[i];
            for (var j = 0; j < dialog._states.length; j++) {
                var state = dialog._states[j];
                if (dialog.index === 0)
                    assert.equal(state._transitions.length, 4 - state.index);
                if (dialog.index === 1) {
                    if (state.index !== 5)
                        assert.equal(state._transitions.length, 1);
                    else
                        assert.equal(state._transitions.length, 5);
                }
                for (var k = 0; k < state._transitions.length; k++) {
                    var transition = state._transitions[k];
                    assert.equal(transition.key, 't' + k);
                    assert.equal(transition.index, k);
                }
            }
        }
    });

    it('DialogInitialTest', function () {
        for (var i = 0; i < Navigation.StateInfoConfig._dialogs.length; i++) {
            var dialog = Navigation.StateInfoConfig._dialogs[i];
            assert.equal(dialog.initial, dialog._states[0]);
        }
    });

    it('DialogAttributesTest', function () {
        assert.equal(Navigation.StateInfoConfig._dialogs[6]['other'], true);
        assert.equal(Navigation.StateInfoConfig._dialogs[6]['path'], ' d6');
    });

    it('StateParentTest', function () {
        for (var i = 0; i < Navigation.StateInfoConfig._dialogs.length; i++) {
            var dialog = Navigation.StateInfoConfig._dialogs[i];
            for (var j = 0; j < dialog._states.length; j++) {
                var state = dialog._states[j];
                assert.equal(state.parent, dialog);
            }
        }
    });

    it('TransitionParentTest', function () {
        for (var i = 0; i < Navigation.StateInfoConfig._dialogs.length; i++) {
            var dialog = Navigation.StateInfoConfig._dialogs[i];
            for (var j = 0; j < dialog._states.length; j++) {
                var state = dialog._states[j];
                for (var k = 0; k < state._transitions.length; k++) {
                    var transition = state._transitions[k];
                    assert.equal(transition.parent, state);
                }
            }
        }
    });

    it('TransitionToTest', function () {
        for (var i = 0; i < Navigation.StateInfoConfig._dialogs.length; i++) {
            var dialog = Navigation.StateInfoConfig._dialogs[i];
            for (var j = 0; j < dialog._states.length; j++) {
                var state = dialog._states[j];
                for (var k = 0; k < state._transitions.length; k++) {
                    var transition = state._transitions[k];
                    assert.equal(transition.to, dialog.states[transition.to.key]);
                }
            }
        }
    });

    it('TrackCrumbTrailTest', function () {
        assert.equal(Navigation.StateInfoConfig._dialogs[2]._states[0].trackCrumbTrail, false);
        assert.equal(Navigation.StateInfoConfig._dialogs[2]._states[1].trackCrumbTrail, true);
        assert.equal(Navigation.StateInfoConfig._dialogs[2]._states[2].trackCrumbTrail, false);
        assert.equal(Navigation.StateInfoConfig._dialogs[2]._states[3].trackCrumbTrail, true);
        assert.equal(Navigation.StateInfoConfig._dialogs[2]._states[4].trackCrumbTrail, false);
        assert.equal(Navigation.StateInfoConfig._dialogs[2]._states[5].trackCrumbTrail, true);
        assert.equal(Navigation.StateInfoConfig._dialogs[2]._states[6].trackCrumbTrail, true);
    });

    it('DefaultsTest', function () {
        assert.strictEqual(Navigation.StateInfoConfig._dialogs[0]._states[1].defaults['string'], 'Hello');
        assert.strictEqual(Navigation.StateInfoConfig._dialogs[0]._states[1].defaults['_bool'], true);
        assert.strictEqual(Navigation.StateInfoConfig._dialogs[0]._states[1].defaults['number'], 1);
    });

    it('DefaultTypesTest', function () {
        assert.strictEqual(Navigation.StateInfoConfig._dialogs[0]._states[4].defaultTypes['string'], 'string');
        assert.strictEqual(Navigation.StateInfoConfig._dialogs[0]._states[4].defaultTypes['boolean'], 'boolean');
        assert.strictEqual(Navigation.StateInfoConfig._dialogs[0]._states[4].defaultTypes['number'], 'number');
    });

    it('AttributesTest', function () {
        assert.equal(Navigation.StateInfoConfig._dialogs[6]._states[0]['handler'], '~/d6/s0.aspx');
    });

    it('RouteTest', function () {
        assert.equal(Navigation.StateInfoConfig._dialogs[3]._states[0].route, 'd3s0');
        assert.equal(Navigation.StateInfoConfig._dialogs[3]._states[1].route, 'd3s1/{string}/{number}');
    });

    it('DefaultTypesStringTest', function () {
        var defaults = Navigation.StateInfoConfig._dialogs[1]._states[1].defaults;
        assert.strictEqual(defaults[' &s0'], 'a');
        assert.strictEqual(defaults['s1'], 'b');
        assert.strictEqual(defaults['s2'], 'c');
        assert.strictEqual(defaults['s3'], 'd');
    });

    it('DefaultTypesBoolTest', function () {
        var defaults = Navigation.StateInfoConfig._dialogs[1]._states[1].defaults;
        assert.strictEqual(defaults['b1'], true);
        assert.strictEqual(defaults['b2'], false);
        assert.strictEqual(defaults['b3'], true);
    });

    it('DefaultTypesNumberTest', function () {
        var defaults = Navigation.StateInfoConfig._dialogs[1]._states[1].defaults;
        assert.strictEqual(defaults['n1'], 0);
        assert.strictEqual(defaults['n2'], 1);
        assert.strictEqual(defaults['n3'], 2);
    });

    it('InvalidTransitionToTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build([
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0', transitions: [
                    { key: 't0', to: 's1' }]}
                ]}
            ])
        });
   });

    it('InvalidInitialTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build([
            { key: 'd0', initial: 's1', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0'}]}
            ]);
        });
    });

    it('DuplicateDialogTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build([
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0'}]},
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0'}]}
            ]);
        });
    });

    it('DuplicateStateTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build([
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0'},
                { key: 's0', route: 'd0s0', title: 's0' }]}
            ]);
        });
    });

    it('DuplicateTransitionTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build([
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0', transitions: [
                    { key: 't0', to: 's1' },
                    { key: 't0', to: 's2' }]},
                { key: 's1', route: 'd0s1', title: 's1' },
                { key: 's2', route: 'd0s2', title: 's2' }]}
            ])
        });
    });

    it('MissingDialogKeyTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build(<any> [
            { initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0'}]}
            ]);
        });
    });

    it('EmptyDialogKeyTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build([
            { key: '', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0'}]}
            ]);
        });
    });

    it('MissingDialogInitialTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build(<any> [
            { key: 'd0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0'}]}
            ]);
        }, /mandatory/, '');
    });

    it('EmptyDialogInitialTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build([
            { key: 'd0', initial: '', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0'}]}
            ]);
        }, /mandatory/, '');
    });

    it('MissingStateKeyTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build(<any> [
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0'},
                { route: 'd0s1', title: 's1' }]}
            ]);
        });
    });

    it('EmptyStateKeyTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build([
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0'},
                { key: '', route: 'd0s1', title: 's1' }]}
            ]);
        });
    });

    it('MissingTransitionKeyTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build(<any> [
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0', transitions: [
                    { to: 's1' }]},
                { key: 's1', route: 'd0s1', title: 's1' }]}
            ])
        });
    });

    it('EmptyTransitionKeyTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build([
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0', transitions: [
                    { key: '', to: 's1' }]},
                { key: 's1', route: 'd0s1', title: 's1' }]}
            ])
        });
    });

    it('MissingTransitionToTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build(<any> [
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0', transitions: [
                    { key: 't0' }]},
                { key: 's1', route: 'd0s1', title: 's1' }]}
            ])
        }, /mandatory/, '');
    });

    it('EmptyTransitionToTest', function () {
        assert.throws(() => {
            Navigation.StateInfoConfig.build([
            { key: 'd0', initial: 's0', title: 'd0', states: [
                { key: 's0', route: 'd0s0', title: 's0', transitions: [
                    { key: 't0', to: '' }]},
                { key: 's1', route: 'd0s1', title: 's1' }]}
            ])
        }, /mandatory/, '');
    });
 });