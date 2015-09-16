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
        it('should configure State Info', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', title: 't0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's1', title: 't1', states: [
                    { key: 's1', route: 'r1' }]}
                ]);
            var dialog0 = Navigation.StateInfoConfig._dialogs[0];
            var dialog1 = (<any> Navigation.StateInfoConfig.dialogs).d1;
            assert.equal(Navigation.StateInfoConfig._dialogs.length, 2);
            assert.equal(dialog0.key, 'd0');
            assert.equal(dialog0.title, 't0');
            assert.equal(dialog0.index, 0);
            assert.equal(dialog0.initial.key, 's0');
            assert.equal(dialog1.key, 'd1');
            assert.equal(dialog1.title, 't1');
            assert.equal(dialog1.index, 1);
            assert.equal(dialog1.initial.key, 's1');
        })
    });

    describe('State', function () {
        it('should configure State Info', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', title: 't0', transitions: [
                        { key: 't', to: 's1' }]},
                    { key: 's1', route: 'r1', title: 't1' }]}
                ]);
            var dialog = Navigation.StateInfoConfig._dialogs[0];
            var state0: State = dialog._states[0];
            var state1 = (<any> dialog.states).s1; 
            assert.equal(dialog._states.length, 2);
            assert.equal(state0.key, 's0');
            assert.equal(state0.route, 'r0');
            assert.equal(state0.title, 't0');
            assert.equal(state0.index, 0);
            assert.equal(state1.key, 's1');
            assert.equal(state1.route, 'r1');
            assert.equal(state1.title, 't1');
            assert.equal(state1.index, 1);
        })
    });

    describe('Transition', function () {
        it('should configure State Info', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', title: 't0', transitions: [
                        { key: 't0', to: 's1' },
                        { key: 't1', to: 's2' }]},
                    { key: 's1', route: 'r1', title: 't1' },
                    { key: 's2', route: 'r2', title: 't2' }]}
                ]);
            var dialog = Navigation.StateInfoConfig._dialogs[0];
            var state = dialog._states[0];
            var transition0 = state._transitions[0];
            var transition1 = (<any> state.transitions).t1;
            assert.equal(state._transitions.length, 2);
            assert.equal(transition0.key, 't0');
            assert.equal(transition0.index, 0);
            assert.equal(transition1.key, 't1');
            assert.equal(transition1.index, 1);
        })
    });

    describe('Dialog Initial', function () {
        it('should configure State Info', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            var dialog = Navigation.StateInfoConfig._dialogs[0];
            assert.equal(dialog.initial, dialog._states[0]);
        })
    });

    describe('Dialog Attributes', function () {
        it('should configure State Info', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', other: true, path: ' x', states: [
                    { key: 's', route: 'r' }]}
                ]);
            assert.equal(Navigation.StateInfoConfig._dialogs[0]['other'], true);
            assert.equal(Navigation.StateInfoConfig._dialogs[0]['path'], ' x');
        })
    });

    describe('State Parent', function () {
        it('should configure State Info', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', other: true, path: ' x', states: [
                    { key: 's', route: 'r' }]}
                ]);
            var dialog = Navigation.StateInfoConfig._dialogs[0];
            assert.equal(dialog._states[0].parent, dialog);
        })
    });

    describe('Transition Parent', function () {
        it('should configure State Info', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var dialog = Navigation.StateInfoConfig._dialogs[0];
            var state = dialog._states[0];
            assert.equal(state._transitions[0].parent, state);
        })
    });

    describe('Transition To', function () {
        it('should configure State Info', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var dialog = Navigation.StateInfoConfig._dialogs[0];
            var state = dialog._states[0];
            assert.equal(state._transitions[0].to, dialog.states['s1']);
        })
    });

    describe('Track Crumb Trail', function () {
        it('should configure State Info', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' },
                        { key: 't1', to: 's2' }]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false },
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            assert.equal(Navigation.StateInfoConfig._dialogs[0]._states[0].trackCrumbTrail, true);
            assert.equal(Navigation.StateInfoConfig._dialogs[0]._states[1].trackCrumbTrail, false);
            assert.equal(Navigation.StateInfoConfig._dialogs[0]._states[2].trackCrumbTrail, true);
        })
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