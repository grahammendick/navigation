/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
import Navigation = require('../src/Navigation');
import StateController = require('../src/StateController');

describe('Navigation', function () {
    describe('Dialog', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should go to initial State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].initial);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Invalid Dialog', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            it('should throw error', function(){
                assert.throws(() => stateController.navigate('d0'));
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function(){
                assert.throws(() => stateController.getNavigationLink('d0'));
            });
        });
    });

    describe('Cross Dialog', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's1', states: [
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].initial);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d0'].states['s0']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d0']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Cross Dialog Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's1', states: [
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].initial);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d0'].initial);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d0']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Dialog Dialog', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].initial);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.stateContext.state);
                assert.equal(stateController.stateContext.oldDialog, stateController.stateContext.dialog);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Dialog Dialog Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
            });
            test();            
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].initial);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].initial);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });
    
    describe('Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('First Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' },
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t0');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Second Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' },
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's1', route: 'r1' },
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Invalid Action', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });

        describe('Navigate', function() {
            it('should throw error', function() {
                stateController.navigate('d');
                assert.throws(() => stateController.navigate('t1'));            
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                assert.throws(() => stateController.getNavigationLink('t1'));
            });
        });
    });

    describe('Null Action', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });

        describe('Navigate', function() {
            it('should throw error', function() {
                stateController.navigate('d');
                assert.throws(() => stateController.navigate(null));            
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                assert.throws(() => stateController.getNavigationLink(null));
            });
        });
    });
    
    describe('Transition From Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                var link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.stateContext.dialog.initial);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.stateContext.dialog.initial);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Transition Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t0');
                stateController.navigate('t1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s1']);
            });
            it('should have crumb trail of length 2', function() {
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.equal(stateController.stateContext.crumbs[1].state, stateController.stateContext.previousState);
                assert.ok(!stateController.stateContext.crumbs[0].last);
                assert.ok(stateController.stateContext.crumbs[1].last);
            });
        }
    });
    
    describe('Transition Transition Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t0');
                stateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });
    
    describe('Dialog and Transition Match', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 'd', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to current State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should not change crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.dialogs['d'].states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Refresh Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to current State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });
    
    describe('Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t0');
                stateController.navigate('t1');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s2']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should reduce crumb trail by one', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.dialogs['d'].states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Back Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t0');
                stateController.navigate('t1');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s2']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Back Two', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't2', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't3', to: 's4' }
                    ]},
                    { key: 's4', route: 'r4', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t0');
                stateController.navigate('t1');
                stateController.navigate('t2');
                stateController.navigate('t3');
                stateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t2');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t3');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[2]);
                assert.equal(stateController.stateContext.dialog, stateController._dialogs[0]);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController.stateContext.oldState, stateController._dialogs[0]._states[4]);
                assert.equal(stateController.stateContext.oldDialog, stateController._dialogs[0]);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController._dialogs[0]._states[1]);
                assert.equal(stateController.stateContext.previousDialog, stateController._dialogs[0]);
            });
            it('should reduce crumb trail by two', function() {
                assert.equal(stateController.stateContext.crumbs.length, 2);
                assert.ok(!stateController.stateContext.crumbs[0].last);
                assert.ok(stateController.stateContext.crumbs[1].last);
                for (var i = 0; i < stateController.stateContext.crumbs.length; i++) {
                    assert.equal(stateController.stateContext.crumbs[i].state, stateController._dialogs[0]._states[i]);
                }
            });
        }
    });

    describe('Back Two Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false, transitions: [
                        { key: 't2', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't3', to: 's4' }
                    ]},
                    { key: 's4', route: 'r4', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t0');
                stateController.navigate('t1');
                stateController.navigate('t2');
                stateController.navigate('t3');
                stateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t2');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t3');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[2]);
                assert.equal(stateController.stateContext.dialog, stateController._dialogs[0]);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController.stateContext.oldState, stateController._dialogs[0]._states[4]);
                assert.equal(stateController.stateContext.oldDialog, stateController._dialogs[0]);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Back One By One', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[1]);
                assert.equal(stateController.stateContext.dialog, stateController._dialogs[0]);
            });
            it('should populate old State with previous State', function() {
                assert.equal(stateController.stateContext.oldState, stateController._dialogs[0]._states[2]);
                assert.equal(stateController.stateContext.oldDialog, stateController._dialogs[0]);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController._dialogs[0]._states[0]);
                assert.equal(stateController.stateContext.previousDialog, stateController._dialogs[0]);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Back One By One Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[1]);
                assert.equal(stateController.stateContext.dialog, stateController._dialogs[0]);
            });
            it('should populate old State with previous State', function() {
                assert.equal(stateController.stateContext.oldState, stateController._dialogs[0]._states[2]);
                assert.equal(stateController.stateContext.oldDialog, stateController._dialogs[0]);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Can Navigate Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
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

    describe('Without Trail Can Navigate Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
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

    describe('Invalid Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
            });
            it('should throw error', function() {
                assert.throws(() => stateController.navigateBack(3));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.getNavigationBackLink(3));
            });
        });
    });

    describe('Without Trail Invalid Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
            });
            it('should throw error', function() {
                assert.throws(() => stateController.navigateBack(1));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.getNavigationBackLink(1));
            });
        });
    });

    describe('Back Invalid Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.navigateBack(2));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.getNavigationBackLink(2));
            });
        });
    });

    describe('Back Without Trail Invalid Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.navigateBack(1));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => stateController.getNavigationBackLink(1));
            });
        });
    });

    describe('Back Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigateBack(1);
                stateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(stateController.stateContext.state, stateController._dialogs[0].states['s0']);
                assert.equal(stateController.stateContext.dialog, stateController._dialogs[0]);
            });
            it('should populate old State with previous State', function() {
                assert.equal(stateController.stateContext.oldState, stateController._dialogs[0].states['s0']);
                assert.equal(stateController.stateContext.oldDialog, stateController._dialogs[0]);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Back Without Trail Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigateBack(1);
                stateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(stateController.stateContext.state, stateController._dialogs[0].states['s0']);
                assert.equal(stateController.stateContext.dialog, stateController._dialogs[0]);
            });
            it('should populate old State with previous State', function() {
                assert.equal(stateController.stateContext.oldState, stateController._dialogs[0].states['s0']);
                assert.equal(stateController.stateContext.oldDialog, stateController._dialogs[0]);
            });
            it('should note populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Back Refresh Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't0', to: 's2' },
                        { key: 't1', to: 's3' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t0');
                stateController.navigateBack(1);
                stateController.refresh();
                stateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s3']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State with previous State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State with previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should not change crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 2);
                assert.ok(!stateController.stateContext.crumbs[0].last);
                assert.ok(stateController.stateContext.crumbs[1].last);
                for (var i = 0; i < stateController.stateContext.crumbs.length; i++) {
                    assert.equal(stateController.stateContext.crumbs[i].state, stateController._dialogs[0]._states[i]);
                }
            });
        }
    });

    describe('Back Without Trail Refresh Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't0', to: 's2' },
                        { key: 't1', to: 's3' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t0');
                stateController.navigateBack(1);
                stateController.refresh();
                stateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s3']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State with previous State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State with previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should not change crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.ok(stateController.stateContext.crumbs[0].last);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController._dialogs[0]._states[1]);
            });
        }
    });

    describe('Transition Without Trail Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.ok(stateController.stateContext.crumbs[0].last);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController._dialogs[0]._states[1]);
            });
        }
    });

    describe('Crumb Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's4' }
                    ]},
                    { key: 's4', route: 'r4', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should match', function() {
                assert.equal(stateController.stateContext.url.match(/crumb/g).length, 4);
            });
            it('should populate crumb State', function() {
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.crumbs[1].state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.crumbs[2].state, stateController.dialogs['d'].states['s2']);
                assert.equal(stateController.stateContext.crumbs[3].state, stateController.dialogs['d'].states['s3']);
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

    describe('Dialog Dialog Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'r0' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r1', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('d1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.dialogs['d0'].states['s']);
            });
        }
    });

    describe('Cross Dialog Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r2', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t');
                stateController.navigate('d1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should have crumb trail of length 2', function() {
                assert.equal(stateController.stateContext.crumbs.length, 2);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.dialogs['d0'].states['s0']);
                assert.equal(stateController.stateContext.crumbs[1].state, stateController.dialogs['d0']._states[1]);
            });
        }
    });

    describe('Dialog Dialog Back Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'r0' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r1', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('d1');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous Dialog', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d0']._states[0]);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d0']);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Cross Dialog Back Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r2', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                var newCrumbs = [];
                for (var i = 0; i < crumbs.length; i++) {
                    if (crumbs[i].state === state)
                        break;
                    newCrumbs.push(crumbs[i]);
                }
                return newCrumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.refresh();
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous Dialog', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d0']._states[1]);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d0']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Cross Dialog Back Two Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r3', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.navigate('t');
                stateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous Dialog', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d0']._states[1]);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d0']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Dialog Back Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r3', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                var newCrumbs = [];
                for (var i = 0; i < crumbs.length; i++) {
                    if (crumbs[i].state === state)
                        break;
                    newCrumbs.push(crumbs[i]);
                }
                return newCrumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d1']._states[0]);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d1']);
            });
            it('should have crumb trail of length 2', function() {
                assert.equal(stateController.stateContext.crumbs.length, 2);
            });
        }
    });

    describe('Cross Dialog Back One By One Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r3', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                var newCrumbs = [];
                for (var i = 0; i < crumbs.length; i++) {
                    if (crumbs[i].state === state)
                        break;
                    newCrumbs.push(crumbs[i]);
                }
                return newCrumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.navigate('t');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[1]);
                assert.equal(stateController.stateContext.dialog, stateController._dialogs[0]);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Bookmarked Link Navigate', function() {
        it ('should populate old and previous States', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigate('t');
            stateController.navigate('t');
            stateController.navigateLink(link);
            assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s2']);
            assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
        })
    });

    describe('Bookmarked Link Without Trail Navigate', function() {
        it ('should populate old but not previous States', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigate('t');
            stateController.navigate('t');
            stateController.navigateLink(link);
            assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s2']);
            assert.equal(stateController.stateContext.previousState, null);
            assert.equal(stateController.stateContext.previousDialog, null);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
        })
    });

    describe('Bookmarked Link Clear Navigate', function() {
        it ('should populate previous but not old States', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigate('t');
            stateController.navigate('t');
            stateController.clearStateContext();
            stateController.navigateLink(link);
            assert.equal(stateController.stateContext.oldState, undefined);
            assert.equal(stateController.stateContext.oldDialog, undefined);
            assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
        })
    });

    describe('Dialog Next', function() {
        it ('should return initial State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            assert.equal(stateController.getNextState('d'), stateController.dialogs['d'].initial);
        })
    });

    describe('Transition Next', function() {
        it ('should return to State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            stateController.navigate('d');
            assert.equal(stateController.getNextState('t'), stateController.dialogs['d'].states['s1']);
        })
    });

    describe('Invalid Next', function() {
        it ('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            assert.throws(() => stateController.getNextState('d0'));
        })
    });

    describe('Dialog and Transition Match Next', function() {
        it ('should return to State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 'd', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            stateController.navigate('d');
            assert.equal(stateController.getNextState('d'), stateController.dialogs['d'].states['s1']);
        })
    });

    describe('Cross Dialog Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            stateController.navigate('d0');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d0'].states['s1'].dispose = () => disposed = true;
            stateController.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.dialogs['d1'].states['s0'].navigated = () => navigated = true;
            stateController.navigate('d1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s0']);
        })
    });

    describe('Cross Dialog Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            stateController.navigate('d0');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => unloading = true;
            stateController.dialogs['d0'].states['s1'].dispose = () => disposed = true;
            stateController.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d1'].states['s0'].navigated = () => navigated = true;
            stateController.navigate('d1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d0'].states['s1']);
        });
    });

    describe('Cross Dialog Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            stateController.navigate('d0');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d0'].states['s1'].dispose = () => disposed = true;
            stateController.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d1'].states['s0'].navigated = () => navigated = true;
            stateController.navigate('d1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d0'].states['s1']);
        });
    });

    describe('Dialog Dialog Navigated', function () {
        it('should call all lifecycle functions apart from disposed', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.dialogs['d'].states['s'].navigated = () => navigated = true;
            stateController.navigate('d');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s']);
        });
    });

    describe('Dialog Dialog Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s'].unloading = (state, data, url, unload) => unloading = true;
            stateController.dialogs['d'].states['s'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s'].navigated = () => navigated = true;
            stateController.navigate('d');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s']);
        });
    });

    describe('Dialog Dialog Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s'].navigated = () => navigated = true;
            stateController.navigate('d');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s']);
        });
    });

    describe('Transition Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s0'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s0'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.dialogs['d'].states['s1'].navigated = () => navigated = true;
            stateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
        });
    });

    describe('Transition Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s0'].unloading = (state, data, url, unload) => unloading = true;
            stateController.dialogs['d'].states['s0'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s1'].navigated = () => navigated = true;
            stateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s0']);
        });
    });

    describe('Transition Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s0'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s0'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s1'].navigated = () => navigated = true;
            stateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s0']);
        });
    });

    describe('Transition Navigating Navigate', function () {
        it('should go to to State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            stateController.navigate('t');
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                stateController.navigate('t');
            }
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
        });
    });

    describe('Transition Transition Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s1'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s2'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.dialogs['d'].states['s2'].navigated = () => navigated = true;
            stateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
        });
    });

    describe('Transition Transition Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => unloading = true;
            stateController.dialogs['d'].states['s1'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s2'].navigated = () => navigated = true;
            stateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
        });
    });

    describe('Transition Transition Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s1'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s2'].navigated = () => navigated = true;
            stateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
        });
    });

    describe('Refresh Navigated', function () {
        it('should call all lifecycle functions apart from disposed', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s2'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s2'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.dialogs['d'].states['s2'].navigated = () => navigated = true;
            stateController.refresh();
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
        });
    });

    describe('Refresh Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => unloading = true;
            stateController.dialogs['d'].states['s2'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s2'].navigated = () => navigated = true;
            stateController.refresh();
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
        });
    });

    describe('Refresh Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s2'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s2'].navigated = () => navigated = true;
            stateController.refresh();
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
        });
    });

    describe('Back One Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s1'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.dialogs['d'].states['s0'].navigated = () => navigated = true;
            var link = stateController.getNavigationBackLink(1);
            stateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s0']);
        });
    });

    describe('Back One Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => unloading = true;
            stateController.dialogs['d'].states['s1'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s0'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s0'].navigated = () => navigated = true;
            var link = stateController.getNavigationBackLink(1);
            stateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
        });
    });

    describe('Back One Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s1'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s0'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s0'].navigated = () => navigated = true;
            var link = stateController.getNavigationBackLink(1);
            stateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
        });
    });

    describe('Back Two Navigated', function () {
        it('should call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' },
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's4' },
                    ]},
                    { key: 's4', route: 'r4', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s4'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s4'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s2'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.dialogs['d'].states['s2'].navigated = () => navigated = true;
            stateController.navigateBack(2);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
        });
    });

    describe('Back Two Unloading', function () {
        it('should only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' },
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's4' },
                    ]},
                    { key: 's4', route: 'r4', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s4'].unloading = (state, data, url, unload) => unloading = true;
            stateController.dialogs['d'].states['s4'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s2'].navigated = () => navigated = true;
            stateController.navigateBack(2);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s4']);
        });
    });

    describe('Back Two Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' },
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's4' },
                    ]},
                    { key: 's4', route: 'r4', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s4'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s4'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s2'].navigated = () => navigated = true;
            stateController.navigateBack(2);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s4']);
        });
    });

    describe('Back One By One Navigated', function () {
        it('should twice call all lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s2'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.dialogs['d'].states['s1'].navigated = () => navigated = true;
            stateController.navigateBack(1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            stateController.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s1'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.dialogs['d'].states['s0'].navigated = () => navigated = true;
            var link = stateController.getNavigationBackLink(1);
            stateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s0']);
        });
    });

    describe('Back One By One Unloading', function () {
        it('should twice only call unloading function', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => unloading = true;
            stateController.dialogs['d'].states['s2'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s1'].navigated = () => navigated = true;
            stateController.navigateBack(1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
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
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
        });
    });

    describe('Back One By One Navigating', function () {
        it('should twice only call unloading and navigating functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            stateController.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            stateController.dialogs['d'].states['s2'].dispose = () => disposed = true;
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => navigating = true;
            stateController.dialogs['d'].states['s1'].navigated = () => navigated = true;
            stateController.navigateBack(1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
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
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s2']);
        });
    });

    describe('Unloading Navigate', function () {
        it('should go to to State instead of initial State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
                ]);
            stateController.navigate('d0');
            var link = stateController.getNavigationLink('t');
            stateController.navigate('t');
            stateController.navigate('t');
            var disposed = 0, unloading, navigated10, navigated01;
            stateController.dialogs['d0'].states['s2'].unloading = (state, data, url, unload) => {
                if (!unloading) {
                    unloading = true;
                    stateController.navigateLink(link);
                } else {
                    unload();
                }
            }
            stateController.dialogs['d0'].states['s2'].dispose = () => disposed++;
            stateController.dialogs['d1'].states['s0'].navigated = () => navigated10 = true;
            stateController.dialogs['d0'].states['s1'].navigated = () => navigated01 = true;
            stateController.navigate('d1');
            assert.strictEqual(disposed, 1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(navigated10, undefined);
            assert.strictEqual(navigated01, true);
            assert.equal(stateController.stateContext.oldState, stateController.dialogs['d0'].states['s2']);
            assert.equal(stateController.stateContext.previousState, stateController.dialogs['d0'].states['s0']);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d0'].states['s1']);
        });
    });

    describe('Navigating Navigate', function () {
        it('should go to to State instead of initial State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
                ]);
            stateController.navigate('d0');
            var link = stateController.getNavigationLink('t');
            stateController.navigate('t');
            stateController.navigate('t');
            var disposed = 0, navigating, navigated10, navigated01;
            stateController.dialogs['d0'].states['s2'].dispose = () => disposed++;
            stateController.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                stateController.navigateLink(link);
            }
            stateController.dialogs['d1'].states['s0'].navigated = () => navigated10 = true;
            stateController.dialogs['d0'].states['s1'].navigated = () => navigated01 = true;
            stateController.navigate('d1');
            assert.strictEqual(disposed, 1);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated10, undefined);
            assert.strictEqual(navigated01, true);
            assert.equal(stateController.stateContext.oldState, stateController.dialogs['d0'].states['s2']);
            assert.equal(stateController.stateContext.previousState, stateController.dialogs['d0'].states['s0']);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d0'].states['s1']);
        });
    });

    describe('On Navigate', function () {
        it('should call onNavigate listener', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates = [];
            var states = [];
            stateController.navigate('d0');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateController.onNavigate(navigatedHandler);
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('d1');
            stateController.offNavigate(navigatedHandler);
            assert.equal(oldStates[0], stateController.dialogs['d0'].states['s0']);
            assert.equal(states[0], stateController.dialogs['d0'].states['s1']);
            assert.equal(oldStates[1], stateController.dialogs['d0'].states['s1']);
            assert.equal(states[1], stateController.dialogs['d1'].states['s0']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s0']);
        });
    });

    describe('Duplicate On Navigate', function () {
        it('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates = [];
            var states = [];
            stateController.navigate('d0');
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
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates = [];
            var states = [];
            stateController.navigate('d0');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateController.onNavigate(navigatedHandler);
            stateController.offNavigate(navigatedHandler);
            stateController.onNavigate(navigatedHandler);
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('d1');
            stateController.offNavigate(navigatedHandler);
            assert.equal(oldStates[0], stateController.dialogs['d0'].states['s0']);
            assert.equal(states[0], stateController.dialogs['d0'].states['s1']);
            assert.equal(oldStates[1], stateController.dialogs['d0'].states['s1']);
            assert.equal(states[1], stateController.dialogs['d1'].states['s0']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s0']);
        });
    });

    describe('Copy On Navigate', function () {
        it('should call both onNavigate listeners', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates = [];
            var states = [];
            stateController.navigate('d0');
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
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('d1');
            stateController.offNavigate(navigatedHandler1);
            stateController.offNavigate(navigatedHandler2);
            assert.equal(oldStates[0], stateController.dialogs['d0'].states['s0']);
            assert.equal(states[0], stateController.dialogs['d0'].states['s1']);
            assert.equal(oldStates[1], stateController.dialogs['d0'].states['s0']);
            assert.equal(states[1], stateController.dialogs['d0'].states['s1']);
            assert.equal(oldStates[2], stateController.dialogs['d0'].states['s1']);
            assert.equal(states[2], stateController.dialogs['d1'].states['s0']);
            assert.equal(oldStates[3], stateController.dialogs['d0'].states['s1']);
            assert.equal(states[3], stateController.dialogs['d1'].states['s0']);
            assert.equal(oldStates.length, 4);
            assert.equal(states.length, 4);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s0']);
        });
    });

    describe('Multiple On Navigate', function () {
        it('should call multiple onNavigate listeners', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates1 = [];
            var states1 = [];
            var oldStates2 = [];
            var states2 = [];
            stateController.navigate('d0');
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
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.navigate('d1');
            stateController.offNavigate(navigatedHandler1);
            stateController.offNavigate(navigatedHandler2);
            assert.equal(oldStates1[0], stateController.dialogs['d0'].states['s0']);
            assert.equal(states1[0], stateController.dialogs['d0'].states['s1']);
            assert.equal(oldStates2[0], stateController.dialogs['d0'].states['s0']);
            assert.equal(states2[0], stateController.dialogs['d0'].states['s1']);
            assert.equal(oldStates1[1], stateController.dialogs['d0'].states['s1']);
            assert.equal(states1[1], stateController.dialogs['d1'].states['s0']);
            assert.equal(oldStates2[1], stateController.dialogs['d0'].states['s1']);
            assert.equal(states2[1], stateController.dialogs['d1'].states['s0']);
            assert.equal(oldStates1.length, 2);
            assert.equal(states1.length, 2);
            assert.equal(oldStates2.length, 2);
            assert.equal(states2.length, 2);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s0']);
        });
    });

    describe('Off Navigate', function () {
        it('should stop calling onNavigate listener', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates = [];
            var states = [];
            stateController.navigate('d0');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            stateController.onNavigate(navigatedHandler);
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.offNavigate(navigatedHandler);
            stateController.offNavigate(navigatedHandler);
            stateController.navigate('d1');
            assert.equal(oldStates[0], stateController.dialogs['d0'].states['s0']);
            assert.equal(states[0], stateController.dialogs['d0'].states['s1']);
            assert.equal(oldStates.length, 1);
            assert.equal(states.length, 1);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s0']);
        });
    });

    describe('Multiple Off Navigate', function () {
        it('should individually stop calling onNavigate listeners', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates1 = [];
            var states1 = [];
            var oldStates2 = [];
            var states2 = [];
            stateController.navigate('d0');
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
            var link = stateController.getNavigationLink('t');
            stateController.navigateLink(link);
            stateController.offNavigate(navigatedHandler1);
            stateController.navigate('d1');
            stateController.offNavigate(navigatedHandler2);
            assert.equal(oldStates1[0], stateController.dialogs['d0'].states['s0']);
            assert.equal(states1[0], stateController.dialogs['d0'].states['s1']);
            assert.equal(oldStates2[0], stateController.dialogs['d0'].states['s0']);
            assert.equal(states2[0], stateController.dialogs['d0'].states['s1']);
            assert.equal(oldStates2[1], stateController.dialogs['d0'].states['s1']);
            assert.equal(states2[1], stateController.dialogs['d1'].states['s0']);
            assert.equal(oldStates1.length, 1);
            assert.equal(states1.length, 1);
            assert.equal(oldStates2.length, 2);
            assert.equal(states2.length, 2);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s0']);
        });
    });

    describe('Unloading Navigate And Continue', function () {
        it('should go to to State instead of initial State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            stateController.navigate('d0');
            stateController.navigate('t');
            stateController.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
                if (data.x)
                    stateController.navigate('t');
                unload();
            }
            var navigating;
            stateController.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            stateController.navigate('d1', { x: true });
            assert.equal(stateController.stateContext.oldState, stateController.dialogs['d0'].states['s1']);
            assert.equal(stateController.stateContext.previousState, stateController.dialogs['d0'].states['s1']);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d0'].states['s2']);
            assert.strictEqual(navigating, undefined);
        });
    });

    describe('Unloading Navigate Url And Continue', function () {
        it('should go to State once', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            stateController.navigate('d0');
            stateController.navigate('t');
            var unloading;
            stateController.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
                if (!unloading) {
                    unloading = true;
                    stateController.navigateLink(url);
                }
                unload();
            }
            var navigating = 0;
            stateController.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                navigating++;
                navigate();
            }
            stateController.navigate('d1');
            assert.equal(stateController.stateContext.oldState, stateController.dialogs['d0'].states['s1']);
            assert.equal(stateController.stateContext.previousState, null);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s0']);
            assert.strictEqual(navigating, 1);
        });
    });

    describe('Navigating Navigate And Continue', function () {
        it('should go to to State instead of initial State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true}]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
                ]);
            stateController.navigate('d0');
            stateController.navigate('t');
            stateController.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                stateController.navigate('t');
                navigate();
            }
            stateController.navigate('d1');
            assert.equal(stateController.stateContext.oldState, stateController.dialogs['d0'].states['s1']);
            assert.equal(stateController.stateContext.previousState, stateController.dialogs['d0'].states['s1']);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d0'].states['s2']);
        });
    });

    describe('Navigated Navigate On Navigate', function () {
        it('should call onNavigate listener once', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r3', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d0');
            stateController.navigate('t');
            stateController.dialogs['d1'].states['s0'].navigated = () => {
                stateController.navigate('t');
            }
            var navigatedState;
            var hits = 0;
            var navigatedHandler = (oldState, state, data) => {
                navigatedState = state;
                hits++;
            };
            stateController.onNavigate(navigatedHandler);
            stateController.navigate('d1');
            stateController.offNavigate(navigatedHandler);
            assert.equal(hits, 1);
            assert.equal(navigatedState, stateController.stateContext.state);
            assert.equal(stateController.stateContext.oldState, stateController.dialogs['d1'].states['s0']);
            assert.equal(stateController.stateContext.previousState, stateController.dialogs['d1'].states['s0']);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s1']);
        });
    });

    describe('Dialog Params Navigated', function () {
        it('should pass State and Data but no old State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            var navigateLinkOldState, navigateLinkState, navigateLinkUrl, navigateLinkData,
                navigatedOldState, navigatedState, navigatedData, navigatingData, navigatingUrl;
            stateController.dialogs['d'].states['s'].navigating = (data, url, navigating) => {
                navigatingData = data;
                navigatingUrl = url;
                navigating();
            }
            stateController.dialogs['d'].states['s'].stateHandler.navigateLink = (oldState, state, url) => {
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
            var url = stateController.getNavigationLink('d', { s: 'Hello' });
            stateController.navigate('d', { s: 'Hello' });
            stateController.offNavigate(navigatedHandler);
            assert.strictEqual(navigatingData.s, 'Hello');
            assert.strictEqual(navigatingUrl, url);
            assert.strictEqual(navigateLinkOldState, null);
            assert.strictEqual(navigateLinkState, stateController.dialogs['d'].states['s']);
            assert.strictEqual(navigateLinkUrl, url);
            assert.strictEqual(navigateLinkData.s, undefined);
            assert.strictEqual(navigatedOldState, null);
            assert.strictEqual(navigatedState, stateController.dialogs['d'].states['s']);
            assert.strictEqual(navigatedData.s, 'Hello');
            assert.strictEqual(stateController.stateContext.data.s, 'Hello');
        });
    });

    describe('Transition Params Navigated', function () {
        it('should pass old State, State and Data', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var link = stateController.getNavigationLink('d');
            stateController.navigateLink(link);
            var unloadingState, unloadingUrl, navigateLinkOldState, navigateLinkState, navigateLinkUrl, 
                navigatedOldState, navigatedState, navigatedData, navigatingData, navigatingUrl;
            stateController.dialogs['d'].states['s0'].unloading = (state, data, url, unload) => {
                unloadingState = state;
                unloadingUrl = url;
                unload();
            }
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigating) => {
                navigatingData = data;
                navigatingUrl = url;
                navigating();
            }
            stateController.dialogs['d'].states['s1'].stateHandler.navigateLink = (oldState, state, url) => {
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
            var url = stateController.getNavigationLink('t', { s: 'Hello' });
            stateController.navigate('t', { s: 'Hello' });
            stateController.offNavigate(navigatedHandler);
            assert.strictEqual(unloadingState, stateController.dialogs['d'].states['s1']);
            assert.strictEqual(unloadingUrl, url);
            assert.strictEqual(navigatingData.s, 'Hello');
            assert.strictEqual(navigatingUrl, url);
            assert.strictEqual(navigateLinkOldState, stateController.dialogs['d'].states['s0']);
            assert.strictEqual(navigateLinkState, stateController.dialogs['d'].states['s1']);
            assert.strictEqual(navigateLinkUrl, url);
            assert.strictEqual(navigatedOldState, stateController.dialogs['d'].states['s0']);
            assert.strictEqual(navigatedState, stateController.dialogs['d'].states['s1']);
            assert.strictEqual(navigatedData.s, 'Hello');
        });
    });

    describe('History Navigate', function () {
        it('should pass history flag to lifecycle functions', function() {
            var stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            stateController.navigate('d0');
            var link = stateController.getNavigationLink('t');
            var unloadingHistory, navigatingHistory;
            stateController.dialogs['d0'].states['s0'].unloading = (state, data, url, unload, history) => {
                unloadingHistory = history; 
                unload();
            }
            stateController.dialogs['d0'].states['s1'].navigating = (data, url, navigate, history) => {
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
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            stateController.navigate('d0');
            var link = stateController.getNavigationLink('t');
            var unloadingHistory, navigatingHistory;
            stateController.dialogs['d0'].states['s0'].unloading = (state, data, url, unload, history) => {
                unloadingHistory = history; 
                unload();
            }
            stateController.dialogs['d0'].states['s1'].navigating = (data, url, navigate, history) => {
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
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            stateController.navigate('d');
            stateController.dialogs['d'].states['s1'].navigated = (data, asyncData) => {
                assert.equal(asyncData, 'hello');
                done();
            }
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                setTimeout(() => navigate('hello'), 0);
            }
            stateController.navigate('t');
        });
    });

    describe('Async Data Navigating Navigating', function () {
        it('should pass async data to navigated function once', function(done: MochaDone) {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            stateController.navigate('d');
            stateController.dialogs['d'].states['s1'].navigated = (data, asyncData) => {
                assert.equal(asyncData, 0);
            }
            var i = 0;
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                ((count) => setTimeout(() => {
                    navigate(count);
                    if (count === 1)
                        done();
                }, 0))(i);
                i++;
            }
            stateController.navigate('t');
            stateController.navigate('t');
        });
    });

    describe('Reversed Async Data Navigating Navigating', function () {
        it('should pass second async data to navigated function', function(done: MochaDone) {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            stateController.navigate('d');
            stateController.dialogs['d'].states['s1'].navigated = (data, asyncData) => {
                assert.equal(asyncData, 1);
            }
            var i = 0;
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                ((count) => setTimeout(() => { 
                    navigate(count);
                    if (count === 0)
                        done();
                }, 5 - 5 * count))(i);
                i++;
            }
            stateController.navigate('t');
            stateController.navigate('t');
        });
    });

    describe('No Async Data Navigating', function () {
        it('should not pass any async data', function(done: MochaDone) {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            stateController.navigate('d');
            stateController.dialogs['d'].states['s1'].navigated = (data, asyncData) => {
                stateController.navigate('t');
            }
            stateController.dialogs['d'].states['s2'].navigated = (data, asyncData) => {
                assert.equal(asyncData, undefined);
                done();
            }
            stateController.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                setTimeout(() => navigate('hello'), 0);
            }
            stateController.navigate('t');
        });
    });

    describe('Route Navigate', function () {
        it('should go to State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 's', trackCrumbTrail: false },
                    { key: 's1', route: 'abc/{x}', trackCrumbTrail: false }]}
                ]);
            stateController.navigateLink('/abc/de');
            assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[1]);
            stateController.navigateLink('/s');
            assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[0]);
        });
    });

    describe('Route Root Navigate', function () {
        it('should go to State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: '{y}', trackCrumbTrail: false },
                    { key: 's1', route: 's', trackCrumbTrail: false }]}
                ]);
            stateController.navigateLink('/sa');
            assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[0]);
            stateController.navigateLink('/s');
            assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[1]);
        });
    });

    describe('Two Route Navigate', function () {
        it('should go to State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 's', trackCrumbTrail: false },
                    { key: 's1', route: ['abc/{x}', 'def/{y}'], trackCrumbTrail: false }]}
                ]);
            stateController.navigateLink('/abc/de');
            assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[1]);
            stateController.navigateLink('/def/gh');
            assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[1]);
            stateController.navigateLink('/s');
            assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[0]);
        });
    });

    describe('Two Route Root Navigate', function () {
        it('should go to State', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: ['abc/{x}', '{y}'], trackCrumbTrail: false },
                    { key: 's1', route: 's', trackCrumbTrail: false }]}
                ]);
            stateController.navigateLink('/abc/de');
            assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[0]);
            stateController.navigateLink('/sa');
            assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[0]);
            stateController.navigateLink('/s');
            assert.equal(stateController.stateContext.state, stateController._dialogs[0]._states[1]);
        });
    });

    describe('Clear State Context', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should clear State context', function() {
                stateController.clearStateContext();
                assert.strictEqual(stateController.stateContext.oldState, null);
                assert.strictEqual(stateController.stateContext.oldDialog, null);
                assert.strictEqual(stateController.stateContext.previousState, null);
                assert.strictEqual(stateController.stateContext.previousDialog, null);
                assert.strictEqual(stateController.stateContext.state, null);
                assert.strictEqual(stateController.stateContext.dialog, null);
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
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
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
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', null, Navigation.HistoryAction.Add);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
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
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', null, Navigation.HistoryAction.Replace);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
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
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ],
                historyManager
            );
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', null, Navigation.HistoryAction.None);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
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
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('d');
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
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('d');
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
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('d');
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
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('d');
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
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('d');
            stateController.navigate('t');
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
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('d');
            stateController.navigate('t');
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
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('d');
            stateController.navigate('t');
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
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ];
            var stateController = new Navigation.StateController(dialogs);
            stateController.navigate('d');
            stateController.navigate('t');
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
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'r0' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r1' }]}
                ],
                historyManager
            );
            stateController.dialogs['d0'].states['s'].navigated = () => {
                stateController.navigate('d1', null, Navigation.HistoryAction.None);
            }
            stateController.navigate('d0');
            assert.ok(!called);
        });
    });

    describe('Reload Dialog', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r' }]}
                ]);
            stateController.navigate('d0');
            stateController.configure([
                { key: 'd1', initial: 's1', states: [
                    { key: 's1', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should go to initial State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].initial);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d1']);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Reload Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r' }]}
                ]);
            stateController.navigate('d0');
            stateController.clearStateContext();
            stateController.configure([
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d1');
                stateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d1'].states['s0']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d1']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d1'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d1']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r' }]}
                ]);
            stateController.navigate('d0');
            stateController.clearStateContext();
            stateController.configure([
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d1');
                stateController.navigate('t');
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to current State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d1']);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d1'].states['s1']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d1'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d1']);
            });
            it('should not change crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.dialogs['d1'].states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r' }]}
                ]);
            stateController.navigate('d0');
            stateController.clearStateContext();
            stateController.configure([
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d1');
                stateController.navigate('t0');
                stateController.navigate('t1');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d1'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d1']);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d1'].states['s2']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d1'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d1']);
            });
            it('should reduce crumb trail by one', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.dialogs['d1'].states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Error Dialog', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            try {
                stateController.configure([
                    { key: '', initial: 's', states: [
                        { key: 's', route: 'r' }]}
                    ]);
            } catch(e) {
            }
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should go to initial State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].initial);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });

    describe('Reload Error Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            try {
                stateController.configure([
                    { key: '', initial: 's', states: [
                        { key: 's', route: 'r' }]}
                    ]);
            } catch(e) {
            }
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Error Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            try {
                stateController.configure([
                    { key: '', initial: 's', states: [
                        { key: 's', route: 'r' }]}
                    ]);
            } catch(e) {
            }
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to current State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should not change crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.dialogs['d'].states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Reload Error Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            try {
                stateController.configure([
                    { key: '', initial: 's', states: [
                        { key: 's', route: 'r' }]}
                    ]);
            } catch(e) {
            }
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t0');
                stateController.navigate('t1');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t1');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s2']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should reduce crumb trail by one', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.dialogs['d'].states['s0']);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Two Controllers Dialog', function() {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function() {
            stateController0 = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r' }]}
                ]);
            stateController1 = new Navigation.StateController([
                { key: 'd1', initial: 's1', states: [
                    { key: 's1', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('d0');
                stateController1.navigate('d1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('d0');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('d1');
                stateController1.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should go to initial State', function() {
                assert.equal(stateController0.stateContext.state, stateController0.dialogs['d0'].initial);
                assert.equal(stateController0.stateContext.dialog, stateController0.dialogs['d0']);
                assert.equal(stateController1.stateContext.state, stateController1.dialogs['d1'].initial);
                assert.equal(stateController1.stateContext.dialog, stateController1.dialogs['d1']);
            });
            it('should have no crumb trail', function() {
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
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            stateController1 = new Navigation.StateController([
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('d0');
                stateController1.navigate('d1');
                stateController0.navigate('t');
                stateController1.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('d0');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('d1');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationLink('t');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('t');
                stateController1.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(stateController0.stateContext.state, stateController0.dialogs['d0'].states['s1']);
                assert.equal(stateController0.stateContext.dialog, stateController0.dialogs['d0']);
                assert.equal(stateController1.stateContext.state, stateController1.dialogs['d1'].states['s1']);
                assert.equal(stateController1.stateContext.dialog, stateController1.dialogs['d1']);
            });
            it('should populate old State', function() {
                assert.equal(stateController0.stateContext.oldState, stateController0.dialogs['d0'].states['s0']);
                assert.equal(stateController0.stateContext.oldDialog, stateController0.dialogs['d0']);
                assert.equal(stateController1.stateContext.oldState, stateController1.dialogs['d1'].states['s0']);
                assert.equal(stateController1.stateContext.oldDialog, stateController1.dialogs['d1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController0.stateContext.previousState, stateController0.dialogs['d0'].states['s0']);
                assert.equal(stateController0.stateContext.previousDialog, stateController0.dialogs['d0']);
                assert.equal(stateController1.stateContext.previousState, stateController1.dialogs['d1'].states['s0']);
                assert.equal(stateController1.stateContext.previousDialog, stateController1.dialogs['d1']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController0.stateContext.crumbs.length, 1);
                assert.equal(stateController0.stateContext.crumbs[0].state, stateController0.stateContext.dialog.initial);
                assert.ok(stateController0.stateContext.crumbs[0].last);
                assert.equal(stateController1.stateContext.crumbs.length, 1);
                assert.equal(stateController1.stateContext.crumbs[0].state, stateController1.stateContext.dialog.initial);
                assert.ok(stateController1.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Two Controllers Refresh', function() {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function() {
            stateController0 = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            stateController1 = new Navigation.StateController([
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('d0');
                stateController1.navigate('d1');
                stateController0.navigate('t');
                stateController1.navigate('t');
                stateController0.refresh();
                stateController1.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('d0');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('d1');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationLink('t');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('t');
                stateController1.navigateLink(link);
                link = stateController0.getRefreshLink();
                stateController0.navigateLink(link);
                link = stateController1.getRefreshLink();
                stateController1.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to current State', function() {
                assert.equal(stateController0.stateContext.state, stateController0.dialogs['d0'].states['s1']);
                assert.equal(stateController0.stateContext.dialog, stateController0.dialogs['d0']);
                assert.equal(stateController1.stateContext.state, stateController1.dialogs['d1'].states['s1']);
                assert.equal(stateController1.stateContext.dialog, stateController1.dialogs['d1']);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController0.stateContext.oldState, stateController0.dialogs['d0'].states['s1']);
                assert.equal(stateController0.stateContext.oldDialog, stateController0.dialogs['d0']);
                assert.equal(stateController1.stateContext.oldState, stateController1.dialogs['d1'].states['s1']);
                assert.equal(stateController1.stateContext.oldDialog, stateController1.dialogs['d1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController0.stateContext.previousState, stateController0.dialogs['d0'].states['s0']);
                assert.equal(stateController0.stateContext.previousDialog, stateController0.dialogs['d0']);
                assert.equal(stateController1.stateContext.previousState, stateController1.dialogs['d1'].states['s0']);
                assert.equal(stateController1.stateContext.previousDialog, stateController1.dialogs['d1']);
            });
            it('should not change crumb trail', function() {
                assert.equal(stateController0.stateContext.crumbs.length, 1);
                assert.equal(stateController0.stateContext.crumbs[0].state, stateController0.dialogs['d0'].states['s0']);
                assert.ok(stateController0.stateContext.crumbs[0].last);
                assert.equal(stateController1.stateContext.crumbs.length, 1);
                assert.equal(stateController1.stateContext.crumbs[0].state, stateController1.dialogs['d1'].states['s0']);
                assert.ok(stateController1.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Two Controllers Back', function() {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function() {
            stateController0 = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            stateController1 = new Navigation.StateController([
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('d0');
                stateController1.navigate('d1');
                stateController0.navigate('t0');
                stateController1.navigate('t0');
                stateController0.navigate('t1');
                stateController1.navigate('t1');
                stateController0.navigateBack(1);
                stateController1.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('d0');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('d1');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationLink('t0');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('t0');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationLink('t1');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('t1');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationBackLink(1);
                stateController0.navigateLink(link);
                link = stateController1.getNavigationBackLink(1);
                stateController1.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(stateController0.stateContext.state, stateController0.dialogs['d0'].states['s1']);
                assert.equal(stateController0.stateContext.dialog, stateController0.dialogs['d0']);
                assert.equal(stateController1.stateContext.state, stateController1.dialogs['d1'].states['s1']);
                assert.equal(stateController1.stateContext.dialog, stateController1.dialogs['d1']);
            });
            it('should populate old State with current State', function() {
                assert.equal(stateController0.stateContext.oldState, stateController0.dialogs['d0'].states['s2']);
                assert.equal(stateController0.stateContext.oldDialog, stateController0.dialogs['d0']);
                assert.equal(stateController1.stateContext.oldState, stateController1.dialogs['d1'].states['s2']);
                assert.equal(stateController1.stateContext.oldDialog, stateController1.dialogs['d1']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController0.stateContext.previousState, stateController0.dialogs['d0'].states['s0']);
                assert.equal(stateController0.stateContext.previousDialog, stateController0.dialogs['d0']);
                assert.equal(stateController1.stateContext.previousState, stateController1.dialogs['d1'].states['s0']);
                assert.equal(stateController1.stateContext.previousDialog, stateController1.dialogs['d1']);
            });
            it('should reduce crumb trail by one', function() {
                assert.equal(stateController0.stateContext.crumbs.length, 1);
                assert.equal(stateController0.stateContext.crumbs[0].state, stateController0.dialogs['d0'].states['s0']);
                assert.ok(stateController0.stateContext.crumbs[0].last);
                assert.equal(stateController1.stateContext.crumbs.length, 1);
                assert.equal(stateController1.stateContext.crumbs[0].state, stateController1.dialogs['d1'].states['s0']);
                assert.ok(stateController1.stateContext.crumbs[0].last);
            });
        }
    });

    describe('Reload History', function () {
        it('should call stop', function() {
            var dialogs = [
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
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
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', trackCrumbTrail: false }]}
                ]);
            var stateController1 = new Navigation.StateController([
                { key: 'd1', initial: 's1', states: [
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
            var url0, url1;
            stateController0.historyManager.addHistory = (url) => url0 = url;
            stateController1.historyManager.addHistory = (url) => url1 = url;
            stateController0.navigate('d0');
            stateController1.navigate('d1');        
            assert.strictEqual(url0, '/r0');
            assert.strictEqual(url1, '/r1');
        });
    });
    
    describe('Crumb Trail Route Param', function() {
        var stateController: StateController;
        var s2Link: string; 
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1/{crumb?}', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2/{crumb?}', trackCrumbTrail: true }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                s2Link = stateController.stateContext.url;
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
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
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s2']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Crumb Trail Route Splat Param', function() {
        var stateController: StateController;
        var s2Link: string; 
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1/{*crumb?}', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2/{*crumb?}', trackCrumbTrail: true }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                s2Link = stateController.stateContext.url;
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
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
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s2']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
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
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2/{*crumb?}', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3/{crumb?}', trackCrumbTrail: true }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                s2Link = stateController.stateContext.url;
                stateController.navigate('t');
                s3Link = stateController.stateContext.url;
                stateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                s2Link = stateController.stateContext.url;
                link = stateController.getNavigationLink('t');
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
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s3']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Crumb Trail Mandatory Route Param', function() {
        it ('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2/{crumb}', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            assert.throws(() => stateController.navigate('t'), /cannot be a mandatory route parameter/);
        });
    });
    
    describe('Crumb Trail Key', function() {
        var stateController: StateController;
        var s1Link: string, s2Link: string;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: 'trail' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                s2Link = stateController.stateContext.url;
                stateController.navigateBack(1);
                s1Link = stateController.stateContext.url;
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
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
                assert.strictEqual(stateController.dialogs['d'].states['s2'].trackCrumbTrail, true);
                assert.notEqual(s1Link.indexOf('crumb'), -1);
                assert.equal(s1Link.indexOf('trail'), -1);
                assert.equal(s2Link.indexOf('crumb'), -1);
                assert.notEqual(s2Link.indexOf('trail'), -1);
            })          
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, null);
                assert.equal(stateController.stateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 0);
            });
        }
    });
    
    describe('Repeated States Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d'].states['s1'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.refresh();
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.dialog, stateController.dialogs['d']);
            });
            it('should populate old State', function() {
                assert.equal(stateController.stateContext.oldState, stateController.dialogs['d'].states['s1']);
                assert.equal(stateController.stateContext.oldDialog, stateController.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(stateController.stateContext.previousState, stateController.dialogs['d'].states['s0']);
                assert.equal(stateController.stateContext.previousDialog, stateController.dialogs['d']);
            });
            it('should have no crumb trail', function() {
                assert.equal(stateController.stateContext.crumbs.length, 1);
                assert.equal(stateController.stateContext.crumbs[0].state, stateController.stateContext.dialog.initial);
                assert.ok(stateController.stateContext.crumbs[0].last);
            });
        }
    });
    
    describe('Crumb Trail Malicious', function() {
        it ('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: '{x}', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
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
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            assert.throws(() => stateController.navigateLink('/r1?crumb=%2Fr2'), /The Url is invalid/);
        });
    });
    
    describe('Crumb Trail Encode', function() {
        it ('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d'].states['s1'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return encodeURIComponent(val).replace('%2F', '/');
            }
            stateController.navigate('d');
            stateController.navigate('t');
            assert.equal(stateController.stateContext.url, '/r1?crumb=/r0');
            stateController.navigateBack(1);
            assert.equal(stateController.stateContext.state, stateController.dialogs['d'].states['s0']);
        });
    });
});
