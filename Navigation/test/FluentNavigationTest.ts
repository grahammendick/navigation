import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';

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
            assert.strictEqual(url, '/r?crumb=%2Fr');
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
            assert.strictEqual(url, '/r1?crumb=%2Fr0&crumb=%2Fr1');
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
            assert.strictEqual(url, '/r1?crumb=%2Fr0&crumb=%2Fr1');
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
            assert.strictEqual(url, '/r3?crumb=%2Fr0&crumb=%2Fr1&crumb=%2Fr1');
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

    describe('Transition Transition With Trail', function () {
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
                .url;
            assert.strictEqual(url, '/r2?crumb=%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Crumb Trail', function () {
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
                .url;
            assert.strictEqual(url, '/r4?crumb=%2Fr0&crumb=%2Fr1&crumb=%2Fr2&crumb=%2Fr3');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('State State Custom Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true },
            ]);
            var state = stateNavigator.states['s'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
            var url = stateNavigator.fluent()
                .navigate('s')
                .navigate('s')
                .url;
            assert.strictEqual(url, '/r');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Transition State State', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s1')
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0&crumb=%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Transition State State Custom Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => crumbs.slice(-1);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s1')
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('State State Back', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s')
                .navigate('s')
                .navigateBack(1)
                .url;
            assert.strictEqual(url, '/r');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Transition State State Back', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s1')
                .navigateBack(1)
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('State State Back Two', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(2)
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('State State Back Two Custom Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => crumbs.slice(0, 1);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(2)
                .url;
            assert.strictEqual(url, '/r0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('State State Back One By One', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(1)
                .navigateBack(1)
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('State State Back One By One Custom Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => crumbs.slice(0, 1);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s1')
                .navigate('s2')
                .navigateBack(1)
                .navigateBack(1)
                .url;
            assert.strictEqual(url, '/r0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Reload Dialog', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.configure([
                { key: 's1', route: 'r' }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s1')
                .url;
            assert.strictEqual(url, '/r');
            assert.strictEqual(stateNavigator.stateContext.state.key, 's0');
        });
    });

    describe('Reload Transition', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.stateContext.clear();
            stateNavigator.configure([
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

    describe('Reload Refresh', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.stateContext.clear();
            stateNavigator.configure([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .refresh()
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0&crumb=%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Reload Back', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.stateContext.clear();
            stateNavigator.configure([
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

    describe('Reload Error State', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            try {
                stateNavigator.configure([<any>
                    { key: '' }
                ]);
            } catch(e) {
            }
            var url = stateNavigator.fluent()
                .navigate('s')
                .url;
            assert.strictEqual(url, '/r');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Reload Error Transition', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            try {
                stateNavigator.configure([<any>
                    { key: '' }
                ]);
            } catch(e) {
            }
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Reload Error Refresh', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            try {
                stateNavigator.configure([<any>
                    { key: '' }
                ]);
            } catch(e) {
            }
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .refresh()
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0&crumb=%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Reload Error Back', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            try {
                stateNavigator.configure([<any>
                    { key: '' }
                ]);
            } catch(e) {
            }
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

    describe('Two Controllers Dialog', function () {
        it('should navigate', function() {
            var stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r0' }
            ]);
            var stateNavigator1 = new StateNavigator([
                { key: 's1', route: 'r1' }
            ]);
            var url0 = stateNavigator0.fluent()
                .navigate('s0')
                .url;
            var url1 = stateNavigator1.fluent()
                .navigate('s1')
                .url;
            assert.strictEqual(url0, '/r0');
            assert.strictEqual(url1, '/r1');
            assert.strictEqual(stateNavigator0.stateContext.url, null);
            assert.strictEqual(stateNavigator1.stateContext.url, null);
        });
    });

    describe('Two Controllers Transition', function () {
        it('should navigate', function() {
            var stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var stateNavigator1 = new StateNavigator([
                { key: 's2', route: 'r2' },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            var fluent0 = stateNavigator0.fluent()
                .navigate('s0');
            var fluent1 = stateNavigator1.fluent()
                .navigate('s2');
            var url0 = fluent0
                .navigate('s1')
                .url;
            var url1 = fluent1
                .navigate('s3')
                .url;
            assert.strictEqual(url0, '/r1?crumb=%2Fr0');
            assert.strictEqual(url1, '/r3?crumb=%2Fr2');
            assert.strictEqual(stateNavigator0.stateContext.url, null);
            assert.strictEqual(stateNavigator1.stateContext.url, null);
        });
    });

    describe('Two Controllers Refresh', function () {
        it('should navigate', function() {
            var stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var stateNavigator1 = new StateNavigator([
                { key: 's2', route: 'r2' },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            var fluent0 = stateNavigator0.fluent()
                .navigate('s0');
            var fluent1 = stateNavigator1.fluent()
                .navigate('s2');
            fluent0 = fluent0
                .navigate('s1');
            fluent1 = fluent1
                .navigate('s3');
            var url0 = fluent0
                .refresh()
                .url;
            var url1 = fluent1
                .refresh()
                .url;
            assert.strictEqual(url0, '/r1?crumb=%2Fr0&crumb=%2Fr1');
            assert.strictEqual(url1, '/r3?crumb=%2Fr2&crumb=%2Fr3');
            assert.strictEqual(stateNavigator0.stateContext.url, null);
            assert.strictEqual(stateNavigator1.stateContext.url, null);
        });
    });

    describe('Two Controllers Back', function () {
        it('should navigate', function() {
            var stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var stateNavigator1 = new StateNavigator([
                { key: 's3', route: 'r3' },
                { key: 's4', route: 'r4', trackCrumbTrail: true },
                { key: 's5', route: 'r5', trackCrumbTrail: true }
            ]);
            var fluent0 = stateNavigator0.fluent()
                .navigate('s0');
            var fluent1 = stateNavigator1.fluent()
                .navigate('s3');
            fluent0 = fluent0
                .navigate('s1');
            fluent1 = fluent1
                .navigate('s4');
            fluent0 = fluent0
                .navigate('s2');
            fluent1 = fluent1
                .navigate('s5');
            var url0 = fluent0
                .navigateBack(1)
                .url;
            var url1 = fluent1
                .navigateBack(1)
                .url;
            assert.strictEqual(url0, '/r1?crumb=%2Fr0');
            assert.strictEqual(url1, '/r4?crumb=%2Fr3');
            assert.strictEqual(stateNavigator0.stateContext.url, null);
            assert.strictEqual(stateNavigator1.stateContext.url, null);
        });
    });

    describe('Crumb Trail Route Param', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{crumb?}', trackCrumbTrail: true },
                { key: 's2', route: 'r2/{crumb?}', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .url;
            assert.strictEqual(url, '/r2/%2Fr01-%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Crumb Trail Route Splat Param', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{*crumb?}', trackCrumbTrail: true },
                { key: 's2', route: 'r2/{*crumb?}', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .url;
            assert.strictEqual(url, '/r2/%2Fr0/%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Crumb Trail Mixed Param', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2/{*crumb?}', trackCrumbTrail: true },
                { key: 's3', route: 'r3/{crumb?}', trackCrumbTrail: true }
            ]);
            var fluent = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2');
            var s2Url = fluent.url;
            var s3Url = fluent
                .navigate('s3')
                .url;
            assert.strictEqual(s2Url, '/r2/%2Fr0/%2Fr1');
            assert.strictEqual(s3Url, '/r3/%2Fr01-%2Fr11-%2Fr2');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Crumb Trail Key', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: 'trail' }
            ]);
            var fluent = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2');
            var s2Url = fluent.url;
            var s1Url = fluent
                .navigateBack(1)
                .url;
            assert.strictEqual(s1Url, '/r1?crumb=%2Fr0');
            assert.strictEqual(s2Url, '/r2?trail=%2Fr0&trail=%2Fr1');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Refresh Back', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .refresh()
                .navigateBack(1)
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Refresh Back Custom Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => crumbs.slice(0, 1);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .refresh()
                .navigateBack(1)
                .url;
            assert.strictEqual(url, '/r0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Crumb Trail Encode', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.urlEncode = (state, key, val) => {
                return encodeURIComponent(val).replace('%2F', '/');
            }
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .url;
            assert.strictEqual(url, '/r1?crumb=/r0');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Repeated States With Trail', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
            ]);
            var url = stateNavigator.fluent()
                .navigate('s0')
                .navigate('s1')
                .navigate('s2')
                .navigate('s3')
                .navigate('s1')
                .url;
            assert.strictEqual(url, '/r1?crumb=%2Fr0&crumb=%2Fr1&crumb=%2Fr2&crumb=%2Fr3');
            assert.strictEqual(stateNavigator.stateContext.url, null);
        });
    });

    describe('Invalid Context', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var fluent = stateNavigator.fluent()
                .navigate('s0');
            fluent.navigate('s1');
            assert.throws(() => fluent.navigateBack(1));
        });
    });
});
