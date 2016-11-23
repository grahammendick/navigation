/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import * as assert from 'assert';
import { StateNavigator } from '../src/Navigation';

describe('Fluent', function () {
    describe('State', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s')
                .url;
            assert.strictEqual(url, '/r');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Second State', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's', route: 'r' }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s')
                .url;
            assert.strictEqual(url, '/r');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('State With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s')
                .url;
            assert.strictEqual(url, '/r');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Invalid State', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            assert.throws(() =>  stateNavigator.fluent().navigate('s0'), /is not a valid State/);
        });
    });

    describe('Transition', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .url;
            assert.strictEqual(url, '/r1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Transition With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('State State', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s')
                .navigate('s')
                .url;
            assert.strictEqual(url, '/r');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('State State With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s')
                .navigate('s')
                .url;
            assert.strictEqual(url, '/r');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Null State', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            assert.throws(() =>  stateNavigator.fluent().navigate(null), /is not a valid State/);
        });
    });

    describe('Transition From Without Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0', trackCrumbTrail: false },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Transition With Trail Transition With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .url;
            assert.strictEqual(url, '/r2?crumb=%2Fr0&crumb=%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Transition Transition', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .url;
            assert.strictEqual(url, '/r2');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Refresh With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .refresh()
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Refresh', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .refresh()
                .url;
            assert.strictEqual(url, '/r1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Back With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(1)
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Back', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(1)
                .url;
            assert.strictEqual(url, '/r1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Back Two With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigate('s3')
                .navigate('s4')
                .navigateBack(2)
                .url;
            assert.strictEqual(url, '/r2?crumb=%2Fr0&crumb=%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Back Two', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigate('s3')
                .navigate('s4')
                .navigateBack(2)
                .url;
            assert.strictEqual(url, '/r2');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Back One By One With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigate('s3')
                .navigateBack(1)
                .navigateBack(1)
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Back One By One', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigate('s3')
                .navigateBack(1)
                .navigateBack(1)
                .url;
            assert.strictEqual(url, '/r1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Invalid Back With Trail', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var fluent = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2');
            assert.throws(() => fluent.navigateBack(3));
        });
    });

    describe('Invalid Back', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' }
            ]);
            var fluent = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2');
            assert.throws(() => fluent.navigateBack(1));
        });
    });

    describe('Back Invalid Back With Trail', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var fluent = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(1);
            assert.throws(() => fluent.navigateBack(2));
        });
    });

    describe('Back Invalid Back', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var fluent = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(1);
            assert.throws(() => fluent.navigateBack(1));
        });
    });

    describe('Back Refresh With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(1)
                .refresh()
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Back Refresh', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(1)
                .refresh()
                .url;
            assert.strictEqual(url, '/r1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Back Refresh Transition With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(1)
                .refresh()
                .navigate('s3')
                .url;
            assert.strictEqual(url, '/r3?crumb=%2Fr0&crumb=%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Back Refresh Transition With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(1)
                .refresh()
                .navigate('s3')
                .url;
            assert.strictEqual(url, '/r3?crumb=%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });
});
