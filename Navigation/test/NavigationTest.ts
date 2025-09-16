import * as assert from 'assert';
import { StateNavigator, StateContext, HashHistoryManager, HTML5HistoryManager } from 'navigation';

describe('Navigation', function () {
    describe('State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.history, false);
                assert.strictEqual(stateNavigator.stateContext.hash, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('State Hash', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s', undefined, 'f');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            assert.equal(stateNavigator.stateContext.hash, 'f');
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        });
    });

    describe('State Null Hash', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s', undefined, null);
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            assert.equal(stateNavigator.stateContext.url, '/r');
            assert.equal(stateNavigator.stateContext.hash, null);
        });
    });

    describe('State Empty Hash', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s', undefined, '');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            assert.equal(stateNavigator.stateContext.url, '/r');
            assert.equal(stateNavigator.stateContext.hash, null);
        });
    });

    describe('State Reserved Url Character Hash', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s', undefined, '*="/()\'-_+~@:?><.;[],{}!£$%^#&');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            assert.equal(stateNavigator.stateContext.hash, '*="/()\'-_+~@:?><.;[],{}!£$%^#&');
            assert.equal(stateNavigator.stateContext.url, '/r#*="/()\'-_+~@:?><.;[],{}!£$%^#&');
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        });
    });

    describe('Second State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('State With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('History State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link, undefined, true);
            });            
            test();
        });
        
        function test(){
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.history, true);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Not History State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link, undefined, true);
                link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.history, false);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('History Action State', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            assert.equal(stateNavigator.stateContext.historyAction, 'add');
        });
    });

    describe('History Action Add State', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s');
            stateNavigator.navigateLink(link, 'add');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            assert.equal(stateNavigator.stateContext.historyAction, 'add');
        });
    });

    describe('History Action Replace State', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s');
            stateNavigator.navigateLink(link, 'replace');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            assert.equal(stateNavigator.stateContext.historyAction, 'replace');
        });
    });

    describe('History Action None State', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s');
            stateNavigator.navigateLink(link, 'none');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            assert.equal(stateNavigator.stateContext.historyAction, 'none');
        });
    });

    describe('Invalid State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            it('should throw error', function(){
                assert.throws(() => stateNavigator.navigate('s0'), /is not a valid State/);
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function(){
                assert.throws(() => stateNavigator.getNavigationLink('s0'), /is not a valid State/);
            });
        });
    });

    describe('Transition', function() {
        var stateNavigator: StateNavigator;
        var stateContext: StateContext;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateContext = stateNavigator.stateContext;
                stateNavigator.navigate('s1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                stateContext = stateNavigator.stateContext;
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.strictEqual(stateNavigator.stateContext.hash, null);
                assert.equal(stateNavigator.stateContext.url, '/r1');
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
                assert.strictEqual(stateNavigator.stateContext.oldHash, null);
                assert.equal(stateNavigator.stateContext.oldUrl, '/r0');
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.strictEqual(stateNavigator.stateContext.previousHash, null);
                assert.equal(stateNavigator.stateContext.previousUrl, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
            it('should not mutate context', function() {
                assert.notStrictEqual(stateNavigator.stateContext, stateContext);
            });
        }
    });

    describe('Transition Hash', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1', undefined, 'f');
            stateNavigator.navigateLink(link);
        
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.hash, 'f');
            assert.equal(stateNavigator.stateContext.url, '/r1#f');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
            assert.strictEqual(stateNavigator.stateContext.oldHash, null);
            assert.equal(stateNavigator.stateContext.oldUrl, '/r0');
            assert.equal(stateNavigator.stateContext.previousState, null);
            assert.strictEqual(stateNavigator.stateContext.previousHash, null);
            assert.equal(stateNavigator.stateContext.previousUrl, null);
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        });
    });

    describe('Hash Transition', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0', undefined, 'f');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            assert.strictEqual(stateNavigator.stateContext.hash, null);
            assert.equal(stateNavigator.stateContext.url, '/r1');
            assert.equal(stateNavigator.stateContext.oldHash, 'f');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r0#f');
            assert.strictEqual(stateNavigator.stateContext.previousHash, null);
            assert.equal(stateNavigator.stateContext.previousUrl, null);
        });
    });

    describe('Hash Transition Hash', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0', undefined, 'f0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1', undefined, 'f1');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.hash, 'f1');
            assert.equal(stateNavigator.stateContext.url, '/r1#f1');
            assert.equal(stateNavigator.stateContext.oldHash, 'f0');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r0#f0');
            assert.strictEqual(stateNavigator.stateContext.previousHash, null);
            assert.equal(stateNavigator.stateContext.previousUrl, null);
        });
    });

    describe('Transition With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.hash, null);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.oldHash, null);
                assert.equal(stateNavigator.stateContext.oldUrl, '/r0');
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.previousHash, null);
                assert.equal(stateNavigator.stateContext.previousUrl, '/r0');
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Transition Hash With Trail', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1', null, 'f');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.hash, 'f');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
            assert.strictEqual(stateNavigator.stateContext.oldHash, null);
            assert.equal(stateNavigator.stateContext.oldUrl, '/r0');
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.strictEqual(stateNavigator.stateContext.previousHash, null);
            assert.equal(stateNavigator.stateContext.previousUrl, '/r0');
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
        });
    });

    describe('Hash Transition With Trail', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var link = stateNavigator.getNavigationLink('s0', null, 'f');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.strictEqual(stateNavigator.stateContext.hash, null);
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.oldHash, 'f');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r0#f');
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.previousHash, 'f');
            assert.equal(stateNavigator.stateContext.previousUrl, '/r0#f');
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
        });
    });

    describe('Hash Transition Hash With Trail', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var link = stateNavigator.getNavigationLink('s0', null, 'f0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1', null, 'f1');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.hash, 'f1');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.oldHash, 'f0');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r0#f0');
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.previousHash, 'f0');
            assert.equal(stateNavigator.stateContext.previousUrl, '/r0#f0');
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
        });
    });

    describe('State State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('State State With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });
            test();            
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });
    

    describe('Null State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            it('should throw error', function() {
                assert.throws(() => stateNavigator.navigate(null), /is not a valid State/);            
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function() {
                assert.throws(() => stateNavigator.getNavigationLink(null), /is not a valid State/);
            });
        });
    });
    
    describe('Transition From Without Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0', trackCrumbTrail: false },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                var link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Transition With Trail Transition With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs[1].state, stateNavigator.states['s1']);
                assert.ok(!stateNavigator.stateContext.crumbs[0].last);
                assert.ok(stateNavigator.stateContext.crumbs[1].last);
            });
        }
    });
    
    describe('Transition Transition', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldUrl, '/r1');
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.equal(stateNavigator.stateContext.previousUrl, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Refresh With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Refresh Hash With Trail', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getRefreshLink(null, 'f');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.hash, 'f');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
            assert.strictEqual(stateNavigator.stateContext.oldHash, null);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.strictEqual(stateNavigator.stateContext.previousHash, null);
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
            assert.strictEqual(stateNavigator.stateContext.crumbs[0].hash, null);
            assert.ok(stateNavigator.stateContext.crumbs[0].last);
        });
    });

    describe('Refresh', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Refresh Hash', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getRefreshLink(null, 'f');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.url, '/r1#f');
            assert.equal(stateNavigator.stateContext.hash, 'f');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
            assert.strictEqual(stateNavigator.stateContext.oldHash, null);
            assert.equal(stateNavigator.stateContext.previousState, null);
            assert.strictEqual(stateNavigator.stateContext.previousHash, null);
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        });
    });

    describe('Hash Refresh', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1', null, 'f');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getRefreshLink(null);
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.url, '/r1');
            assert.equal(stateNavigator.stateContext.hash, null);
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.oldUrl, '/r1#f');
            assert.strictEqual(stateNavigator.stateContext.oldHash, 'f');
            assert.equal(stateNavigator.stateContext.previousState, null);
            assert.equal(stateNavigator.stateContext.previousUrl, null);
            assert.strictEqual(stateNavigator.stateContext.previousHash, null);
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        });
    });

    describe('Refresh Null Hash', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getRefreshLink(null, null);
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.url, '/r1');
            assert.equal(stateNavigator.stateContext.hash, null);
        });
    });

    describe('Refresh Empty Hash', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getRefreshLink(null, '');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.url, '/r1');
            assert.equal(stateNavigator.stateContext.hash, null);
        });
    });

    describe('Refresh Reserved Url Character Hash', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getRefreshLink(null, '*="/()\'-_+~@:?><.;[],{}!£$%^#&');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.hash, '*="/()\'-_+~@:?><.;[],{}!£$%^#&');
            assert.equal(stateNavigator.stateContext.url, '/r1#*="/()\'-_+~@:?><.;[],{}!£$%^#&');
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        });
    });

    describe('Back With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.oldUrl, '/r2?crumb=%2Fr0&crumb=%2Fr1');
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.previousUrl, '/r0');
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Hash Transition Hash Back With Trail', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var link = stateNavigator.getNavigationLink('s0', null, 'f0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s2', null, 'f2');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationBackLink(1);
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.strictEqual(stateNavigator.stateContext.hash, null);
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.oldHash, 'f2');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r2?crumb=%2Fr0%23f0&crumb=%2Fr1#f2');
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.previousHash, 'f0');
            assert.equal(stateNavigator.stateContext.previousUrl, '/r0#f0');
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.crumbs[0].hash, 'f0');
            assert.ok(stateNavigator.stateContext.crumbs[0].last);
        });
    });

    describe('Hash Hash Hash Back With Trail', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var link = stateNavigator.getNavigationLink('s0', null, 'f0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1', null, 'f1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s2', null, 'f2');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationBackLink(1);
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.strictEqual(stateNavigator.stateContext.hash, 'f1');
            assert.equal(stateNavigator.stateContext.url, '/r1?crumb=%2Fr0%23f0#f1');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.oldHash, 'f2');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r2?crumb=%2Fr0%23f0&crumb=%2Fr1%23f1#f2');
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.previousHash, 'f0');
            assert.equal(stateNavigator.stateContext.previousUrl, '/r0#f0');
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.crumbs[0].hash, 'f0');
            assert.ok(stateNavigator.stateContext.crumbs[0].last);
        });
    });

    describe('Hash Transition Hash Transition With Trail', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            var link = stateNavigator.getNavigationLink('s0', null, 'f0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s2', null, 'f2');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s3');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.crumbs[0].hash, 'f0');
            assert.strictEqual(stateNavigator.stateContext.crumbs[1].hash, null);
            assert.equal(stateNavigator.stateContext.crumbs[2].hash, 'f2');
            assert.equal(stateNavigator.stateContext.crumbs.length, 3);
        });
    });

    describe('Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Hash Hash Back', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1', null, 'f1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s2', null, 'f2');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationBackLink(1);
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.url, '/r1#f1');
            assert.equal(stateNavigator.stateContext.hash, 'f1');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.oldHash, 'f2');
            assert.equal(stateNavigator.stateContext.previousState, null);
            assert.equal(stateNavigator.stateContext.previousHash, null);
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        });
    });

    describe('Back Two With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigate('s4');
                stateNavigator.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s4');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(2);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s4']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 2);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs[1].state, stateNavigator.states['s1']);
                assert.ok(!stateNavigator.stateContext.crumbs[0].last);
                assert.ok(stateNavigator.stateContext.crumbs[1].last);
            });
        }
    });

    describe('Back Two', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigate('s4');
                stateNavigator.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s4');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(2);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s4']);
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.equal(stateNavigator.stateContext.previousUrl, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Back One By One With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigateBack(1);
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Back One By One', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigateBack(1);
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Can Navigate Back With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should navigate back 2', function() {
                assert.ok(!stateNavigator.canNavigateBack(0));
                assert.ok(stateNavigator.canNavigateBack(1));
                assert.ok(stateNavigator.canNavigateBack(2));
                assert.ok(!stateNavigator.canNavigateBack(3));
            });
        }
    });

    describe('Can Navigate Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should not navigate back', function() {
                assert.ok(!stateNavigator.canNavigateBack(0));
                assert.ok(!stateNavigator.canNavigateBack(1));
            });
        }
    });

    describe('Invalid Back With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
            });
            it('should throw error', function() {
                assert.throws(() => stateNavigator.navigateBack(3));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateNavigator.getNavigationBackLink(3), /distance parameter/);
            });
        });
    });

    describe('Invalid Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
            });
            it('should throw error', function() {
                assert.throws(() => stateNavigator.navigateBack(1));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateNavigator.getNavigationBackLink(1), /distance parameter/);
            });
        });
    });

    describe('Back Invalid Back With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            it('should throw error', function() {
                assert.throws(() => stateNavigator.navigateBack(2), /distance parameter/);
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateNavigator.getNavigationBackLink(2), /distance parameter/);
            });
        });
    });

    describe('Back Invalid Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            it('should throw error', function() {
                assert.throws(() => stateNavigator.navigateBack(1), /distance parameter/);
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateNavigator.getNavigationBackLink(1), /distance parameter/);
            });
        });
    });

    describe('Back Refresh With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
                stateNavigator.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Back Refresh', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
                stateNavigator.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Back Refresh Transition With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
                stateNavigator.refresh();
                stateNavigator.navigate('s3');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s3']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 2);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs[1].state, stateNavigator.states['s1']);
                assert.ok(!stateNavigator.stateContext.crumbs[0].last);
                assert.ok(stateNavigator.stateContext.crumbs[1].last);
            });
        }
    });

    describe('Back Refresh Transition', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
                stateNavigator.refresh();
                stateNavigator.navigate('s3');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s3']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s1']);
            });
        }
    });

    describe('Transition Transition With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s1']);
            });
        }
    });

    describe('Crumb Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigate('s4');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s4');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.url.match(/crumb/g).length, 4);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs[1].state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs[2].state, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.crumbs[3].state, stateNavigator.states['s3']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 4);
                assert.ok(!stateNavigator.stateContext.crumbs[0].last);
                assert.ok(!stateNavigator.stateContext.crumbs[1].last);
                assert.ok(!stateNavigator.stateContext.crumbs[2].last);
                assert.ok(stateNavigator.stateContext.crumbs[3].last);
            });
        }
    });

    describe('State State Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true },
            ]);
            var state = stateNavigator.states['s'];
            state.truncateCrumbTrail = (_state, _data, _crumbs) => [];
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Transition State State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateNavigator.stateContext.crumbs.length, 2);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs[1].state, stateNavigator.states['s1']);
            });
        }
    });

    describe('Transition State State Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (_state, _data, crumbs) => crumbs.slice(-1);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s1']);
            });
        }
    });

    describe('State State Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.navigate('s');
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Transition State State Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('State State Back Two', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(2);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('State State Back Two Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (_state, _data, crumbs) => crumbs.slice(0, 1);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(2);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('State State Back One By One', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('State State Back One By One Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (_state, _data, crumbs) => crumbs.slice(0, 1);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Bookmarked Link With Trail Navigate', function() {
        it ('should populate old and previous States', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigate('s2');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Bookmarked Link Navigate', function() {
        it ('should populate old but not previous States', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigate('s2');
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.previousState, null);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Bookmarked Link Clear Navigate', function() {
        it ('should populate previous but not old States', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigate('s2');
            stateNavigator.stateContext.clear();
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.oldState, undefined);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('State State Navigated', function () {
        it('should call all lifecycle functions apart from disposed', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s'].validate = () => { validate = true; return true; }
            stateNavigator.states['s'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s'].dispose = () => disposed = true;
            stateNavigator.states['s'].navigating = (_data, _url, navigate) => {
                navigating = true;
                navigate();
            }
            stateNavigator.states['s'].navigated = () => navigated = true;
            stateNavigator.navigate('s');
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        });
    });

    describe('State State Unloading', function () {
        it('should only call unloading function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s'].validate = () => { validate = true; return true; }
            stateNavigator.states['s'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s'].dispose = () => disposed = true;
            stateNavigator.states['s'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s'].navigated = () => navigated = true;
            stateNavigator.navigate('s');
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        });
    });

    describe('State State Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s'].validate = () => { validate = true; return true; }
            stateNavigator.states['s'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s'].dispose = () => disposed = true;
            stateNavigator.states['s'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s'].navigated = () => navigated = true;
            stateNavigator.navigate('s');
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        });
    });

    describe('State State Validate', function () {
        it('should only call validate function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s'].validate = () => { validate = true; return false; }
            stateNavigator.states['s'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s'].dispose = () => disposed = true;
            stateNavigator.states['s'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s'].navigated = () => navigated = true;
            try {
                stateNavigator.navigate('s');
            } catch(e) {
            }
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, undefined);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        });
    });

    describe('Transition Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s1'].validate = () => { validate = true; return true; }
            stateNavigator.states['s0'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s0'].dispose = () => disposed = true;
            stateNavigator.states['s1'].navigating = (_data, _url, navigate) => {
                navigating = true;
                navigate();
            }
            stateNavigator.states['s1'].navigated = () => navigated = true;
            stateNavigator.navigate('s1');
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Transition Unloading', function () {
        it('should only call unloading function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s1'].validate = () => { validate = true; return true; }
            stateNavigator.states['s0'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s0'].dispose = () => disposed = true;
            stateNavigator.states['s1'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s1'].navigated = () => navigated = true;
            stateNavigator.navigate('s1');
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });

    describe('Transition Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s1'].validate = () => { validate = true; return true; }
            stateNavigator.states['s0'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s0'].dispose = () => disposed = true;
            stateNavigator.states['s1'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s1'].navigated = () => navigated = true;
            stateNavigator.navigate('s1');
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });

    describe('Transition Validate', function () {
        it('should only call validate function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s1'].validate = () => { validate = true; return false; }
            stateNavigator.states['s0'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s0'].dispose = () => disposed = true;
            stateNavigator.states['s1'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s1'].navigated = () => navigated = true;
            try {
                stateNavigator.navigate('s1');
            } catch(e) {
            }
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, undefined);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });

    describe('Transition Navigating Navigate', function () {
        it('should populate State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            stateNavigator.states['s1'].navigating = (_data, _url, _navigate) => {
                stateNavigator.navigate('s2');
            }
            stateNavigator.navigate('s1');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Transition Transition Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return true; }
            stateNavigator.states['s1'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s1'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, navigate) => {
                navigating = true;
                navigate();
            }
            stateNavigator.states['s2'].navigated = () => navigated = true;
            stateNavigator.navigate('s2');
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Transition Transition Unloading', function () {
        it('should only call unloading function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return true; }
            stateNavigator.states['s1'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s1'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s2'].navigated = () => navigated = true;
            stateNavigator.navigate('s2');
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Transition Transition Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return true; }
            stateNavigator.states['s1'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s1'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s2'].navigated = () => navigated = true;
            stateNavigator.navigate('s2');
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Transition Transition Validate', function () {
        it('should only call validate function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return false; }
            stateNavigator.states['s1'].unloading = (_state, _data, _url, _unload) =>  unloading = true;
            stateNavigator.states['s1'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s2'].navigated = () => navigated = true;
            try {
                stateNavigator.navigate('s2');
            } catch(e) {
            }
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, undefined);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Refresh Navigated', function () {
        it('should call all lifecycle functions apart from disposed', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return true; }
            stateNavigator.states['s2'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s2'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, navigate) => {
                navigating = true;
                navigate();
            }
            stateNavigator.states['s2'].navigated = () => navigated = true;
            stateNavigator.refresh();
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Refresh Unloading', function () {
        it('should only call unloading function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return true; }
            stateNavigator.states['s2'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s2'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s2'].navigated = () => navigated = true;
            stateNavigator.refresh();
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Refresh Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return true; }
            stateNavigator.states['s2'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s2'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s2'].navigated = () => navigated = true;
            stateNavigator.refresh();
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Refresh Validate', function () {
        it('should only call validate function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return false; }
            stateNavigator.states['s2'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s2'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s2'].navigated = () => navigated = true;
            try {
                stateNavigator.refresh();
            } catch(e) {
            }
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, undefined);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Back One Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s0'].validate = () => { validate = true; return true; }
            stateNavigator.states['s1'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s1'].dispose = () => disposed = true;
            stateNavigator.states['s0'].navigating = (_data, _url, navigate) => {
                navigating = true;
                navigate();
            }
            stateNavigator.states['s0'].navigated = () => navigated = true;
            var link = stateNavigator.getNavigationBackLink(1);
            stateNavigator.navigateLink(link);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });

    describe('Back One Unloading', function () {
        it('should only call unloading function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s0'].validate = () => { validate = true; return true; }
            stateNavigator.states['s1'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s1'].dispose = () => disposed = true;
            stateNavigator.states['s0'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s0'].navigated = () => navigated = true;
            var link = stateNavigator.getNavigationBackLink(1);
            stateNavigator.navigateLink(link);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Back One Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s0'].validate = () => { validate = true; return true; }
            stateNavigator.states['s1'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s1'].dispose = () => disposed = true;
            stateNavigator.states['s0'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s0'].navigated = () => navigated = true;
            var link = stateNavigator.getNavigationBackLink(1);
            stateNavigator.navigateLink(link);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Back One Validate', function () {
        it('should only call validate function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s0'].validate = () => { validate = true; return false; }
            stateNavigator.states['s1'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s1'].dispose = () => disposed = true;
            stateNavigator.states['s0'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s0'].navigated = () => navigated = true;
            var link = stateNavigator.getNavigationBackLink(1);
            try {
                stateNavigator.navigateLink(link);
            } catch(e) {
            }
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, undefined);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Back Two Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            link = stateNavigator.getNavigationLink('s3');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s4');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return true; }
            stateNavigator.states['s4'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s4'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, navigate) => {
                navigating = true;
                navigate();
            }
            stateNavigator.states['s2'].navigated = () => navigated = true;
            stateNavigator.navigateBack(2);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Back Two Unloading', function () {
        it('should only call unloading function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            link = stateNavigator.getNavigationLink('s3');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s4');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return true; }
            stateNavigator.states['s4'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s4'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s2'].navigated = () => navigated = true;
            stateNavigator.navigateBack(2);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s4']);
        });
    });

    describe('Back Two Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            link = stateNavigator.getNavigationLink('s3');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s4');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return true; }
            stateNavigator.states['s4'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s4'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s2'].navigated = () => navigated = true;
            stateNavigator.navigateBack(2);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s4']);
        });
    });

    describe('Back Two Validate', function () {
        it('should only call validate function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            link = stateNavigator.getNavigationLink('s3');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s4');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s2'].validate = () => { validate = true; return false; }
            stateNavigator.states['s4'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s4'].dispose = () => disposed = true;
            stateNavigator.states['s2'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s2'].navigated = () => navigated = true;
            try{
                stateNavigator.navigateBack(2);
            } catch(e){
            }
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, undefined);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s4']);
        });
    });

    describe('Back One By One Navigated', function () {
        it('should twice call all lifecycle functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s1'].validate = () => { validate = true; return true; }
            stateNavigator.states['s2'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s2'].dispose = () => disposed = true;
            stateNavigator.states['s1'].navigating = (_data, _url, navigate) => {
                navigating = true;
                navigate();
            }
            stateNavigator.states['s1'].navigated = () => navigated = true;
            stateNavigator.navigateBack(1);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            validate = undefined;
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            stateNavigator.states['s0'].validate = () => { validate = true; return true; }
            stateNavigator.states['s1'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s1'].dispose = () => disposed = true;
            stateNavigator.states['s0'].navigating = (_data, _url, navigate) => {
                navigating = true;
                navigate();
            }
            stateNavigator.states['s0'].navigated = () => navigated = true;
            var link = stateNavigator.getNavigationBackLink(1);
            stateNavigator.navigateLink(link);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });

    describe('Back One By One Unloading', function () {
        it('should twice only call unloading function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s1'].validate = () => { validate = true; return true; }
            stateNavigator.states['s2'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s2'].dispose = () => disposed = true;
            stateNavigator.states['s1'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s1'].navigated = () => navigated = true;
            stateNavigator.navigateBack(1);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
            validate = undefined;
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            var link = stateNavigator.getNavigationBackLink(1);
            stateNavigator.navigateLink(link);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Back One By One Navigating', function () {
        it('should twice only call unloading and navigating functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s1'].validate = () => { validate = true; return true; }
            stateNavigator.states['s2'].unloading = (_state, _data, _url, unload) => {
                unloading = true;
                unload();
            }
            stateNavigator.states['s2'].dispose = () => disposed = true;
            stateNavigator.states['s1'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s1'].navigated = () => navigated = true;
            stateNavigator.navigateBack(1);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
            validate = undefined;
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            var link = stateNavigator.getNavigationBackLink(1);
            stateNavigator.navigateLink(link);
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Back One By One Valiate', function () {
        it('should twice only call validate function', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            var validate, unloading, disposed, navigating, navigated;
            stateNavigator.states['s1'].validate = () => { validate = true; return false; }
            stateNavigator.states['s2'].unloading = (_state, _data, _url, _unload) => unloading = true;
            stateNavigator.states['s2'].dispose = () => disposed = true;
            stateNavigator.states['s1'].navigating = (_data, _url, _navigate) => navigating = true;
            stateNavigator.states['s1'].navigated = () => navigated = true;
            try{
                stateNavigator.navigateBack(1);
            } catch(e) {
            }
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, undefined);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
            validate = undefined;
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            var link = stateNavigator.getNavigationBackLink(1);
            try {
                stateNavigator.navigateLink(link);
            } catch(e) {
            }
            assert.strictEqual(validate, true);
            assert.strictEqual(unloading, undefined);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Unloading Navigate', function () {
        it('should go to to State instead of initial State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3' }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s2');
            var disposed = 0, unloading, navigated10, navigated01;
            stateNavigator.states['s2'].unloading = (_state, _data, _url, unload) => {
                if (!unloading) {
                    unloading = true;
                    stateNavigator.navigateLink(link);
                } else {
                    unload();
                }
            }
            stateNavigator.states['s2'].dispose = () => disposed++;
            stateNavigator.states['s3'].navigated = () => navigated10 = true;
            stateNavigator.states['s1'].navigated = () => navigated01 = true;
            stateNavigator.navigate('s3');
            assert.strictEqual(disposed, 1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(navigated10, undefined);
            assert.strictEqual(navigated01, true);
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Navigating Navigate', function () {
        it('should go to to State instead of initial State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3' }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s2');
            var disposed = 0, navigating, navigated10, navigated01;
            stateNavigator.states['s2'].dispose = () => disposed++;
            stateNavigator.states['s3'].navigating = (_data, _url, _navigate) => {
                navigating = true;
                stateNavigator.navigateLink(link);
            }
            stateNavigator.states['s3'].navigated = () => navigated10 = true;
            stateNavigator.states['s1'].navigated = () => navigated01 = true;
            stateNavigator.navigate('s3');
            assert.strictEqual(disposed, 1);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated10, undefined);
            assert.strictEqual(navigated01, true);
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('On Before Navigate', function () {
        it('should call onBeforeNavigate listener', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateNavigator.navigate('s0');
            var beforeNavigateHandler = (state, _data, _url, _history, {state: oldState}) => {
                oldStates.push(oldState);
                states.push(state);
                return true;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            stateNavigator.offBeforeNavigate(beforeNavigateHandler);
            assert.equal(oldStates[0], stateNavigator.states['s0']);
            assert.equal(states[0], stateNavigator.states['s1']);
            assert.equal(oldStates[1], stateNavigator.states['s1']);
            assert.equal(states[1], stateNavigator.states['s2']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('On Navigate', function () {
        it('should call onNavigate listener', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateNavigator.navigate('s0');
            var navigatedHandler = (oldState, state, _data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateNavigator.onNavigate(navigatedHandler);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            stateNavigator.offNavigate(navigatedHandler);
            assert.equal(oldStates[0], stateNavigator.states['s0']);
            assert.equal(states[0], stateNavigator.states['s1']);
            assert.equal(oldStates[1], stateNavigator.states['s1']);
            assert.equal(states[1], stateNavigator.states['s2']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Duplicate On Before Navigate', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var oldStates = [];
            var states = [];
            stateNavigator.navigate('s');
            var beforeNavigateHandler = (state, _data, _url, _history, {state: oldState}) => {
                oldStates.push(oldState);
                states.push(state);
                return true;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler);
            assert.throws(() => stateNavigator.onBeforeNavigate(beforeNavigateHandler));
        });
    });

    describe('Duplicate On Navigate', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var oldStates = [];
            var states = [];
            stateNavigator.navigate('s');
            var navigatedHandler = (oldState, state, _data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateNavigator.onNavigate(navigatedHandler);
            assert.throws(() => stateNavigator.onNavigate(navigatedHandler));
        });
    });

    describe('Duplicate On Off Before Navigate', function () {
        it('should call onBeforeNavigate listener', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateNavigator.navigate('s0');
            var beforeNavigateHandler = (state, _data, _url, _history, {state: oldState}) => {
                oldStates.push(oldState);
                states.push(state);
                return true;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler);
            stateNavigator.offBeforeNavigate(beforeNavigateHandler);
            stateNavigator.onBeforeNavigate(beforeNavigateHandler);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            stateNavigator.offBeforeNavigate(beforeNavigateHandler);
            assert.equal(oldStates[0], stateNavigator.states['s0']);
            assert.equal(states[0], stateNavigator.states['s1']);
            assert.equal(oldStates[1], stateNavigator.states['s1']);
            assert.equal(states[1], stateNavigator.states['s2']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Duplicate On Off Navigate', function () {
        it('should call onNavigate listener', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateNavigator.navigate('s0');
            var navigatedHandler = (oldState, state, _data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateNavigator.onNavigate(navigatedHandler);
            stateNavigator.offNavigate(navigatedHandler);
            stateNavigator.onNavigate(navigatedHandler);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            stateNavigator.offNavigate(navigatedHandler);
            assert.equal(oldStates[0], stateNavigator.states['s0']);
            assert.equal(states[0], stateNavigator.states['s1']);
            assert.equal(oldStates[1], stateNavigator.states['s1']);
            assert.equal(states[1], stateNavigator.states['s2']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Copy On Before Navigate', function () {
        it('should call both onBeforeNavigate listeners', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateNavigator.navigate('s0');
            var beforeNavigateHandler1 = (state, _data, _url, _history, {state: oldState}) => {
                oldStates.push(oldState);
                states.push(state);
                return true;
            };
            var beforeNavigateHandler2 = (state, _data, _url, _history, {state: oldState}) => {
                oldStates.push(oldState);
                states.push(state);
                return true;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler1);
            stateNavigator.onBeforeNavigate(beforeNavigateHandler2);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            stateNavigator.offBeforeNavigate(beforeNavigateHandler1);
            stateNavigator.offBeforeNavigate(beforeNavigateHandler2);
            assert.equal(oldStates[0], stateNavigator.states['s0']);
            assert.equal(states[0], stateNavigator.states['s1']);
            assert.equal(oldStates[1], stateNavigator.states['s0']);
            assert.equal(states[1], stateNavigator.states['s1']);
            assert.equal(oldStates[2], stateNavigator.states['s1']);
            assert.equal(states[2], stateNavigator.states['s2']);
            assert.equal(oldStates[3], stateNavigator.states['s1']);
            assert.equal(states[3], stateNavigator.states['s2']);
            assert.equal(oldStates.length, 4);
            assert.equal(states.length, 4);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Copy On Navigate', function () {
        it('should call both onNavigate listeners', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateNavigator.navigate('s0');
            var navigatedHandler1 = (oldState, state, _data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            var navigatedHandler2 = (oldState, state, _data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateNavigator.onNavigate(navigatedHandler1);
            stateNavigator.onNavigate(navigatedHandler2);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            stateNavigator.offNavigate(navigatedHandler1);
            stateNavigator.offNavigate(navigatedHandler2);
            assert.equal(oldStates[0], stateNavigator.states['s0']);
            assert.equal(states[0], stateNavigator.states['s1']);
            assert.equal(oldStates[1], stateNavigator.states['s0']);
            assert.equal(states[1], stateNavigator.states['s1']);
            assert.equal(oldStates[2], stateNavigator.states['s1']);
            assert.equal(states[2], stateNavigator.states['s2']);
            assert.equal(oldStates[3], stateNavigator.states['s1']);
            assert.equal(states[3], stateNavigator.states['s2']);
            assert.equal(oldStates.length, 4);
            assert.equal(states.length, 4);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Multiple On Before Navigate', function () {
        it('should call multiple onBeforeNavigate listeners', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates1 = [];
            var states1 = [];
            var oldStates2 = [];
            var states2 = [];
            stateNavigator.navigate('s0');
            var beforeNavigateHandler1 = (state, _data, _url, _history, {state: oldState}) => {
                oldStates1.push(oldState);
                states1.push(state);
                return true;
            };
            var beforeNavigateHandler2 = (state, _data, _url, _history, {state: oldState}) => {
                oldStates2.push(oldState);
                states2.push(state);
                return true;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler1);
            stateNavigator.onBeforeNavigate(beforeNavigateHandler2);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            stateNavigator.offBeforeNavigate(beforeNavigateHandler1);
            stateNavigator.offBeforeNavigate(beforeNavigateHandler2);
            assert.equal(oldStates1[0], stateNavigator.states['s0']);
            assert.equal(states1[0], stateNavigator.states['s1']);
            assert.equal(oldStates2[0], stateNavigator.states['s0']);
            assert.equal(states2[0], stateNavigator.states['s1']);
            assert.equal(oldStates1[1], stateNavigator.states['s1']);
            assert.equal(states1[1], stateNavigator.states['s2']);
            assert.equal(oldStates2[1], stateNavigator.states['s1']);
            assert.equal(states2[1], stateNavigator.states['s2']);
            assert.equal(oldStates1.length, 2);
            assert.equal(states1.length, 2);
            assert.equal(oldStates2.length, 2);
            assert.equal(states2.length, 2);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Multiple On Navigate', function () {
        it('should call multiple onNavigate listeners', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates1 = [];
            var states1 = [];
            var oldStates2 = [];
            var states2 = [];
            stateNavigator.navigate('s0');
            var navigatedHandler1 = (oldState, state, _data) => {
                oldStates1.push(oldState);
                states1.push(state);
            };
            var navigatedHandler2 = (oldState, state, _data) => {
                oldStates2.push(oldState);
                states2.push(state);
            };
            stateNavigator.onNavigate(navigatedHandler1);
            stateNavigator.onNavigate(navigatedHandler2);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.navigate('s2');
            stateNavigator.offNavigate(navigatedHandler1);
            stateNavigator.offNavigate(navigatedHandler2);
            assert.equal(oldStates1[0], stateNavigator.states['s0']);
            assert.equal(states1[0], stateNavigator.states['s1']);
            assert.equal(oldStates2[0], stateNavigator.states['s0']);
            assert.equal(states2[0], stateNavigator.states['s1']);
            assert.equal(oldStates1[1], stateNavigator.states['s1']);
            assert.equal(states1[1], stateNavigator.states['s2']);
            assert.equal(oldStates2[1], stateNavigator.states['s1']);
            assert.equal(states2[1], stateNavigator.states['s2']);
            assert.equal(oldStates1.length, 2);
            assert.equal(states1.length, 2);
            assert.equal(oldStates2.length, 2);
            assert.equal(states2.length, 2);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Off Before Navigate', function () {
        it('should stop calling onBeforeNavigate listener', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateNavigator.navigate('s0');
            var beforeNavigateHandler = (state, _data, _url, _history, {state: oldState}) => {
                oldStates.push(oldState);
                states.push(state);
                return true;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.offBeforeNavigate(beforeNavigateHandler);
            stateNavigator.offBeforeNavigate(beforeNavigateHandler);
            stateNavigator.navigate('s2');
            assert.equal(oldStates[0], stateNavigator.states['s0']);
            assert.equal(states[0], stateNavigator.states['s1']);
            assert.equal(oldStates.length, 1);
            assert.equal(states.length, 1);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Off Navigate', function () {
        it('should stop calling onNavigate listener', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateNavigator.navigate('s0');
            var navigatedHandler = (oldState, state, _data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateNavigator.onNavigate(navigatedHandler);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.offNavigate(navigatedHandler);
            stateNavigator.offNavigate(navigatedHandler);
            stateNavigator.navigate('s2');
            assert.equal(oldStates[0], stateNavigator.states['s0']);
            assert.equal(states[0], stateNavigator.states['s1']);
            assert.equal(oldStates.length, 1);
            assert.equal(states.length, 1);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Multiple Off Before Navigate', function () {
        it('should individually stop calling onBeforeNavigate listeners', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates1 = [];
            var states1 = [];
            var oldStates2 = [];
            var states2 = [];
            stateNavigator.navigate('s0');
            var beforeNavigateHandler1 = (state, _data, _url, _history, {state: oldState}) => {
                oldStates1.push(oldState);
                states1.push(state);
                return true;
            };
            var beforeNavigateHandler2 = (state, _data, _url, _history, {state: oldState}) => {
                oldStates2.push(oldState);
                states2.push(state);
                return true;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler1);
            stateNavigator.onBeforeNavigate(beforeNavigateHandler2);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.offBeforeNavigate(beforeNavigateHandler1);
            stateNavigator.navigate('s2');
            stateNavigator.offBeforeNavigate(beforeNavigateHandler2);
            assert.equal(oldStates1[0], stateNavigator.states['s0']);
            assert.equal(states1[0], stateNavigator.states['s1']);
            assert.equal(oldStates2[0], stateNavigator.states['s0']);
            assert.equal(states2[0], stateNavigator.states['s1']);
            assert.equal(oldStates2[1], stateNavigator.states['s1']);
            assert.equal(states2[1], stateNavigator.states['s2']);
            assert.equal(oldStates1.length, 1);
            assert.equal(states1.length, 1);
            assert.equal(oldStates2.length, 2);
            assert.equal(states2.length, 2);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Multiple Off Navigate', function () {
        it('should individually stop calling onNavigate listeners', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates1 = [];
            var states1 = [];
            var oldStates2 = [];
            var states2 = [];
            stateNavigator.navigate('s0');
            var navigatedHandler1 = (oldState, state, _data) => {
                oldStates1.push(oldState);
                states1.push(state);
            };
            var navigatedHandler2 = (oldState, state, _data) => {
                oldStates2.push(oldState);
                states2.push(state);
            };
            stateNavigator.onNavigate(navigatedHandler1);
            stateNavigator.onNavigate(navigatedHandler2);
            var link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            stateNavigator.offNavigate(navigatedHandler1);
            stateNavigator.navigate('s2');
            stateNavigator.offNavigate(navigatedHandler2);
            assert.equal(oldStates1[0], stateNavigator.states['s0']);
            assert.equal(states1[0], stateNavigator.states['s1']);
            assert.equal(oldStates2[0], stateNavigator.states['s0']);
            assert.equal(states2[0], stateNavigator.states['s1']);
            assert.equal(oldStates2[1], stateNavigator.states['s1']);
            assert.equal(states2[1], stateNavigator.states['s2']);
            assert.equal(oldStates1.length, 1);
            assert.equal(states1.length, 1);
            assert.equal(oldStates2.length, 2);
            assert.equal(states2.length, 2);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('Unloading Navigate And Continue', function () {
        it('should go to to State instead of initial State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.states['s1'].unloading = (_state, data, _url, unload) => {
                if (data.x)
                    stateNavigator.navigate('s2');
                unload();
            }
            var navigating;
            stateNavigator.states['s3'].navigating = (_data, _url, navigate) => {
                navigating = true;
                navigate();
            }
            stateNavigator.navigate('s3', { x: true });
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
            assert.strictEqual(navigating, undefined);
        });
    });

    describe('Unloading Navigate Url And Continue', function () {
        it('should go to State once', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var unloading;
            stateNavigator.states['s1'].unloading = (_state, _data, url, unload) => {
                if (!unloading) {
                    unloading = true;
                    stateNavigator.navigateLink(url);
                }
                unload();
            }
            var navigating = 0;
            stateNavigator.states['s2'].navigating = (_data, _url, navigate) => {
                navigating++;
                navigate();
            }
            stateNavigator.navigate('s2');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.previousState, null);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
            assert.strictEqual(navigating, 1);
        });
    });

    describe('Navigating Navigate And Continue', function () {
        it('should go to to State instead of initial State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0'},
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true},
                { key: 's3', route: 'r3' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.states['s3'].navigating = (_data, _url, navigate) => {
                stateNavigator.navigate('s2');
                navigate();
            }
            stateNavigator.navigate('s3');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
        });
    });

    describe('On Before Navigate Cancel', function () {
        it('should not call unloading', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            stateNavigator.navigate('s0');
            var hits = 0;
            stateNavigator.states['s0'].unloading = (_state, _data, _url, unload) => {
                hits++;
                unload();
            }
            var beforeNavigateHandler = () => {
                return false;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler);
            stateNavigator.navigate('s1');
            stateNavigator.offBeforeNavigate(beforeNavigateHandler);
            assert.equal(hits, 0);
        });
    });

    describe('Unloading Navigate On Before Navigate', function () {
        it('should call onBeforeNavigate listener twice', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.states['s1'].unloading = (state, _data, _url, unload) => {
                if (state.key == 's2')
                    stateNavigator.navigate('s3');
                unload();
            }
            var navigatedState;
            var hits = 0;
            var beforeNavigateHandler = (state, _data) => {
                navigatedState = state;
                hits++;
                return true;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler);
            stateNavigator.navigate('s2');
            stateNavigator.offBeforeNavigate(beforeNavigateHandler);
            assert.equal(hits, 2);
            assert.equal(navigatedState, stateNavigator.stateContext.state);
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s3']);
        });
    });

    describe('Navigated Navigate On Navigate', function () {
        it('should call onNavigate listener once', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.states['s2'].navigated = () => {
                stateNavigator.navigate('s3');
            }
            var navigatedState;
            var hits = 0;
            var navigatedHandler = (_oldState, state, _data) => {
                navigatedState = state;
                hits++;
            };
            stateNavigator.onNavigate(navigatedHandler);
            stateNavigator.navigate('s2');
            stateNavigator.offNavigate(navigatedHandler);
            assert.equal(hits, 1);
            assert.equal(navigatedState, stateNavigator.stateContext.state);
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s3']);
        });
    });

    describe('State Params Navigated', function () {
        it('should pass State and Data but no old State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var navigatedOldState, navigatedState, navigatedData, navigatedUrl, navigatedAsyncData, navigatingData,
                navigatingUrl, beforeNavigateOldState, beforeNavigateState, beforeNavigateData, beforeNavigateUrl;
            stateNavigator.states['s'].navigating = (data, url, navigating) => {
                navigatingData = data;
                navigatingUrl = url;
                navigating('World');
            }
            var beforeNavigateHandler = (state, data, url, _history, {state: oldState}) => {
                beforeNavigateOldState = oldState;
                beforeNavigateState = state;
                beforeNavigateData = data;
                beforeNavigateUrl = url;
                return true;
            };
            var navigatedHandler = (oldState, state, data, asyncData, {url}) => {
                navigatedOldState = oldState;
                navigatedState = state;
                navigatedData = data;
                navigatedAsyncData = asyncData;
                navigatedUrl = url;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler);
            stateNavigator.onNavigate(navigatedHandler);
            var url = stateNavigator.getNavigationLink('s', { s: 'Hello' });
            stateNavigator.navigate('s', { s: 'Hello' });
            stateNavigator.offBeforeNavigate(beforeNavigateHandler);
            stateNavigator.offNavigate(navigatedHandler);
            assert.strictEqual(beforeNavigateOldState, null);
            assert.strictEqual(beforeNavigateState, stateNavigator.states['s']);
            assert.strictEqual(beforeNavigateData.s, 'Hello');
            assert.strictEqual(beforeNavigateUrl, url);
            assert.strictEqual(navigatingData.s, 'Hello');
            assert.strictEqual(navigatingUrl, url);
            assert.strictEqual(navigatedOldState, null);
            assert.strictEqual(navigatedState, stateNavigator.states['s']);
            assert.strictEqual(navigatedData.s, 'Hello');
            assert.strictEqual(navigatedAsyncData, 'World');
            assert.strictEqual(navigatedUrl, url);
            assert.strictEqual(stateNavigator.stateContext.data.s, 'Hello');
        });
    });

    describe('Transition Params Navigated', function () {
        it('should pass old State, State and Data', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var link = stateNavigator.getNavigationLink('s0');
            stateNavigator.navigateLink(link);
            var unloadingState, unloadingData, unloadingUrl, navigatedOldState, navigatedState, navigatedData, navigatedAsyncData, navigatedUrl,
                navigatingData, navigatingUrl, beforeNavigateOldState, beforeNavigateState, beforeNavigateData, beforeNavigateUrl;
            stateNavigator.states['s0'].unloading = (state, data, url, unload) => {
                unloadingState = state;
                unloadingData = data;
                unloadingUrl = url;
                unload();
            }
            stateNavigator.states['s1'].navigating = (data, url, navigating) => {
                navigatingData = data;
                navigatingUrl = url;
                navigating('World');
            }
            var beforeNavigateHandler = (state, data, url, _history, {state: oldState}) => {
                beforeNavigateOldState = oldState;
                beforeNavigateState = state;
                beforeNavigateData = data;
                beforeNavigateUrl = url;
                return true;
            };
            var navigatedHandler = (oldState, state, data, asyncData, {url}) => {
                navigatedOldState = oldState;
                navigatedState = state;
                navigatedData = data;
                navigatedAsyncData = asyncData;
                navigatedUrl = url;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler);
            stateNavigator.onNavigate(navigatedHandler);
            var url = stateNavigator.getNavigationLink('s1', { s: 'Hello' });
            stateNavigator.navigate('s1', { s: 'Hello' });
            stateNavigator.offBeforeNavigate(beforeNavigateHandler);
            stateNavigator.offNavigate(navigatedHandler);
            assert.strictEqual(beforeNavigateOldState, stateNavigator.states['s0']);
            assert.strictEqual(beforeNavigateState, stateNavigator.states['s1']);
            assert.strictEqual(beforeNavigateData.s, 'Hello');
            assert.strictEqual(Object.keys(beforeNavigateData).length, 1);
            assert.strictEqual(beforeNavigateUrl, url);
            assert.strictEqual(unloadingState, stateNavigator.states['s1']);
            assert.strictEqual(unloadingData.s, 'Hello');
            assert.strictEqual(Object.keys(unloadingData).length, 1);
            assert.strictEqual(unloadingUrl, url);
            assert.strictEqual(navigatingData.s, 'Hello');
            assert.strictEqual(Object.keys(navigatingData).length, 1);
            assert.strictEqual(navigatingUrl, url);
            assert.strictEqual(navigatedOldState, stateNavigator.states['s0']);
            assert.strictEqual(navigatedState, stateNavigator.states['s1']);
            assert.strictEqual(navigatedData.s, 'Hello');
            assert.strictEqual(navigatedAsyncData, 'World');
            assert.strictEqual(navigatedUrl, url);
            assert.strictEqual(Object.keys(navigatedData).length, 1);
        });
    });

    describe('Before Navigate Navigate Params Navigated', function () {
        it('should pass State and Data', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var navigatedOldState, navigatedState, navigatedData, navigatedAsyncData;
            var beforeNavigateHandler = (_oldState, _state, _data, _url) => {
                stateNavigator.offBeforeNavigate(beforeNavigateHandler);
                stateNavigator.navigate('s1', { s: 'Hello' });
                return true;
            };
            stateNavigator.states['s1'].navigating = (_data, _url, navigating) => {
                navigating('World');
            }
            var navigatedHandler = (oldState, state, data, asyncData) => {
                stateNavigator.offNavigate(navigatedHandler);
                navigatedOldState = oldState;
                navigatedState = state;
                navigatedData = data;
                navigatedAsyncData = asyncData;
            };
            stateNavigator.onBeforeNavigate(beforeNavigateHandler);
            stateNavigator.onNavigate(navigatedHandler);
            stateNavigator.navigate('s0');
            assert.equal(navigatedOldState, null);
            assert.strictEqual(navigatedState, stateNavigator.states['s1']);
            assert.strictEqual(navigatedData.s, 'Hello');
            assert.strictEqual(navigatedAsyncData, 'World');
        });
    });

    describe('Navigating Navigate Params Navigated', function () {
        it('should pass State and Data', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var navigatedOldState, navigatedState, navigatedData, navigatedAsyncData;
            stateNavigator.states['s0'].navigating = (_data, _url, navigating) => {
                stateNavigator.navigate('s1', { s: 'Hello' });
                navigating();
            }
            stateNavigator.states['s1'].navigating = (_data, _url, navigating) => {
                navigating('World');
            }
            var navigatedHandler = (oldState, state, data, asyncData) => {
                stateNavigator.offNavigate(navigatedHandler);
                navigatedOldState = oldState;
                navigatedState = state;
                navigatedData = data;
                navigatedAsyncData = asyncData;
            };
            stateNavigator.onNavigate(navigatedHandler);
            stateNavigator.navigate('s0');
            assert.equal(navigatedOldState, null);
            assert.strictEqual(navigatedState, stateNavigator.states['s1']);
            assert.strictEqual(navigatedData.s, 'Hello');
            assert.strictEqual(navigatedAsyncData, 'World');
        });
    });

    describe('History Navigate', function () {
        it('should pass history flag to lifecycle functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            var beforeNavigatingHistory, unloadingHistory, navigatingHistory;
            stateNavigator.onBeforeNavigate((_state, _data, _url, history) => {
                beforeNavigatingHistory = history;
                return true;
            });
            stateNavigator.states['s0'].unloading = (_state, _data, _url, unload, history) => {
                unloadingHistory = history; 
                unload();
            }
            stateNavigator.states['s1'].navigating = (_data, _url, navigate, history) => {
                navigatingHistory = history;
                navigate();
            }
            stateNavigator.navigateLink(link, undefined, true);
            assert.strictEqual(beforeNavigatingHistory, true);
            assert.strictEqual(unloadingHistory, true);
            assert.strictEqual(navigatingHistory, true);
        });
    });

    describe('Non History Navigate', function () {
        it('should not pass history flag to lifecycle functions', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0'},
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            var beforeNavigatingHistory, unloadingHistory, navigatingHistory;
            stateNavigator.onBeforeNavigate((_state, _data, _url, history) => {
                beforeNavigatingHistory = history;
                return true;
            });
            stateNavigator.states['s0'].unloading = (_state, _data, _url, unload, history) => {
                unloadingHistory = history; 
                unload();
            }
            stateNavigator.states['s1'].navigating = (_data, _url, navigate, history) => {
                navigatingHistory = history;
                navigate();
            }
            stateNavigator.navigateLink(link);
            assert.strictEqual(beforeNavigatingHistory, false);
            assert.strictEqual(unloadingHistory, false);
            assert.strictEqual(navigatingHistory, false);
        });
    });

    describe('Async Data Navigating', function () {
        it('should pass async data to navigated function', function(done: MochaDone) {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0'},
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.states['s1'].navigated = (_data, asyncData) => {
                assert.equal(asyncData, 'hello');
                done();
            }
            stateNavigator.states['s1'].navigating = (_data, _url, navigate) => {
                setTimeout(() => navigate('hello'), 0);
            }
            stateNavigator.navigate('s1');
        });
    });

    describe('Async Data Navigating Navigating', function () {
        it('should pass async data to navigated function once', function(done: MochaDone) {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.states['s1'].navigated = (_data, asyncData) => {
                assert.equal(asyncData, 0);
            }
            var i = 0;
            stateNavigator.states['s1'].navigating = (_data, _url, navigate) => {
                ((count) => setTimeout(() => {
                    navigate(count);
                    if (count === 1)
                        done();
                }, 0))(i);
                i++;
            }
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s1');
        });
    });

    describe('Reversed Async Data Navigating Navigating', function () {
        it('should pass second async data to navigated function', function(done: MochaDone) {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0'},
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.states['s1'].navigated = (_data, asyncData) => {
                assert.equal(asyncData, 1);
            }
            var i = 0;
            stateNavigator.states['s1'].navigating = (_data, _url, navigate) => {
                ((count) => setTimeout(() => { 
                    navigate(count);
                    if (count === 0)
                        done();
                }, 5 - 5 * count))(i);
                i++;
            }
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s1');
        });
    });

    describe('No Async Data Navigating', function () {
        it('should not pass any async data', function(done: MochaDone) {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.states['s1'].navigated = (_data, _asyncData) => {
                stateNavigator.navigate('s2');
            }
            stateNavigator.states['s2'].navigated = (_data, asyncData) => {
                assert.equal(asyncData, undefined);
                done();
            }
            stateNavigator.states['s1'].navigating = (_data, _url, navigate) => {
                setTimeout(() => navigate('hello'), 0);
            }
            stateNavigator.navigate('s1');
        });
    });

    describe('Route Navigate', function () {
        it('should go to State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 's' },
                { key: 's1', route: 'abc/{x}' }
            ]);
            stateNavigator.navigateLink('/abc/de');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.navigateLink('/s');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });

    describe('Route Root Navigate', function () {
        it('should go to State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: '{y}' },
                { key: 's1', route: 's' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.y !== 's'; 
            stateNavigator.navigateLink('/sa');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            stateNavigator.navigateLink('/s');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Route Root Order Navigate', function () {
        it('should go to State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's1', route: 's' },
                { key: 's0', route: '{y}' }
            ]);
            stateNavigator.navigateLink('/sa');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            stateNavigator.navigateLink('/s');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Two Route Navigate', function () {
        it('should go to State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 's' },
                { key: 's1', route: ['abc/{x}', 'def/{y}'] }
            ]);
            stateNavigator.navigateLink('/abc/de');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.navigateLink('/def/gh');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.navigateLink('/s');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });

    describe('Expand Route Navigate', function () {
        it('should go to State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 's' },
                { key: 's1', route: 'abc/{x}+/def/{y}' }
            ]);
            stateNavigator.navigateLink('/abc/de');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.navigateLink('abc/de/def/gh');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.navigateLink('/s');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });
    
    describe('Two Route Root Navigate', function () {
        it('should go to State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: ['abc/{x}', '{y}'] },
                { key: 's1', route: 's' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.y !== 's'; 
            stateNavigator.navigateLink('/abc/de');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            stateNavigator.navigateLink('/sa');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            stateNavigator.navigateLink('/s');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });
    
    describe('Two Route Root Order Navigate', function () {
        it('should go to State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's1', route: 's' },
                { key: 's0', route: ['abc/{x}', '{y}'] }
            ]);
            stateNavigator.navigateLink('/abc/de');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            stateNavigator.navigateLink('/sa');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            stateNavigator.navigateLink('/s');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Expand Route Root Navigate', function () {
        it('should go to State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: '+abc/{x}' },
                { key: 's1', route: 's' }
            ]);
            stateNavigator.navigateLink('/abc/de');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            stateNavigator.navigateLink('/');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            stateNavigator.navigateLink('/s');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Expand And Two Route Navigate', function () {
        it('should go to State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 's' },
                { key: 's1', route: ['abc/{x}+/def/{y}', 'ghi/{y}'] }
            ]);
            stateNavigator.navigateLink('/abc/de');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.navigateLink('abc/de/def/gh');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.navigateLink('/ghi/jk');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.navigateLink('/s');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });

    describe('Clear State Context', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link, undefined, true);
            });            
            test();
        });
        
        function test(){
            it('should clear State context', function() {
                stateNavigator.stateContext.clear();
                assert.strictEqual(stateNavigator.stateContext.oldState, null);
                assert.strictEqual(stateNavigator.stateContext.previousState, null);
                assert.strictEqual(stateNavigator.stateContext.state, null);
                assert.strictEqual(stateNavigator.stateContext.url, null);
                assert.strictEqual(stateNavigator.stateContext.title, null);
                assert.strictEqual(stateNavigator.stateContext.history, false);
                assert.strictEqual(stateNavigator.stateContext.crumbs.length, 0);
                assert.strictEqual(stateNavigator.stateContext.nextCrumb, null);
            });
        }
    });

    describe('History Null', function () {
        var replaceHistory;
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            var historyManager = new HashHistoryManager();
            replaceHistory = undefined;
            historyManager.addHistory = (_url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should pass replace false to history manager', function() {
                assert.strictEqual(replaceHistory, false);
            });
        }
    });

    describe('History Add', function () {
        var replaceHistory;
        var historyContext: StateContext;
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            var historyManager = new HashHistoryManager();
            replaceHistory = undefined;
            historyContext = undefined;
            historyManager.addHistory = (_url: string, replace: boolean, stateContext?: StateContext) => {
                replaceHistory = replace;
                historyContext = stateContext;
            }
            stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', null, 'add');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link, 'add');
            });
            test();
        });
        
        function test() {
            it('should pass replace false to history manager', function() {
                assert.strictEqual(replaceHistory, false);
                assert.strictEqual(historyContext.url, '/r');
                assert.strictEqual(historyContext.state, stateNavigator.states.s);
            });
        }
    });

    describe('History Replace', function () {
        var replaceHistory;
        var historyContext: StateContext;
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            var historyManager = new HashHistoryManager();
            replaceHistory = undefined;
            historyContext = undefined;
            historyManager.addHistory = (_url: string, replace: boolean, stateContext?: StateContext) => {
                replaceHistory = replace;
                historyContext = stateContext;
            }
            stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', null, 'replace');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link, 'replace');
            });
            test();
        });
        
        function test() {
            it('should pass replace true to history manager', function() {
                assert.strictEqual(replaceHistory, true);
                assert.strictEqual(historyContext.url, '/r');
                assert.strictEqual(historyContext.state, stateNavigator.states.s);
            });
        }
    });

    describe('History None', function () {
        var replaceHistory;
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            var historyManager = new HashHistoryManager();
            replaceHistory = undefined;
            historyManager.addHistory = (_url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', null, 'none');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link, 'none');
            });
            test();
        });
        
        function test() {
            it('should not call history manager', function() {
                assert.strictEqual(replaceHistory, undefined);
            });
        }
    });

    describe('History Null Refresh Navigate', function () {
        it('should pass replace false to history manager', function() {
            var dialogs = [
                { key: 's', route: 'r' }
            ];
            var stateNavigator = new StateNavigator(dialogs);
            stateNavigator.navigate('s');
            var historyManager = new HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (_url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateNavigator.configure(dialogs, historyManager);
            stateNavigator.refresh();
            assert.strictEqual(replaceHistory, false);
        });
    });

    describe('History Add Refresh Navigate', function () {
        it('should pass replace false to history manager', function() {
            var dialogs = [
                { key: 's', route: 'r' }
            ];
            var stateNavigator = new StateNavigator(dialogs);
            stateNavigator.navigate('s');
            var historyManager = new HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (_url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateNavigator.configure(dialogs, historyManager);
            stateNavigator.refresh(null, 'add');
            assert.strictEqual(replaceHistory, false);
        });
    });

    describe('History Replace Refresh Navigate', function () {
        it('should pass replace true to history manager', function() {
            var dialogs = [
                { key: 's', route: 'r' }
            ];
            var stateNavigator = new StateNavigator(dialogs);
            stateNavigator.navigate('s');
            var historyManager = new HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (_url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateNavigator.configure(dialogs, historyManager);
            stateNavigator.refresh(null, 'replace');
            assert.strictEqual(replaceHistory, true);
        });
    });

    describe('History None Refresh Navigate', function () {
        it('should not call history manager', function() {
            var dialogs = [
                { key: 's', route: 'r' }
            ];
            var stateNavigator = new StateNavigator(dialogs);
            stateNavigator.navigate('s');
            var historyManager = new HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (_url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateNavigator.configure(dialogs, historyManager);
            stateNavigator.refresh(null, 'none');
            assert.strictEqual(replaceHistory, undefined);
        });
    });

    describe('History Null Back Navigate', function () {
        it('should pass replace false to history manager', function() {
            var dialogs = [
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ];
            var stateNavigator = new StateNavigator(dialogs);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var historyManager = new HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (_url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateNavigator.configure(dialogs, historyManager);
            stateNavigator.navigateBack(1);
            assert.strictEqual(replaceHistory, false);
        });
    });

    describe('History Add Back Navigate', function () {
        it('should pass replace false to history manager', function() {
            var dialogs = [
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ];
            var stateNavigator = new StateNavigator(dialogs);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var historyManager = new HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (_url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateNavigator.configure(dialogs, historyManager);
            stateNavigator.navigateBack(1, 'add');
            assert.strictEqual(replaceHistory, false);
        });
    });

    describe('History Replace Back Navigate', function () {
        it('should pass replace true to history manager', function() {
            var dialogs = [
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]
            var stateNavigator = new StateNavigator(dialogs);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var historyManager = new HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (_url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateNavigator.configure(dialogs, historyManager);
            stateNavigator.navigateBack(1, 'replace');
            assert.strictEqual(replaceHistory, true);
        });
    });

    describe('History None Back Navigate', function () {
        it('should not call history manager', function() {
            var dialogs = [
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ];
            var stateNavigator = new StateNavigator(dialogs);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var historyManager = new HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (_url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateNavigator.configure(dialogs, historyManager);
            stateNavigator.navigateBack(1, 'none');
            assert.strictEqual(replaceHistory, undefined);
        });
    });

    describe('History Navigated Navigate', function () {
        it('should not call history manager', function() {
            var called = false;
            var historyManager = new HashHistoryManager();
            historyManager.addHistory = (_url: string, _replace: boolean) => {
                called = true;
            }
            var stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' }
                ],
                historyManager
            );
            stateNavigator.states['s0'].navigated = () => {
                stateNavigator.navigate('s1', null, 'none');
            }
            stateNavigator.navigate('s0');
            assert.ok(!called);
        });
    });

    describe('Reload Dialog', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.configure([
                { key: 's1', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Reload Transition', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.stateContext.clear();
            stateNavigator.configure([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Refresh', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.stateContext.clear();
            stateNavigator.configure([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r' }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.stateContext.clear();
            stateNavigator.configure([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Error State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            try {
                stateNavigator.configure([
                    { key: '' }
                ]);
            } catch(e) {
            }
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Reload Error Transition', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            try {
                stateNavigator.configure([
                    { key: '' }
                ]);
            } catch(e) {
            }
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Error Refresh', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            try {
                stateNavigator.configure([
                    { key: '' }
                ]);
            } catch(e) {
            }
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Error Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            try {
                stateNavigator.configure([
                    { key: '' }
                ]);
            } catch(e) {
            }
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Two Controllers Dialog', function() {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function() {
            stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r' }
            ]);
            stateNavigator1 = new StateNavigator([
                { key: 's1', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator0.navigate('s0');
                stateNavigator1.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator0.getNavigationLink('s0');
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s1');
                stateNavigator1.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate context', function() {
                assert.equal(stateNavigator0.stateContext.state, stateNavigator0.states['s0']);
                assert.equal(stateNavigator1.stateContext.state, stateNavigator1.states['s1']);
                assert.equal(stateNavigator0.stateContext.crumbs.length, 0);
                assert.equal(stateNavigator1.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Two Controllers Transition', function() {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function() {
            stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator1 = new StateNavigator([
                { key: 's2', route: 'r0' },
                { key: 's3', route: 'r1', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator0.navigate('s0');
                stateNavigator1.navigate('s2');
                stateNavigator0.navigate('s1');
                stateNavigator1.navigate('s3');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator0.getNavigationLink('s0');
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s2');
                stateNavigator1.navigateLink(link);
                link = stateNavigator0.getNavigationLink('s1');
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s3');
                stateNavigator1.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate context', function() {
                assert.equal(stateNavigator0.stateContext.state, stateNavigator0.states['s1']);
                assert.equal(stateNavigator1.stateContext.state, stateNavigator1.states['s3']);
                assert.equal(stateNavigator0.stateContext.oldState, stateNavigator0.states['s0']);
                assert.equal(stateNavigator1.stateContext.oldState, stateNavigator1.states['s2']);
                assert.equal(stateNavigator0.stateContext.previousState, stateNavigator0.states['s0']);
                assert.equal(stateNavigator1.stateContext.previousState, stateNavigator1.states['s2']);
                assert.equal(stateNavigator0.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator0.stateContext.crumbs[0].state, stateNavigator0.states['s0']);
                assert.ok(stateNavigator0.stateContext.crumbs[0].last);
                assert.equal(stateNavigator1.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator1.stateContext.crumbs[0].state, stateNavigator1.states['s2']);
                assert.ok(stateNavigator1.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Two Controllers Refresh', function() {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function() {
            stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator1 = new StateNavigator([
                { key: 's2', route: 'r0' },
                { key: 's3', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator0.navigate('s0');
                stateNavigator1.navigate('s2');
                stateNavigator0.navigate('s1');
                stateNavigator1.navigate('s3');
                stateNavigator0.refresh();
                stateNavigator1.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator0.getNavigationLink('s0');
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s2');
                stateNavigator1.navigateLink(link);
                link = stateNavigator0.getNavigationLink('s1');
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s3');
                stateNavigator1.navigateLink(link);
                link = stateNavigator0.getRefreshLink();
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getRefreshLink();
                stateNavigator1.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate context', function() {
                assert.equal(stateNavigator0.stateContext.state, stateNavigator0.states['s1']);
                assert.equal(stateNavigator1.stateContext.state, stateNavigator1.states['s3']);
                assert.equal(stateNavigator0.stateContext.oldState, stateNavigator0.states['s1']);
                assert.equal(stateNavigator1.stateContext.oldState, stateNavigator1.states['s3']);
                assert.equal(stateNavigator0.stateContext.previousState, stateNavigator0.states['s0']);
                assert.equal(stateNavigator1.stateContext.previousState, stateNavigator1.states['s2']);
                assert.equal(stateNavigator0.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator0.stateContext.crumbs[0].state, stateNavigator0.states['s0']);
                assert.ok(stateNavigator0.stateContext.crumbs[0].last);
                assert.equal(stateNavigator1.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator1.stateContext.crumbs[0].state, stateNavigator1.states['s2']);
                assert.ok(stateNavigator1.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Two Controllers Back', function() {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function() {
            stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator1 = new StateNavigator([
                { key: 's3', route: 'r0' },
                { key: 's4', route: 'r1', trackCrumbTrail: true },
                { key: 's5', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator0.navigate('s0');
                stateNavigator1.navigate('s3');
                stateNavigator0.navigate('s1');
                stateNavigator1.navigate('s4');
                stateNavigator0.navigate('s2');
                stateNavigator1.navigate('s5');
                stateNavigator0.navigateBack(1);
                stateNavigator1.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator0.getNavigationLink('s0');
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s3');
                stateNavigator1.navigateLink(link);
                link = stateNavigator0.getNavigationLink('s1');
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s4');
                stateNavigator1.navigateLink(link);
                link = stateNavigator0.getNavigationLink('s2');
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s5');
                stateNavigator1.navigateLink(link);
                link = stateNavigator0.getNavigationBackLink(1);
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationBackLink(1);
                stateNavigator1.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator0.stateContext.state, stateNavigator0.states['s1']);
                assert.equal(stateNavigator1.stateContext.state, stateNavigator1.states['s4']);
                assert.equal(stateNavigator0.stateContext.oldState, stateNavigator0.states['s2']);
                assert.equal(stateNavigator1.stateContext.oldState, stateNavigator1.states['s5']);
                assert.equal(stateNavigator0.stateContext.previousState, stateNavigator0.states['s0']);
                assert.equal(stateNavigator1.stateContext.previousState, stateNavigator1.states['s3']);
                assert.equal(stateNavigator0.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator0.stateContext.crumbs[0].state, stateNavigator0.states['s0']);
                assert.ok(stateNavigator0.stateContext.crumbs[0].last);
                assert.equal(stateNavigator1.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator1.stateContext.crumbs[0].state, stateNavigator1.states['s3']);
                assert.ok(stateNavigator1.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Reload History', function () {
        it('should call stop', function() {
            var dialogs = [
                { key: 's', route: 'r' }
            ];
            var stateNavigator = new StateNavigator(dialogs);
            var stop = false;
            stateNavigator.historyManager.stop = () => stop = true;
            stateNavigator.configure(dialogs);
            assert.strictEqual(stop, true);
        });
    });

    describe('Two Controllers History Navigate', function() {
        it('should add history', function() {
            var stateNavigator0 = new StateNavigator([
                { key: 's', route: 'r0' }
            ]);
            var stateNavigator1 = new StateNavigator([
                { key: 's', route: 'r1' }
            ]);
            var url0, url1;
            stateNavigator0.historyManager.addHistory = (url) => url0 = url;
            stateNavigator1.historyManager.addHistory = (url) => url1 = url;
            stateNavigator0.navigate('s');
            stateNavigator1.navigate('s');        
            assert.strictEqual(url0, '/r0');
            assert.strictEqual(url1, '/r1');
        });
    });
    
    describe('Crumb Trail Route Param', function() {
        var stateNavigator: StateNavigator;
        var s2Link: string; 
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{crumb?}', trackCrumbTrail: true },
                { key: 's2', route: 'r2/{crumb?}', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                s2Link = stateNavigator.stateContext.url;
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                s2Link = stateNavigator.stateContext.url;
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.equal(s2Link.slice(1).split('/').length, 2);
                assert.equal(s2Link.indexOf('?'), -1);
                assert.equal(stateNavigator.stateContext.url.indexOf('?'), -1);
            })          
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Crumb Trail Route Splat Param', function() {
        var stateNavigator: StateNavigator;
        var s2Link: string; 
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{*crumb?}', trackCrumbTrail: true },
                { key: 's2', route: 'r2/{*crumb?}', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                s2Link = stateNavigator.stateContext.url;
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                s2Link = stateNavigator.stateContext.url;
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.equal(s2Link.slice(1).split('/').length, 3);
                assert.equal(s2Link.indexOf('?'), -1);
                assert.equal(stateNavigator.stateContext.url.indexOf('?'), -1);
            })          
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Crumb Trail Mixed Param', function() {
        var stateNavigator: StateNavigator;
        var s2Link: string; 
        var s3Link: string; 
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2/{*crumb?}', trackCrumbTrail: true },
                { key: 's3', route: 'r3/{crumb?}', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                s2Link = stateNavigator.stateContext.url;
                stateNavigator.navigate('s3');
                s3Link = stateNavigator.stateContext.url;
                stateNavigator.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                s2Link = stateNavigator.stateContext.url;
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                s3Link = stateNavigator.stateContext.url;
                link = stateNavigator.getNavigationBackLink(2);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.equal(s2Link.slice(1).split('/').length, 3);
                assert.equal(s3Link.slice(1).split('/').length, 2);
                assert.equal(s2Link.indexOf('?'), -1);
                assert.equal(s3Link.indexOf('?'), -1);
                assert.notEqual(stateNavigator.stateContext.url.indexOf('?'), -1);
            })          
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s3']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.ok(stateNavigator.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Crumb Trail Mandatory Route Param', function() {
        it ('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{crumb}', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            assert.throws(() => stateNavigator.navigate('s2'), /Invalid navigation data/);
        });
    });
    
    describe('Crumb Trail Key', function() {
        var stateNavigator: StateNavigator;
        var s1Link: string, s2Link: string;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: 'trail' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                s2Link = stateNavigator.stateContext.url;
                stateNavigator.navigateBack(1);
                s1Link = stateNavigator.stateContext.url;
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                s2Link = stateNavigator.stateContext.url;
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                s1Link = stateNavigator.stateContext.url;
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.strictEqual(stateNavigator.states['s2'].trackCrumbTrail, true);
                assert.notEqual(s1Link.indexOf('crumb'), -1);
                assert.equal(s1Link.indexOf('trail'), -1);
                assert.equal(s2Link.indexOf('crumb'), -1);
                assert.notEqual(s2Link.indexOf('trail'), -1);
            })          
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });
    
    describe('Refresh Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.refresh();
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });
    
    describe('Hash Refresh Hash Back', function() {
        it('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var link = stateNavigator.getNavigationLink('s0', null, 'f0');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getRefreshLink(null, 'f1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationBackLink(1);
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.hash, 'f0');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.oldHash, 'f1');
            assert.equal(stateNavigator.stateContext.previousState, null);
            assert.equal(stateNavigator.stateContext.previousHash, null);
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        });
    });

    describe('Refresh Back Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (_state, _data, crumbs) => crumbs.slice(0, 1);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.refresh();
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.previousState, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Crumb Trail Invalid', function() {
        it ('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            assert.throws(() => stateNavigator.navigateLink('/r1?crumb=%2Fr2'), /The Url .*is invalid/);
        });
    });
    
    describe('Crumb Trail Encode', function() {
        it ('should populate context', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.urlEncode = (_state, _key, val) => {
                return encodeURIComponent(val).replace('%2F', '/');
            }
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            assert.equal(stateNavigator.stateContext.url, '/r1?crumb=/r0');
            stateNavigator.navigateBack(1);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });
    
    describe('Repeated States With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.equal(stateNavigator.stateContext.url.match(/crumb/g).length, 4);
            });
            it('should populate context', function() {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s3']);
                assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s3']);
                assert.equal(stateNavigator.stateContext.crumbs.length, 4);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.equal(stateNavigator.stateContext.crumbs[1].state, stateNavigator.states['s1']);
                assert.equal(stateNavigator.stateContext.crumbs[2].state, stateNavigator.states['s2']);
                assert.equal(stateNavigator.stateContext.crumbs[3].state, stateNavigator.states['s3']);
                assert.ok(!stateNavigator.stateContext.crumbs[0].last);
                assert.ok(!stateNavigator.stateContext.crumbs[1].last);
                assert.ok(!stateNavigator.stateContext.crumbs[2].last);
                assert.ok(stateNavigator.stateContext.crumbs[3].last);
            });
        }
    });

    describe('Start Route', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: '' },
                { key: 's1', route: 'ab' }
            ]);
            stateNavigator.start('/ab');
            assert.strictEqual(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        });
    });

    describe('Start Empty Route', function () {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: '' },
                { key: 's1', route: 'ab' }
            ]);
            stateNavigator.start('');
            assert.strictEqual(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        });
    });

    describe('HTML5 History', function () {
        it('should prepend slash', function() {
            var history = new HTML5HistoryManager();
            assert.strictEqual(history.getHref('a'), '/a');
            assert.strictEqual(history.getHref('/a'), '/a');
            history = new HTML5HistoryManager('a');
            assert.strictEqual(history.getHref('b'), '/a/b');
            assert.strictEqual(history.getHref('/b'), '/a/b');
            history = new HTML5HistoryManager('/a');
            assert.strictEqual(history.getHref('b'), '/a/b');
            assert.strictEqual(history.getHref('/b'), '/a/b');
        });
    });

    describe('Suspend', function() {
        it('should not navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.states.s1.navigating = (_data, _url, navigate) => navigate({z: 'c'});
            var stateNavigated = false;
            stateNavigator.states.s1.navigated = () => stateNavigated = true;
            stateNavigator.navigate('s0', {x: 'a'});
            var link = stateNavigator.getNavigationLink('s1', {y: 'b'}, 'f');
            var navigated = false;
            stateNavigator.onNavigate(() => navigated = true);
            stateNavigator.navigateLink(link, 'add', false, stateContext => {
                assert.equal(stateContext.oldState, stateNavigator.states['s0']);
                assert.equal(stateContext.oldData.x, 'a');
                assert.equal(stateContext.oldUrl, '/r0?x=a');
                assert.equal(stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateContext.data.y, 'b');
                assert.equal(stateContext.asyncData.z, 'c');
                assert.equal(stateContext.url, '/r1?y=b#f');
                assert.equal(stateContext.hash, 'f');
            });
            assert.equal(stateNavigator.stateContext.oldState, null);
            assert.equal(Object.keys(stateNavigator.stateContext.oldData).length, 0);
            assert.equal(stateNavigator.stateContext.oldUrl, null);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.data.x, 'a');
            assert.equal(stateNavigator.stateContext.asyncData, undefined);
            assert.equal(stateNavigator.stateContext.url, '/r0?x=a');
            assert.equal(stateNavigator.stateContext.hash, null);
            assert.equal(stateNavigated, false);
            assert.equal(navigated, false);
        });
    });

    describe('Resume', function() {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.states.s1.navigating = (_data, _url, navigate) => navigate({z: 'c'});
            var stateNavigated = false;
            stateNavigator.states.s1.navigated = () => stateNavigated = true;
            stateNavigator.navigate('s0', {x: 'a'});
            var link = stateNavigator.getNavigationLink('s1', {y: 'b'}, 'f');
            var navigated = false;
            stateNavigator.onNavigate(() => navigated = true);
            stateNavigator.navigateLink(link, 'add', false, (stateContext, resume) => {
                assert.equal(stateContext.oldState, stateNavigator.states['s0']);
                assert.equal(stateContext.oldData.x, 'a');
                assert.equal(stateContext.oldUrl, '/r0?x=a');
                assert.equal(stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateContext.data.y, 'b');
                assert.equal(stateContext.asyncData.z, 'c');
                assert.equal(stateContext.url, '/r1?y=b#f');
                assert.equal(stateContext.hash, 'f');
                resume();
            });
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.oldData.x, 'a');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r0?x=a');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.data.y, 'b');
            assert.equal(stateNavigator.stateContext.asyncData.z, 'c');
            assert.equal(stateNavigator.stateContext.url, '/r1?y=b#f');
            assert.equal(stateNavigator.stateContext.hash, 'f');
            assert.equal(stateNavigated, true);
            assert.equal(navigated, true);
        });
    });

    describe('Resume Resume', function() {
        it('should not navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var navigated = 0;
            stateNavigator.onNavigate(() => navigated++);
            var link = stateNavigator.getNavigationLink('s1', {y: 'b'});
            stateNavigator.navigateLink(link, 'add', false, (_stateContext, resume) => {
                resume();
                resume();
            });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.data.y, 'b');
            assert.equal(stateNavigator.stateContext.oldData.x, 'a');
            assert.equal(navigated, 1);
        });
    });

    describe('Resume Suspend Navigate', function() {
        it('should not navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var link = stateNavigator.getNavigationLink('s1', {y: 'b'});
            stateNavigator.navigateLink(link, 'add', false, (stateContext, resume) => {
                assert.equal(stateContext.state, stateNavigator.states['s1']);
                assert.equal(stateContext.data.y, 'b');
                stateNavigator.navigate('s2', {z: 'c'});
                resume();
            });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.data.z, 'c');
        });
    });

    describe('Context Override', function() {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var stateContext = stateNavigator.stateContext;
            stateNavigator.navigate('s1', {y: 'b'});
            var oldStateNavigator = new StateNavigator(stateNavigator);
            oldStateNavigator.stateContext = stateContext;
            var link = oldStateNavigator.getNavigationLink('s2', {z: 'c'});
            stateNavigator.navigateLink(link, undefined, undefined, undefined, stateContext);
            assert.equal(stateNavigator.stateContext.url, '/r2?z=c&crumb=%2Fr0%3Fx%3Da');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.data.z, 'c');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r0?x=a');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.oldData.x, 'a');
            assert.equal(stateNavigator.stateContext.previousUrl, '/r0?x=a');
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.previousData.x, 'a');
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            assert.equal(stateNavigator.stateContext.crumbs[0].url, '/r0?x=a');
            assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.crumbs[0].data.x, 'a');
        });
    });

    describe('Suspend Context Override', function() {
        it('should navigate', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var stateContext = stateNavigator.stateContext;
            stateNavigator.navigate('s1', {y: 'b'});
            var oldStateNavigator = new StateNavigator(stateNavigator);
            oldStateNavigator.stateContext = stateContext;
            var link = oldStateNavigator.getNavigationLink('s2', {z: 'c'});
            stateNavigator.navigateLink(link, undefined, undefined, (nextContext, resume) => {
                assert.equal(nextContext.url, '/r2?z=c&crumb=%2Fr0%3Fx%3Da');
                assert.equal(nextContext.state, stateNavigator.states['s2']);
                assert.equal(nextContext.data.z, 'c');
                assert.equal(nextContext.oldUrl, '/r0?x=a');
                assert.equal(nextContext.oldState, stateNavigator.states['s0']);
                assert.equal(nextContext.oldData.x, 'a');
                assert.equal(nextContext.previousUrl, '/r0?x=a');
                assert.equal(nextContext.previousState, stateNavigator.states['s0']);
                assert.equal(nextContext.previousData.x, 'a');
                assert.equal(nextContext.crumbs.length, 1);
                assert.equal(nextContext.crumbs[0].url, '/r0?x=a');
                assert.equal(nextContext.crumbs[0].state, stateNavigator.states['s0']);
                assert.equal(nextContext.crumbs[0].data.x, 'a');
                resume();
            }, stateContext);
        });
    });

    describe('On Before Navigate Context Override', function() {
        it('should call onBeforeNavigate listener', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var stateContext = stateNavigator.stateContext;
            stateNavigator.navigate('s1', {y: 'b'});
            stateNavigator.onBeforeNavigate((state, data, url, _history, currentContext) => {
                assert.equal(currentContext.url, '/r0?x=a');
                assert.equal(currentContext.state, stateNavigator.states['s0']);
                assert.equal(currentContext.data.x, 'a');
                var {state: nextState, data: nextData, crumbs} = stateNavigator.parseLink(link);
                assert.equal(url, '/r2?z=c&crumb=%2Fr0%3Fx%3Da');
                assert.equal(state, stateNavigator.states['s2']);
                assert.equal(data.z, 'c');
                assert.equal(nextState, stateNavigator.states['s2']);
                assert.equal(nextData.z, 'c');
                assert.equal(crumbs.length, 1);
                assert.equal(crumbs[0].url, '/r0?x=a');
                assert.equal(crumbs[0].state, stateNavigator.states['s0']);
                assert.equal(crumbs[0].data.x, 'a');
                return true;
            });
            var oldStateNavigator = new StateNavigator(stateNavigator);
            oldStateNavigator.stateContext = stateContext;
            var link = oldStateNavigator.getNavigationLink('s2', {z: 'c'});
            stateNavigator.navigateLink(link, undefined, undefined, undefined, stateContext);
        });
    });

    describe('Unloading Context Override', function() {
        it('should unload overridden State', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var stateContext = stateNavigator.stateContext;
            stateNavigator.navigate('s1', {y: 'b'});
            var unloaded = false;
            stateNavigator.states['s0'].unloading = (_state, _data, _url, unload) => {
                unloaded = true;
                unload();
            }
            var oldStateNavigator = new StateNavigator(stateNavigator);
            oldStateNavigator.stateContext = stateContext;
            var link = oldStateNavigator.getNavigationLink('s2', {z: 'c'});
            stateNavigator.navigateLink(link, undefined, undefined, undefined, stateContext);
            assert.equal(unloaded, true);
        });
    });
});
