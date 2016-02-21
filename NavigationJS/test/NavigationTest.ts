/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
import Navigation = require('../src/Navigation');
import StateController = require('../src/StateController');

describe('Navigation', function () {
    describe('State', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s']);
            });
            it('should have not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Second State', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s']);
            });
            it('should have not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('State With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s']);
            });
            it('should have not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Invalid State', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            it('should throw error', function(){
                assert.throws(() => stateController.navigate('s0'), /is not a valid State/);
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function(){
                assert.throws(() => stateController.getNavigationLink('s0'), /is not a valid State/);
            });
        });
    });

    describe('Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s0']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Transition With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s0']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('State State', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s');
                stateController.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('State State With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s');
                stateController.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
            });
            test();            
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });
    

    describe('Null State', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            it('should throw error', function() {
                assert.throws(() => stateController.navigate(null), /is not a valid State/);            
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function() {
                assert.throws(() => stateController.getNavigationLink(null), /is not a valid State/);
            });
        });
    });
    
    describe('Transition From Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0', trackCrumbTrail: false },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                var link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s0']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Transition With Trail Transition With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s2']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s1']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.equal(stateController.stateContext.crumbs[1].state, stateController.states['s1']);
                assert.ok(!stateController.stateContext.crumbs[0].last);
                assert.ok(stateController.stateContext.crumbs[1].last);
            });
        }
    });
    
    describe('Transition Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s2']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });
    
    
    describe('Refresh With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });
    
    describe('Back With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Back Two With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigate('s3');
                stateController.navigate('s4');
                stateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s3');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s4');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s2']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s4']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s1']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 2);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.equal(stateController.stateContext.crumbs[1].state, stateController.states['s1']);
                assert.ok(!stateController.stateContext.crumbs[0].last);
                assert.ok(stateController.stateContext.crumbs[1].last);
            });
        }
    });

    describe('Back Two', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigate('s3');
                stateController.navigate('s4');
                stateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s3');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s4');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s2']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s4']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Back One By One With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigate('s3');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s3');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Back One By One', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigate('s3');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s3');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Can Navigate Back With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should return false for 0', function() {
                assert.ok(!stateController.canNavigateBack(0));
            });
            it('should return true for 1', function() {
                assert.ok(stateController.canNavigateBack(1));
            });
            it('should return true for 2', function() {
                assert.ok(stateController.canNavigateBack(2));
            });
            it('should return false for 3', function() {
                assert.ok(!stateController.canNavigateBack(3));
            });
        }
    });

    describe('Can Navigate Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should return false for 0', function() {
                assert.ok(!stateController.canNavigateBack(0));
            });
            it('should return false for 1', function() {
                assert.ok(!stateController.canNavigateBack(1));
            });
        }
    });

    describe('Invalid Back With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
            });
            it('should throw error', function() {
                assert.throws(() => stateController.navigateBack(3));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.getNavigationBackLink(3), /distance parameter/);
            });
        });
    });

    describe('Invalid Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
            });
            it('should throw error', function() {
                assert.throws(() => stateController.navigateBack(1));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.getNavigationBackLink(1), /distance parameter/);
            });
        });
    });

    describe('Back Invalid Back With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.navigateBack(2), /distance parameter/);
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.getNavigationBackLink(2), /distance parameter/);
            });
        });
    });

    describe('Back Invalid Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.navigateBack(1), /distance parameter/);
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.getNavigationBackLink(1), /distance parameter/);
            });
        });
    });

    describe('Back Refresh With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
                stateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Back Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
                stateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Back Refresh Transition With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
                stateController.refresh();
                stateController.navigate('s3');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s3');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s3']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s1']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 2);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.equal(stateController.stateContext.crumbs[1].state, stateController.states['s1']);
                assert.ok(!stateController.stateContext.crumbs[0].last);
                assert.ok(stateController.stateContext.crumbs[1].last);
            });
        }
    });

    describe('Back Refresh Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
                stateController.refresh();
                stateController.navigate('s3');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s3');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s3']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s1']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.ok(stateController.stateContext.crumbs[0].last);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s1']);
            });
        }
    });

    describe('Transition Transition With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s2']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s1']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.ok(stateController.stateContext.crumbs[0].last);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s1']);
            });
        }
    });

    describe('Crumb Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigate('s3');
                stateController.navigate('s4');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s3');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s4');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.equal(stateController.stateContext.url.match(/crumb/g).length, 4);
            });
            it('should populate crumb State', function() {
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.equal(stateController.stateContext.crumbs[1].state, stateController.states['s1']);
                assert.equal(stateController.stateContext.crumbs[2].state, stateController.states['s2']);
                assert.equal(stateController.stateContext.crumbs[3].state, stateController.states['s3']);
                assert.equal(stateController.stateContext.crumbs.length, 4);
            });
            it('should populate crumb last', function() {
                assert.ok(!stateController.stateContext.crumbs[0].last);
                assert.ok(!stateController.stateContext.crumbs[1].last);
                assert.ok(!stateController.stateContext.crumbs[2].last);
                assert.ok(stateController.stateContext.crumbs[3].last);
            });
        }
    });

    describe('State State Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                    { key: 's', route: 'r', trackCrumbTrail: true },
                ]);
            var state = stateController.states['s'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s');
                stateController.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s']);
            });
        }
    });

    describe('Transition State State Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateController.states['s1'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 2);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.equal(stateController.stateContext.crumbs[1].state, stateController.states['s1']);
            });
        }
    });

    describe('State State Back Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
            var state = stateController.states['s'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s');
                stateController.navigate('s');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s']);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Transition State State Back Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateController.states['s1'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s1');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('State State Back Two Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateController.states['s1'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('State State Back One By One Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateController.states['s1'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Bookmarked Link With Trail Navigate', function() {
        it ('should populate old and previous States', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigate('s2');
            stateController.navigateLink(link);
            assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        })
    });

    describe('Bookmarked Link Navigate', function() {
        it ('should populate old but not previous States', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigate('s2');
            stateController.navigateLink(link);
            assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            assert.equal(stateController.stateContext.previousState, null);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        })
    });

    describe('Bookmarked Link Clear Navigate', function() {
        it ('should populate previous but not old States', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigate('s2');
            stateController.stateContext.clear();
            stateController.navigateLink(link);
            assert.equal(stateController.stateContext.oldState, undefined);
            assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        })
    });

    describe('State State Navigated', function () {
        it('should call all lifecycle functions apart from disposed', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
            var link = stateController.getNavigationLink('s');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.states['s'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s'].dispose = () => disposed = true;
            stateController.states['s'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.states['s'].navigated = () => navigated = true;
            stateController.navigate('s');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.states['s']);
        });
    });

    describe('State State Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
            var link = stateController.getNavigationLink('s');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.states['s'].unloading = (state, data, url, unload) => unloading = true;
            stateController.states['s'].dispose = () => disposed = true;
            stateController.states['s'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s'].navigated = () => navigated = true;
            stateController.navigate('s');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s']);
        });
    });

    describe('State State Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
            var link = stateController.getNavigationLink('s');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.states['s'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s'].dispose = () => disposed = true;
            stateController.states['s'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s'].navigated = () => navigated = true;
            stateController.navigate('s');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s']);
        });
    });

    describe('Transition Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateController.getNavigationLink('s0');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.states['s0'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s0'].dispose = () => disposed = true;
            stateController.states['s1'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.states['s1'].navigated = () => navigated = true;
            stateController.navigate('s1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        });
    });

    describe('Transition Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateController.getNavigationLink('s0');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.states['s0'].unloading = (state, data, url, unload) => unloading = true;
            stateController.states['s0'].dispose = () => disposed = true;
            stateController.states['s1'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s1'].navigated = () => navigated = true;
            stateController.navigate('s1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s0']);
        });
    });

    describe('Transition Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateController.getNavigationLink('s0');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.states['s0'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s0'].dispose = () => disposed = true;
            stateController.states['s1'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s1'].navigated = () => navigated = true;
            stateController.navigate('s1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s0']);
        });
    });

    describe('Transition Navigating Navigate', function () {
        it('should populate State', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var link = stateController.getNavigationLink('s0');
            stateController.navigateLink(link);
            stateController.states['s1'].navigating = (data, url, navigate) => {
                stateController.navigate('s2');
            }
            stateController.navigate('s1');
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Transition Transition Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s1'].dispose = () => disposed = true;
            stateController.states['s2'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.states['s2'].navigated = () => navigated = true;
            stateController.navigate('s2');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Transition Transition Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.states['s1'].unloading = (state, data, url, unload) => unloading = true;
            stateController.states['s1'].dispose = () => disposed = true;
            stateController.states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s2'].navigated = () => navigated = true;
            stateController.navigate('s2');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        });
    });

    describe('Transition Transition Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s1'].dispose = () => disposed = true;
            stateController.states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s2'].navigated = () => navigated = true;
            stateController.navigate('s2');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        });
    });

    describe('Refresh Navigated', function () {
        it('should call all lifecycle functions apart from disposed', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var link = stateController.getNavigationLink('s0');
            stateController.navigateLink(link);
            link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            var unloading, disposed, navigating, navigated;
            stateController.states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s2'].dispose = () => disposed = true;
            stateController.states['s2'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.states['s2'].navigated = () => navigated = true;
            stateController.refresh();
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Refresh Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var link = stateController.getNavigationLink('s0');
            stateController.navigateLink(link);
            link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            var unloading, disposed, navigating, navigated;
            stateController.states['s2'].unloading = (state, data, url, unload) => unloading = true;
            stateController.states['s2'].dispose = () => disposed = true;
            stateController.states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s2'].navigated = () => navigated = true;
            stateController.refresh();
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Refresh Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var link = stateController.getNavigationLink('s0');
            stateController.navigateLink(link);
            link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            var unloading, disposed, navigating, navigated;
            stateController.states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s2'].dispose = () => disposed = true;
            stateController.states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s2'].navigated = () => navigated = true;
            stateController.refresh();
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Back One Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            stateController.navigate('s1');
            var unloading, disposed, navigating, navigated;
            stateController.states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s1'].dispose = () => disposed = true;
            stateController.states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.states['s0'].navigated = () => navigated = true;
            var link = stateController.getNavigationBackLink(1);
            stateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.states['s0']);
        });
    });

    describe('Back One Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            stateController.navigate('s1');
            var unloading, disposed, navigating, navigated;
            stateController.states['s1'].unloading = (state, data, url, unload) => unloading = true;
            stateController.states['s1'].dispose = () => disposed = true;
            stateController.states['s0'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s0'].navigated = () => navigated = true;
            var link = stateController.getNavigationBackLink(1);
            stateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        });
    });

    describe('Back One Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            stateController.navigate('s1');
            var unloading, disposed, navigating, navigated;
            stateController.states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s1'].dispose = () => disposed = true;
            stateController.states['s0'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s0'].navigated = () => navigated = true;
            var link = stateController.getNavigationBackLink(1);
            stateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        });
    });

    describe('Back Two Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            link = stateController.getNavigationLink('s3');
            stateController.navigateLink(link);
            stateController.navigate('s4');
            var unloading, disposed, navigating, navigated;
            stateController.states['s4'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s4'].dispose = () => disposed = true;
            stateController.states['s2'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.states['s2'].navigated = () => navigated = true;
            stateController.navigateBack(2);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Back Two Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            link = stateController.getNavigationLink('s3');
            stateController.navigateLink(link);
            stateController.navigate('s4');
            var unloading, disposed, navigating, navigated;
            stateController.states['s4'].unloading = (state, data, url, unload) => unloading = true;
            stateController.states['s4'].dispose = () => disposed = true;
            stateController.states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s2'].navigated = () => navigated = true;
            stateController.navigateBack(2);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s4']);
        });
    });

    describe('Back Two Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
                { key: 's4', route: 'r4', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            link = stateController.getNavigationLink('s3');
            stateController.navigateLink(link);
            stateController.navigate('s4');
            var unloading, disposed, navigating, navigated;
            stateController.states['s4'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s4'].dispose = () => disposed = true;
            stateController.states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s2'].navigated = () => navigated = true;
            stateController.navigateBack(2);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s4']);
        });
    });

    describe('Back One By One Navigated', function () {
        it('should twice call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            var unloading, disposed, navigating, navigated;
            stateController.states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s2'].dispose = () => disposed = true;
            stateController.states['s1'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.states['s1'].navigated = () => navigated = true;
            stateController.navigateBack(1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            stateController.states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s1'].dispose = () => disposed = true;
            stateController.states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.states['s0'].navigated = () => navigated = true;
            var link = stateController.getNavigationBackLink(1);
            stateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.states['s0']);
        });
    });

    describe('Back One By One Unloading', function () {
        it('should twice only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            var unloading, disposed, navigating, navigated;
            stateController.states['s2'].unloading = (state, data, url, unload) => unloading = true;
            stateController.states['s2'].dispose = () => disposed = true;
            stateController.states['s1'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s1'].navigated = () => navigated = true;
            stateController.navigateBack(1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            var link = stateController.getNavigationBackLink(1);
            stateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Back One By One Navigating', function () {
        it('should twice only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            var unloading, disposed, navigating, navigated;
            stateController.states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.states['s2'].dispose = () => disposed = true;
            stateController.states['s1'].navigating = (data, url, navigate) => navigating = true;
            stateController.states['s1'].navigated = () => navigated = true;
            stateController.navigateBack(1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            var link = stateController.getNavigationBackLink(1);
            stateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Unloading Navigate', function () {
        it('should go to to State instead of initial State', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3' }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigate('s1');
            stateController.navigate('s2');
            var disposed = 0, unloading, navigated10, navigated01;
            stateController.states['s2'].unloading = (state, data, url, unload) => {
                if (!unloading) {
                    unloading = true;
                    stateController.navigateLink(link);
                } else {
                    unload();
                }
            }
            stateController.states['s2'].dispose = () => disposed++;
            stateController.states['s3'].navigated = () => navigated10 = true;
            stateController.states['s1'].navigated = () => navigated01 = true;
            stateController.navigate('s3');
            assert.strictEqual(disposed, 1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(navigated10, undefined);
            assert.strictEqual(navigated01, true);
            assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        });
    });

    describe('Navigating Navigate', function () {
        it('should go to to State instead of initial State', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3' }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            stateController.navigate('s1');
            stateController.navigate('s2');
            var disposed = 0, navigating, navigated10, navigated01;
            stateController.states['s2'].dispose = () => disposed++;
            stateController.states['s3'].navigating = (data, url, navigate) => {
                navigating = true;
                stateController.navigateLink(link);
            }
            stateController.states['s3'].navigated = () => navigated10 = true;
            stateController.states['s1'].navigated = () => navigated01 = true;
            stateController.navigate('s3');
            assert.strictEqual(disposed, 1);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated10, undefined);
            assert.strictEqual(navigated01, true);
            assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        });
    });

    describe('On Navigate', function () {
        it('should call onNavigate listener', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateController.navigate('s0');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateController.onNavigate(navigatedHandler);
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            stateController.offNavigate(navigatedHandler);
            assert.equal(oldStates[0], stateController.states['s0']);
            assert.equal(states[0], stateController.states['s1']);
            assert.equal(oldStates[1], stateController.states['s1']);
            assert.equal(states[1], stateController.states['s2']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Duplicate On Navigate', function () {
        it('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
            var oldStates = [];
            var states = [];
            stateController.navigate('s');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateController.onNavigate(navigatedHandler);
            assert.throws(() => stateController.onNavigate(navigatedHandler));
        });
    });

    describe('Duplicate On Off Navigate', function () {
        it('should call onNavigate listener', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateController.navigate('s0');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateController.onNavigate(navigatedHandler);
            stateController.offNavigate(navigatedHandler);
            stateController.onNavigate(navigatedHandler);
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            stateController.offNavigate(navigatedHandler);
            assert.equal(oldStates[0], stateController.states['s0']);
            assert.equal(states[0], stateController.states['s1']);
            assert.equal(oldStates[1], stateController.states['s1']);
            assert.equal(states[1], stateController.states['s2']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Copy On Navigate', function () {
        it('should call both onNavigate listeners', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateController.navigate('s0');
            var navigatedHandler1 = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            var navigatedHandler2 = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateController.onNavigate(navigatedHandler1);
            stateController.onNavigate(navigatedHandler2);
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            stateController.offNavigate(navigatedHandler1);
            stateController.offNavigate(navigatedHandler2);
            assert.equal(oldStates[0], stateController.states['s0']);
            assert.equal(states[0], stateController.states['s1']);
            assert.equal(oldStates[1], stateController.states['s0']);
            assert.equal(states[1], stateController.states['s1']);
            assert.equal(oldStates[2], stateController.states['s1']);
            assert.equal(states[2], stateController.states['s2']);
            assert.equal(oldStates[3], stateController.states['s1']);
            assert.equal(states[3], stateController.states['s2']);
            assert.equal(oldStates.length, 4);
            assert.equal(states.length, 4);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Multiple On Navigate', function () {
        it('should call multiple onNavigate listeners', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates1 = [];
            var states1 = [];
            var oldStates2 = [];
            var states2 = [];
            stateController.navigate('s0');
            var navigatedHandler1 = (oldState, state, data) => {
                oldStates1.push(oldState);
                states1.push(state);
            };
            var navigatedHandler2 = (oldState, state, data) => {
                oldStates2.push(oldState);
                states2.push(state);
            };
            stateController.onNavigate(navigatedHandler1);
            stateController.onNavigate(navigatedHandler2);
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.navigate('s2');
            stateController.offNavigate(navigatedHandler1);
            stateController.offNavigate(navigatedHandler2);
            assert.equal(oldStates1[0], stateController.states['s0']);
            assert.equal(states1[0], stateController.states['s1']);
            assert.equal(oldStates2[0], stateController.states['s0']);
            assert.equal(states2[0], stateController.states['s1']);
            assert.equal(oldStates1[1], stateController.states['s1']);
            assert.equal(states1[1], stateController.states['s2']);
            assert.equal(oldStates2[1], stateController.states['s1']);
            assert.equal(states2[1], stateController.states['s2']);
            assert.equal(oldStates1.length, 2);
            assert.equal(states1.length, 2);
            assert.equal(oldStates2.length, 2);
            assert.equal(states2.length, 2);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Off Navigate', function () {
        it('should stop calling onNavigate listener', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates = [];
            var states = [];
            stateController.navigate('s0');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateController.onNavigate(navigatedHandler);
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.offNavigate(navigatedHandler);
            stateController.offNavigate(navigatedHandler);
            stateController.navigate('s2');
            assert.equal(oldStates[0], stateController.states['s0']);
            assert.equal(states[0], stateController.states['s1']);
            assert.equal(oldStates.length, 1);
            assert.equal(states.length, 1);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Multiple Off Navigate', function () {
        it('should individually stop calling onNavigate listeners', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var oldStates1 = [];
            var states1 = [];
            var oldStates2 = [];
            var states2 = [];
            stateController.navigate('s0');
            var navigatedHandler1 = (oldState, state, data) => {
                oldStates1.push(oldState);
                states1.push(state);
            };
            var navigatedHandler2 = (oldState, state, data) => {
                oldStates2.push(oldState);
                states2.push(state);
            };
            stateController.onNavigate(navigatedHandler1);
            stateController.onNavigate(navigatedHandler2);
            var link = stateController.getNavigationLink('s1');
            stateController.navigateLink(link);
            stateController.offNavigate(navigatedHandler1);
            stateController.navigate('s2');
            stateController.offNavigate(navigatedHandler2);
            assert.equal(oldStates1[0], stateController.states['s0']);
            assert.equal(states1[0], stateController.states['s1']);
            assert.equal(oldStates2[0], stateController.states['s0']);
            assert.equal(states2[0], stateController.states['s1']);
            assert.equal(oldStates2[1], stateController.states['s1']);
            assert.equal(states2[1], stateController.states['s2']);
            assert.equal(oldStates1.length, 1);
            assert.equal(states1.length, 1);
            assert.equal(oldStates2.length, 2);
            assert.equal(states2.length, 2);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Unloading Navigate And Continue', function () {
        it('should go to to State instead of initial State', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3' }
            ]);
            stateController.navigate('s0');
            stateController.navigate('s1');
            stateController.states['s1'].unloading = (state, data, url, unload) => {
                if (data.x)
                    stateController.navigate('s2');
                unload();
            }
            var navigating;
            stateController.states['s3'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.navigate('s3', { x: true });
            assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            assert.equal(stateController.stateContext.previousState, stateController.states['s1']);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
            assert.strictEqual(navigating, undefined);
        });
    });

    describe('Unloading Navigate Url And Continue', function () {
        it('should go to State once', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' }
            ]);
            stateController.navigate('s0');
            stateController.navigate('s1');
            var unloading;
            stateController.states['s1'].unloading = (state, data, url, unload) => {
                if (!unloading) {
                    unloading = true;
                    stateController.navigateLink(url);
                }
                unload();
            }
            var navigating = 0;
            stateController.states['s2'].navigating = (data, url, navigate) => {
                navigating++;
                navigate();
            }
            stateController.navigate('s2');
            assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            assert.equal(stateController.stateContext.previousState, null);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
            assert.strictEqual(navigating, 1);
        });
    });

    describe('Navigating Navigate And Continue', function () {
        it('should go to to State instead of initial State', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0'},
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true},
                { key: 's3', route: 'r3' }
            ]);
            stateController.navigate('s0');
            stateController.navigate('s1');
            stateController.states['s3'].navigating = (data, url, navigate) => {
                stateController.navigate('s2');
                navigate();
            }
            stateController.navigate('s3');
            assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            assert.equal(stateController.stateContext.previousState, stateController.states['s1']);
            assert.equal(stateController.stateContext.state, stateController.states['s2']);
        });
    });

    describe('Navigated Navigate On Navigate', function () {
        it('should call onNavigate listener once', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            stateController.navigate('s1');
            stateController.states['s2'].navigated = () => {
                stateController.navigate('s3');
            }
            var navigatedState;
            var hits = 0;
            var navigatedHandler = (oldState, state, data) => {
                navigatedState = state;
                hits++;
            };
            stateController.onNavigate(navigatedHandler);
            stateController.navigate('s2');
            stateController.offNavigate(navigatedHandler);
            assert.equal(hits, 1);
            assert.equal(navigatedState, stateController.stateContext.state);
            assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            assert.equal(stateController.stateContext.previousState, stateController.states['s2']);
            assert.equal(stateController.stateContext.state, stateController.states['s3']);
        });
    });

    describe('State Params Navigated', function () {
        it('should pass State and Data but no old State', function() {
            var stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
            var navigateLinkOldState, navigateLinkState, navigateLinkUrl, navigateLinkData,
                navigatedOldState, navigatedState, navigatedData, navigatingData, navigatingUrl;
            stateController.states['s'].navigating = (data, url, navigating) => {
                navigatingData = data;
                navigatingUrl = url;
                navigating();
            }
            stateController.states['s'].stateHandler.navigateLink = (oldState, state, url) => {
                navigateLinkOldState = oldState;
                navigateLinkState = state;
                navigateLinkUrl = url;
                navigateLinkData = stateController.stateContext.data;
            }
            var navigatedHandler = (oldState, state, data) => {
                navigatedOldState = oldState;
                navigatedState = state;
                navigatedData = data;
            };
            stateController.onNavigate(navigatedHandler);
            var url = stateController.getNavigationLink('s', { s: 'Hello' });
            stateController.navigate('s', { s: 'Hello' });
            stateController.offNavigate(navigatedHandler);
            assert.strictEqual(navigatingData.s, 'Hello');
            assert.strictEqual(navigatingUrl, url);
            assert.strictEqual(navigateLinkOldState, null);
            assert.strictEqual(navigateLinkState, stateController.states['s']);
            assert.strictEqual(navigateLinkUrl, url);
            assert.strictEqual(navigateLinkData.s, undefined);
            assert.strictEqual(navigatedOldState, null);
            assert.strictEqual(navigatedState, stateController.states['s']);
            assert.strictEqual(navigatedData.s, 'Hello');
            assert.strictEqual(stateController.stateContext.data.s, 'Hello');
        });
    });

    describe('Transition Params Navigated', function () {
        it('should pass old State, State and Data', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var link = stateController.getNavigationLink('s0');
            stateController.navigateLink(link);
            var unloadingState, unloadingUrl, navigateLinkOldState, navigateLinkState, navigateLinkUrl, 
                navigatedOldState, navigatedState, navigatedData, navigatingData, navigatingUrl;
            stateController.states['s0'].unloading = (state, data, url, unload) => {
                unloadingState = state;
                unloadingUrl = url;
                unload();
            }
            stateController.states['s1'].navigating = (data, url, navigating) => {
                navigatingData = data;
                navigatingUrl = url;
                navigating();
            }
            stateController.states['s1'].stateHandler.navigateLink = (oldState, state, url) => {
                navigateLinkOldState = oldState;
                navigateLinkState = state;
                navigateLinkUrl = url;
            }
            var navigatedHandler = (oldState, state, data) => {
                navigatedOldState = oldState;
                navigatedState = state;
                navigatedData = data;
            };
            stateController.onNavigate(navigatedHandler);
            var url = stateController.getNavigationLink('s1', { s: 'Hello' });
            stateController.navigate('s1', { s: 'Hello' });
            stateController.offNavigate(navigatedHandler);
            assert.strictEqual(unloadingState, stateController.states['s1']);
            assert.strictEqual(unloadingUrl, url);
            assert.strictEqual(navigatingData.s, 'Hello');
            assert.strictEqual(navigatingUrl, url);
            assert.strictEqual(navigateLinkOldState, stateController.states['s0']);
            assert.strictEqual(navigateLinkState, stateController.states['s1']);
            assert.strictEqual(navigateLinkUrl, url);
            assert.strictEqual(navigatedOldState, stateController.states['s0']);
            assert.strictEqual(navigatedState, stateController.states['s1']);
            assert.strictEqual(navigatedData.s, 'Hello');
        });
    });

    describe('History Navigate', function () {
        it('should pass history flag to lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            var unloadingHistory, navigatingHistory;
            stateController.states['s0'].unloading = (state, data, url, unload, history) => {
                unloadingHistory = history; 
                unload();
            }
            stateController.states['s1'].navigating = (data, url, navigate, history) => {
                navigatingHistory = history;
                navigate();
            }
            stateController.navigateLink(link, undefined, true);
            assert.strictEqual(unloadingHistory, true);
            assert.strictEqual(navigatingHistory, true);
        });
    });

    describe('Non History Navigate', function () {
        it('should not pass history flag to lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0'},
                { key: 's1', route: 'r1' }
            ]);
            stateController.navigate('s0');
            var link = stateController.getNavigationLink('s1');
            var unloadingHistory, navigatingHistory;
            stateController.states['s0'].unloading = (state, data, url, unload, history) => {
                unloadingHistory = history; 
                unload();
            }
            stateController.states['s1'].navigating = (data, url, navigate, history) => {
                navigatingHistory = history;
                navigate();
            }
            stateController.navigateLink(link);
            assert.strictEqual(unloadingHistory, false);
            assert.strictEqual(navigatingHistory, false);
        });
    });

    describe('Async Data Navigating', function () {
        it('should pass async data to navigated function', function(done: MochaDone) {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0'},
                { key: 's1', route: 'r1' }
            ]);
            stateController.navigate('s0');
            stateController.states['s1'].navigated = (data, asyncData) => {
                assert.equal(asyncData, 'hello');
                done();
            }
            stateController.states['s1'].navigating = (data, url, navigate) => {
                setTimeout(() => navigate('hello'), 0);
            }
            stateController.navigate('s1');
        });
    });

    describe('Async Data Navigating Navigating', function () {
        it('should pass async data to navigated function once', function(done: MochaDone) {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateController.navigate('s0');
            stateController.states['s1'].navigated = (data, asyncData) => {
                assert.equal(asyncData, 0);
            }
            var i = 0;
            stateController.states['s1'].navigating = (data, url, navigate) => {
                ((count) => setTimeout(() => {
                    navigate(count);
                    if (count === 1)
                        done();
                }, 0))(i);
                i++;
            }
            stateController.navigate('s1');
            stateController.navigate('s1');
        });
    });

    describe('Reversed Async Data Navigating Navigating', function () {
        it('should pass second async data to navigated function', function(done: MochaDone) {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0'},
                { key: 's1', route: 'r1' }
            ]);
            stateController.navigate('s0');
            stateController.states['s1'].navigated = (data, asyncData) => {
                assert.equal(asyncData, 1);
            }
            var i = 0;
            stateController.states['s1'].navigating = (data, url, navigate) => {
                ((count) => setTimeout(() => { 
                    navigate(count);
                    if (count === 0)
                        done();
                }, 5 - 5 * count))(i);
                i++;
            }
            stateController.navigate('s1');
            stateController.navigate('s1');
        });
    });

    describe('No Async Data Navigating', function () {
        it('should not pass any async data', function(done: MochaDone) {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            stateController.navigate('s0');
            stateController.states['s1'].navigated = (data, asyncData) => {
                stateController.navigate('s2');
            }
            stateController.states['s2'].navigated = (data, asyncData) => {
                assert.equal(asyncData, undefined);
                done();
            }
            stateController.states['s1'].navigating = (data, url, navigate) => {
                setTimeout(() => navigate('hello'), 0);
            }
            stateController.navigate('s1');
        });
    });

    describe('Route Navigate', function () {
        it('should go to State', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 's' },
                { key: 's1', route: 'abc/{x}' }
            ]);
            stateController.navigateLink('/abc/de');
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
            stateController.navigateLink('/s');
            assert.equal(stateController.stateContext.state, stateController.states['s0']);
        });
    });

    describe('Route Root Navigate', function () {
        it('should go to State', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: '{y}' },
                { key: 's1', route: 's' }
            ]);
            stateController.navigateLink('/sa');
            assert.equal(stateController.stateContext.state, stateController.states['s0']);
            stateController.navigateLink('/s');
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        });
    });

    describe('Two Route Navigate', function () {
        it('should go to State', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 's' },
                { key: 's1', route: ['abc/{x}', 'def/{y}'] }
            ]);
            stateController.navigateLink('/abc/de');
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
            stateController.navigateLink('/def/gh');
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
            stateController.navigateLink('/s');
            assert.equal(stateController.stateContext.state, stateController.states['s0']);
        });
    });

    describe('Two Route Root Navigate', function () {
        it('should go to State', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: ['abc/{x}', '{y}'] },
                { key: 's1', route: 's' }
            ]);
            stateController.navigateLink('/abc/de');
            assert.equal(stateController.stateContext.state, stateController.states['s0']);
            stateController.navigateLink('/sa');
            assert.equal(stateController.stateContext.state, stateController.states['s0']);
            stateController.navigateLink('/s');
            assert.equal(stateController.stateContext.state, stateController.states['s1']);
        });
    });

    describe('Clear State Context', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s');
                stateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should clear State context', function() {
                stateController.stateContext.clear();
                assert.strictEqual(stateController.stateContext.oldState, null);
                assert.strictEqual(stateController.stateContext.previousState, null);
                assert.strictEqual(stateController.stateContext.state, null);
                assert.strictEqual(stateController.stateContext.url, null);
                assert.strictEqual(stateController.stateContext.title, null);
                assert.strictEqual(stateController.stateContext.crumbs.length, 0);
                assert.strictEqual(stateController.stateContext.crumbTrail.length, 0);
                assert.strictEqual(stateController.stateContext.nextCrumb, null);
            });
        }
    });

    describe('History Null', function () {
        var replaceHistory;
        var stateController: StateController;
        beforeEach(function() {
            var historyManager = new Navigation.HashHistoryManager();
            replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController = new Navigation.StateController([
                    { key: 's', route: 'r' }
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
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
        var stateController: StateController;
        beforeEach(function() {
            var historyManager = new Navigation.HashHistoryManager();
            replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController = new Navigation.StateController([
                    { key: 's', route: 'r' }
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s', null, Navigation.HistoryAction.Add);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link, Navigation.HistoryAction.Add);
            });
            test();
        });
        
        function test() {
            it('should pass replace false to history manager', function() {
                assert.strictEqual(replaceHistory, false);
            });
        }
    });

    describe('History Replace', function () {
        var replaceHistory;
        var stateController: StateController;
        beforeEach(function() {
            var historyManager = new Navigation.HashHistoryManager();
            replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController = new Navigation.StateController([
                    { key: 's', route: 'r' }
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s', null, Navigation.HistoryAction.Replace);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link, Navigation.HistoryAction.Replace);
            });
            test();
        });
        
        function test() {
            it('should pass replace true to history manager', function() {
                assert.strictEqual(replaceHistory, true);
            });
        }
    });

    describe('History None', function () {
        var replaceHistory;
        var stateController: StateController;
        beforeEach(function() {
            var historyManager = new Navigation.HashHistoryManager();
            replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController = new Navigation.StateController([
                    { key: 's', route: 'r' }
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s', null, Navigation.HistoryAction.None);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link, Navigation.HistoryAction.None);
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
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('s');
            var historyManager = new Navigation.HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController.configure(dialogs, historyManager);
            stateController.refresh();
            assert.strictEqual(replaceHistory, false);
        });
    });

    describe('History Add Refresh Navigate', function () {
        it('should pass replace false to history manager', function() {
            var dialogs = [
                { key: 's', route: 'r' }
            ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('s');
            var historyManager = new Navigation.HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController.configure(dialogs, historyManager);
            stateController.refresh(null, Navigation.HistoryAction.Add);
            assert.strictEqual(replaceHistory, false);
        });
    });

    describe('History Replace Refresh Navigate', function () {
        it('should pass replace true to history manager', function() {
            var dialogs = [
                { key: 's', route: 'r' }
            ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('s');
            var historyManager = new Navigation.HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController.configure(dialogs, historyManager);
            stateController.refresh(null, Navigation.HistoryAction.Replace);
            assert.strictEqual(replaceHistory, true);
        });
    });

    describe('History None Refresh Navigate', function () {
        it('should not call history manager', function() {
            var dialogs = [
                { key: 's', route: 'r' }
            ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('s');
            var historyManager = new Navigation.HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController.configure(dialogs, historyManager);
            stateController.refresh(null, Navigation.HistoryAction.None);
            assert.strictEqual(replaceHistory, undefined);
        });
    });

    describe('History Null Back Navigate', function () {
        it('should pass replace false to history manager', function() {
            var dialogs = [
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('s0');
            stateController.navigate('s1');
            var historyManager = new Navigation.HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController.configure(dialogs, historyManager);
            stateController.navigateBack(1);
            assert.strictEqual(replaceHistory, false);
        });
    });

    describe('History Add Back Navigate', function () {
        it('should pass replace false to history manager', function() {
            var dialogs = [
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('s0');
            stateController.navigate('s1');
            var historyManager = new Navigation.HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController.configure(dialogs, historyManager);
            stateController.navigateBack(1, Navigation.HistoryAction.Add);
            assert.strictEqual(replaceHistory, false);
        });
    });

    describe('History Replace Back Navigate', function () {
        it('should pass replace true to history manager', function() {
            var dialogs = [
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('s0');
            stateController.navigate('s1');
            var historyManager = new Navigation.HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController.configure(dialogs, historyManager);
            stateController.navigateBack(1, Navigation.HistoryAction.Replace);
            assert.strictEqual(replaceHistory, true);
        });
    });

    describe('History None Back Navigate', function () {
        it('should not call history manager', function() {
            var dialogs = [
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('s0');
            stateController.navigate('s1');
            var historyManager = new Navigation.HashHistoryManager();
            var replaceHistory = undefined;
            historyManager.addHistory = (url: string, replace: boolean) => {
                replaceHistory = replace;
            }
            stateController.configure(dialogs, historyManager);
            stateController.navigateBack(1, Navigation.HistoryAction.None);
            assert.strictEqual(replaceHistory, undefined);
        });
    });

    describe('History Navigated Navigate', function () {
        it('should not call history manager', function() {
            var called = false;
            var historyManager = new Navigation.HashHistoryManager();
            historyManager.addHistory = (url: string, replace: boolean) => {
                called = true;
            }
            var stateController = new Navigation.StateController([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' }
                ],
                historyManager
            );
            stateController.states['s0'].navigated = () => {
                stateController.navigate('s1', null, Navigation.HistoryAction.None);
            }
            stateController.navigate('s0');
            assert.ok(!called);
        });
    });

    describe('Reload Dialog', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r' }
            ]);
            stateController.navigate('s0');
            stateController.configure([
                { key: 's1', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Reload Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r' }
            ]);
            stateController.navigate('s0');
            stateController.stateContext.clear();
            stateController.configure([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s0']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r' }
            ]);
            stateController.navigate('s0');
            stateController.stateContext.clear();
            stateController.configure([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate current State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r' }
            ]);
            stateController.navigate('s0');
            stateController.stateContext.clear();
            stateController.configure([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Error Dialog', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's', route: 'r' }
            ]);
            try {
                stateController.configure([<any>
                    { key: '' }
                ]);
            } catch(e) {
            }
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s');
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s']);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Reload Error Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            try {
                stateController.configure([<any>
                    { key: '' }
                ]);
            } catch(e) {
            }
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s0']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Error Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            try {
                stateController.configure([<any>
                    { key: '' }
                ]);
            } catch(e) {
            }
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate current State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Error Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            try {
                stateController.configure([<any>
                    { key: '' }
                ]);
            } catch(e) {
            }
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Two Controllers Dialog', function() {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function() {
            stateController0 = new Navigation.StateController([
                { key: 's0', route: 'r' }
            ]);
            stateController1 = new Navigation.StateController([
                { key: 's1', route: 'r' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('s0');
                stateController1.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('s0');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('s1');
                stateController1.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate State', function() {
                assert.equal(stateController0.stateContext.state, stateController0.states['s0']);
                assert.equal(stateController1.stateContext.state, stateController1.states['s1']);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController0.stateContext.crumbs.length, 0);
                assert.equal(stateController1.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Two Controllers Transition', function() {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function() {
            stateController0 = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateController1 = new Navigation.StateController([
                { key: 's2', route: 'r0' },
                { key: 's3', route: 'r1', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('s0');
                stateController1.navigate('s2');
                stateController0.navigate('s1');
                stateController1.navigate('s3');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('s0');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('s2');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationLink('s1');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('s3');
                stateController1.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate State', function() {
                assert.equal(stateController0.stateContext.state, stateController0.states['s1']);
                assert.equal(stateController1.stateContext.state, stateController1.states['s3']);
            });
            it('should populate old State', function() {
                assert.equal(stateController0.stateContext.oldState, stateController0.states['s0']);
                assert.equal(stateController1.stateContext.oldState, stateController1.states['s2']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController0.stateContext.previousState, stateController0.states['s0']);
                assert.equal(stateController1.stateContext.previousState, stateController1.states['s2']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController0.stateContext.crumbs.length, 1);
                assert.equal(stateController0.stateContext.crumbs[0].state, stateController0.states['s0']);
                assert.ok(stateController0.stateContext.crumbs[0].last);
                assert.equal(stateController1.stateContext.crumbs.length, 1);
                assert.equal(stateController1.stateContext.crumbs[0].state, stateController1.states['s2']);
                assert.ok(stateController1.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Two Controllers Refresh', function() {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function() {
            stateController0 = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateController1 = new Navigation.StateController([
                { key: 's2', route: 'r0' },
                { key: 's3', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('s0');
                stateController1.navigate('s2');
                stateController0.navigate('s1');
                stateController1.navigate('s3');
                stateController0.refresh();
                stateController1.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('s0');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('s2');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationLink('s1');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('s3');
                stateController1.navigateLink(link);
                link = stateController0.getRefreshLink();
                stateController0.navigateLink(link);
                link = stateController1.getRefreshLink();
                stateController1.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should populate State', function() {
                assert.equal(stateController0.stateContext.state, stateController0.states['s1']);
                assert.equal(stateController1.stateContext.state, stateController1.states['s3']);
            });
            it('should populate old State', function() {
                assert.equal(stateController0.stateContext.oldState, stateController0.states['s1']);
                assert.equal(stateController1.stateContext.oldState, stateController1.states['s3']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController0.stateContext.previousState, stateController0.states['s0']);
                assert.equal(stateController1.stateContext.previousState, stateController1.states['s2']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController0.stateContext.crumbs.length, 1);
                assert.equal(stateController0.stateContext.crumbs[0].state, stateController0.states['s0']);
                assert.ok(stateController0.stateContext.crumbs[0].last);
                assert.equal(stateController1.stateContext.crumbs.length, 1);
                assert.equal(stateController1.stateContext.crumbs[0].state, stateController1.states['s2']);
                assert.ok(stateController1.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Two Controllers Back', function() {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function() {
            stateController0 = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateController1 = new Navigation.StateController([
                { key: 's3', route: 'r0' },
                { key: 's4', route: 'r1', trackCrumbTrail: true },
                { key: 's5', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('s0');
                stateController1.navigate('s3');
                stateController0.navigate('s1');
                stateController1.navigate('s4');
                stateController0.navigate('s2');
                stateController1.navigate('s5');
                stateController0.navigateBack(1);
                stateController1.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('s0');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('s3');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationLink('s1');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('s4');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationLink('s2');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('s5');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationBackLink(1);
                stateController0.navigateLink(link);
                link = stateController1.getNavigationBackLink(1);
                stateController1.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController0.stateContext.state, stateController0.states['s1']);
                assert.equal(stateController1.stateContext.state, stateController1.states['s4']);
            });
            it('should populate old State', function() {
                assert.equal(stateController0.stateContext.oldState, stateController0.states['s2']);
                assert.equal(stateController1.stateContext.oldState, stateController1.states['s5']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController0.stateContext.previousState, stateController0.states['s0']);
                assert.equal(stateController1.stateContext.previousState, stateController1.states['s3']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController0.stateContext.crumbs.length, 1);
                assert.equal(stateController0.stateContext.crumbs[0].state, stateController0.states['s0']);
                assert.ok(stateController0.stateContext.crumbs[0].last);
                assert.equal(stateController1.stateContext.crumbs.length, 1);
                assert.equal(stateController1.stateContext.crumbs[0].state, stateController1.states['s3']);
                assert.ok(stateController1.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Reload History', function () {
        it('should call stop', function() {
            var dialogs = [
                { key: 's', route: 'r' }
            ];
            var stateController = new Navigation.StateController(dialogs);
            var stop = false;
            stateController.historyManager.stop = () => stop = true;
            stateController.configure(dialogs);
            assert.strictEqual(stop, true);
        });
    });

    describe('Two Controllers History Navigate', function() {
        it('should add history', function() {
            var stateController0 = new Navigation.StateController([
                { key: 's', route: 'r0' }
            ]);
            var stateController1 = new Navigation.StateController([
                { key: 's', route: 'r1' }
            ]);
            var url0, url1;
            stateController0.historyManager.addHistory = (url) => url0 = url;
            stateController1.historyManager.addHistory = (url) => url1 = url;
            stateController0.navigate('s');
            stateController1.navigate('s');        
            assert.strictEqual(url0, '/r0');
            assert.strictEqual(url1, '/r1');
        });
    });
    
    describe('Crumb Trail Route Param', function() {
        var stateController: StateController;
        var s2Link: string; 
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{crumb?}', trackCrumbTrail: true },
                { key: 's2', route: 'r2/{crumb?}', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                s2Link = stateController.stateContext.url;
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                s2Link = stateController.stateContext.url;
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.equal(s2Link.slice(1).split('/').length, 2);
                assert.equal(s2Link.indexOf('?'), -1);
                assert.equal(stateController.stateContext.url.indexOf('?'), -1);
            })          
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Crumb Trail Route Splat Param', function() {
        var stateController: StateController;
        var s2Link: string; 
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{*crumb?}', trackCrumbTrail: true },
                { key: 's2', route: 'r2/{*crumb?}', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                s2Link = stateController.stateContext.url;
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                s2Link = stateController.stateContext.url;
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.equal(s2Link.slice(1).split('/').length, 3);
                assert.equal(s2Link.indexOf('?'), -1);
                assert.equal(stateController.stateContext.url.indexOf('?'), -1);
            })          
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s2']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Crumb Trail Mixed Param', function() {
        var stateController: StateController;
        var s2Link: string; 
        var s3Link: string; 
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2/{*crumb?}', trackCrumbTrail: true },
                { key: 's3', route: 'r3/{crumb?}', trackCrumbTrail: true }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                s2Link = stateController.stateContext.url;
                stateController.navigate('s3');
                s3Link = stateController.stateContext.url;
                stateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                s2Link = stateController.stateContext.url;
                link = stateController.getNavigationLink('s3');
                stateController.navigateLink(link);
                s3Link = stateController.stateContext.url;
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.equal(s2Link.slice(1).split('/').length, 3);
                assert.equal(s3Link.slice(1).split('/').length, 2);
                assert.equal(s2Link.indexOf('?'), -1);
                assert.equal(s3Link.indexOf('?'), -1);
                assert.notEqual(stateController.stateContext.url.indexOf('?'), -1);
            })          
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s3']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Crumb Trail Mandatory Route Param', function() {
        it ('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{crumb}', trackCrumbTrail: true }
            ]);
            stateController.navigate('s0');
            assert.throws(() => stateController.navigate('s1'), /cannot be a mandatory route parameter/);
        });
    });
    
    describe('Crumb Trail Key', function() {
        var stateController: StateController;
        var s1Link: string, s2Link: string;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: 'trail' }
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                s2Link = stateController.stateContext.url;
                stateController.navigateBack(1);
                s1Link = stateController.stateContext.url;
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                s2Link = stateController.stateContext.url;
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                s1Link = stateController.stateContext.url;
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.strictEqual(stateController.states['s2'].trackCrumbTrail, true);
                assert.notEqual(s1Link.indexOf('crumb'), -1);
                assert.equal(s1Link.indexOf('trail'), -1);
                assert.equal(s2Link.indexOf('crumb'), -1);
                assert.notEqual(s2Link.indexOf('trail'), -1);
            })          
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s0']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
            });
            it('should not populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });
    
    describe('Refresh Back Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateController.states['s1'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.refresh();
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s1']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Crumb Trail Malicious', function() {
        it ('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: '{x}' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateController.navigateLink('/r1?crumb=%2Fwww.google.com');
            stateController.navigateBack(1);
            assert(stateController.stateContext.data.x, 'www.google.com');
            assert.throws(() => stateController.navigateLink('/r1?crumb=www.google.com'), /is not a valid crumb/);
        });
    });
    
    describe('Crumb Trail Invalid', function() {
        it ('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            assert.throws(() => stateController.navigateLink('/r1?crumb=%2Fr2'), /The Url is invalid/);
        });
    });
    
    describe('Crumb Trail Encode', function() {
        it ('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateController.states['s1'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return encodeURIComponent(val).replace('%2F', '/');
            }
            stateController.navigate('s0');
            stateController.navigate('s1');
            assert.equal(stateController.stateContext.url, '/r1?crumb=/r0');
            stateController.navigateBack(1);
            assert.equal(stateController.stateContext.state, stateController.states['s0']);
        });
    });
    
    describe('Repeated States With Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true },
            ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('s0');
                stateController.navigate('s1');
                stateController.navigate('s2');
                stateController.navigate('s3');
                stateController.navigate('s1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('s0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s2');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s3');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('s1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate State', function() {
                assert.equal(stateController.stateContext.state, stateController.states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.states['s3']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.states['s0']);
            });
            it('should populate crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
});
