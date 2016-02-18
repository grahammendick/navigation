/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
import Navigation = require('../src/Navigation');

describe('StateConfigTest', function () {
    describe('State', function () {
        it('should configure States', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0', title: 't0' },
                { key: 's1', route: 'r1', title: 't1' }
            ]);
            var state0 = stateController.states['s0'];
            var state1 = stateController.states['s1'];
            assert.equal(state0.key, 's0');
            assert.equal(state0.title, 't0');
            assert.equal(state1.key, 's1');
            assert.equal(state1.title, 't1');
        })
    });

    describe('Track Crumb Trail', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: false },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            assert.equal(stateController.states['s0'].trackCrumbTrail, false);
            assert.equal(stateController.states['s1'].trackCrumbTrail, false);
            assert.equal(stateController.states['s2'].trackCrumbTrail, true);
        })
    });

    describe('Defaults', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }
            ]);
            assert.strictEqual(stateController.states['s'].defaults['string'], 'Hello');
            assert.strictEqual(stateController.states['s'].defaults['_bool'], true);
            assert.strictEqual(stateController.states['s'].defaults['number'], 1);
        })
    });

    describe('Default Types', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', defaultTypes: { 'string': 'string', 'number': 'number', 'boolean': 'boolean' } }
            ]);
            assert.strictEqual(stateController.states['s'].defaultTypes['string'], 'string');
            assert.strictEqual(stateController.states['s'].defaultTypes['boolean'], 'boolean');
            assert.strictEqual(stateController.states['s'].defaultTypes['number'], 'number');
        })
    });

    describe('Attributes', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', handler: 'y' }
            ]);
            assert.equal(stateController.states['s']['handler'], 'y');
        })
    });

    describe('Route', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{string}/{number}' }
            ]);
            assert.equal(stateController.states['s0'].route, 'r0');
            assert.equal(stateController.states['s1'].route, 'r1/{string}/{number}');
        })
    });

    describe('Default Types String', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', defaults: { ' &s0': 'a', s1: 'b', s2: 'c', s3: 'd' }, defaultTypes: { s1: 'string', s2: 'boolean' } }
            ]);
            var defaults = stateController.states['s'].defaults;
            assert.strictEqual(defaults[' &s0'], 'a');
            assert.strictEqual(defaults['s1'], 'b');
            assert.strictEqual(defaults['s2'], 'c');
            assert.strictEqual(defaults['s3'], 'd');
        })
    });

    describe('Default Types Bool', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', defaults: { b1: true, b2: false, b3: true }, defaultTypes: { b1: 'boolean', b2: 'number' } }
            ]);
            var defaults = stateController.states['s'].defaults;
            assert.strictEqual(defaults['b1'], true);
            assert.strictEqual(defaults['b2'], false);
            assert.strictEqual(defaults['b3'], true);
        })
    });

    describe('Default Types Number', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', defaults: { n1: 0, n2: 1, n3: 2 }, defaultTypes: { n1: 'number', n2: 'date' } }
            ]);
            var defaults = stateController.states['s'].defaults;
            assert.strictEqual(defaults['n1'], 0);
            assert.strictEqual(defaults['n2'], 1);
            assert.strictEqual(defaults['n3'], 2);
        })
    });

    describe('Default Types Date', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', defaults: { d1: new Date(2010, 3, 7), d2: new Date(2011, 7, 3), d3: new Date(2012, 8, 4) }, defaultTypes: { d1: 'date', d2: 'string' } }
            ]);
            var defaults = stateController.states['s'].defaults;
            assert.strictEqual(+defaults['d1'], +new Date(2010, 3, 7));
            assert.strictEqual(+defaults['d2'], +new Date(2011, 7, 3));
            assert.strictEqual(+defaults['d3'], +new Date(2012, 8, 4));
        })
    });

    describe('Default Types String Array', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', defaults: { s0: ['a', 'b'], s1: ['c', 'd'], s2: ['e'] }, defaultTypes: { s1: 'stringarray', s2: 'boolean' } }
            ]);
            var defaults = stateController.states['s'].defaults;
            assert.strictEqual(defaults['s0'][0], 'a');
            assert.strictEqual(defaults['s0'][1], 'b');
            assert.strictEqual(defaults['s1'][0], 'c');
            assert.strictEqual(defaults['s1'][1], 'd');
            assert.strictEqual(defaults['s2'][0], 'e');
        })
    });

    describe('Default Types Bool Array', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', defaults: { b0: [true, false], b1: [false, true], b2: [true] }, defaultTypes: { b1: 'booleanarray', b2: 'number' } }
            ]);
            var defaults = stateController.states['s'].defaults;
            assert.strictEqual(defaults['b0'][0], true);
            assert.strictEqual(defaults['b0'][1], false);
            assert.strictEqual(defaults['b1'][0], false);
            assert.strictEqual(defaults['b1'][1], true);
            assert.strictEqual(defaults['b2'][0], true);
        })
    });

    describe('Default Types Number Array', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', defaults: { n0: [0, 1], n1: [2, 3], n2: [4] }, defaultTypes: { n1: 'numberarray', n2: 'date' } }
            ]);
            var defaults = stateController.states['s'].defaults;
            assert.strictEqual(defaults['n0'][0], 0);
            assert.strictEqual(defaults['n0'][1], 1);
            assert.strictEqual(defaults['n1'][0], 2);
            assert.strictEqual(defaults['n1'][1], 3);
            assert.strictEqual(defaults['n2'][0], 4);
        })
    });

    describe('Default Types Date Array', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r', defaults: { d0: [new Date(2010, 3, 7), new Date(2011, 7, 3)], d1: [new Date(2011, 7, 3), new Date(2010, 3, 7)], d2: [new Date(2012, 8, 4)] }, defaultTypes: { d1: 'datearray', d2: 'string' } }
            ]);
            var defaults = stateController.states['s'].defaults;
            assert.strictEqual(+defaults['d0'][0], +new Date(2010, 3, 7));
            assert.strictEqual(+defaults['d0'][1], +new Date(2011, 7, 3));
            assert.strictEqual(+defaults['d1'][0], +new Date(2011, 7, 3));
            assert.strictEqual(+defaults['d1'][1], +new Date(2010, 3, 7));
            assert.strictEqual(+defaults['d2'][0], +new Date(2012, 8, 4));
        })
    });

    describe('Invalid Default', function () {
        it('should throw error', function() {
            assert.throws(() => {
                var stateController = new Navigation.StateController([
                    { key: 's0', route: 'd0s0', defaults: { s: {} },  title: 's0'}
                ]);
            });
        })
   });

    describe('Invalid Default Type', function () {
        it('should throw error', function() {
            assert.throws(() => {
                var stateController = new Navigation.StateController([
                    { key: 's0', route: 'd0s0', defaultTypes: { s: 'x' },  title: 's0'}
                ]);
            });
        })
   });

    describe('Duplicate State', function () {
        it('should throw error', function() {
            assert.throws(() => {
                var stateController = new Navigation.StateController([
                    { key: 's0', route: 'd0s0', title: 's0'},
                    { key: 's0', route: 'd0s0', title: 's0' }
                ]);
            });
        })
    });

    describe('Missing State Key', function () {
        it('should throw error', function() {
            assert.throws(() => {
                var stateController = new Navigation.StateController(<any> [
                    { key: 's0', route: 'd0s0', title: 's0'},
                    { route: 'd0s1', title: 's1' }
                ]);
            });
        })
    });

    describe('Empty State Key', function () {
        it('should throw error', function() {
            assert.throws(() => {
                var stateController = new Navigation.StateController([
                    { key: 's0', route: 'd0s0', title: 's0'},
                    { key: '', route: 'd0s1', title: 's1' }
                ]);
            });
        })
    });

    describe('Reload Error', function () {
        it('should keep State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            try {
                var stateController = new Navigation.StateController(<any> [
                    { route: 'xxx' }
                ]);
            } catch(e) {
            }
            var state0 = stateController.states['s0'];
            var state1 = stateController.states['s1'];
            var state2 = stateController.states['s2'];
            assert.equal(Object.keys(stateController.states).length, 3);
            assert.equal(state0.key, 's0');
            assert.equal(state0.route, 'r0');
            assert.equal(state1.key, 's1');
            assert.equal(state1.route, 'r1');
            assert.equal(state2.key, 's2');
            assert.equal(state2.route, 'r2');
        })
    });

    describe('Reload', function () {
        it('should configure State Info', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
            stateController.configure([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var state0 = stateController.states['s0'];
            var state1 = stateController.states['s1'];
            var state2 = stateController.states['s2'];
            assert.equal(Object.keys(stateController.states).length, 3);
            assert.equal(state0.key, 's0');
            assert.equal(state0.route, 'r0');
            assert.equal(state1.key, 's1');
            assert.equal(state1.route, 'r1');
            assert.equal(state2.key, 's2');
            assert.equal(state2.route, 'r2');
        })
    });

    describe('Two Controllers', function () {
        it('should configure State Info', function() {
            var stateController0 = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
            var stateController1 = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var state = stateController0.states['s'];
            assert.equal(state.key, 's');
            assert.equal(state.route, 'r');
            var state0 = stateController1.states['s0'];
            var state1 = stateController1.states['s1'];
            var state2 = stateController1.states['s2'];
            assert.equal(state0.key, 's0');
            assert.equal(state0.route, 'r0');
            assert.equal(state1.key, 's1');
            assert.equal(state1.route, 'r1');
            assert.equal(state2.key, 's2');
            assert.equal(state2.route, 'r2');
        })
    });
 });