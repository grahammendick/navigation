/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
import initStateInfo = require('./initStateInfo');
import Crumb = require('../src/Crumb');
import State = require('../src/config/State');
import Navigation = require('../src/Navigation');

describe('Navigation', function () {
    beforeEach(function () {
        initStateInfo();
        Navigation.StateController.clearStateContext();
    });

    describe('Dialog', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should go to initial State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].initial);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Invalid Dialog', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            it('should throw error', function(){
                assert.throws(() => Navigation.StateController.navigate('d0'));
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function(){
                assert.throws(() => Navigation.StateController.getNavigationLink('d0'));
            });
        });
    });

    describe('Cross Dialog', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's1', states: [
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].initial);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d1']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d0']);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Cross Dialog Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's1', states: [
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].initial);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d1']);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Dialog Dialog', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].initial);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.state);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateContext.dialog);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Dialog Dialog Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
            });
            test();            
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].initial);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });
    
    describe('Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });

    describe('Invalid Action', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });

        describe('Navigate', function() {
            it('should throw error', function() {
                Navigation.StateController.navigate('d');
                assert.throws(() => Navigation.StateController.navigate('t1'));            
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                assert.throws(() => Navigation.StateController.getNavigationLink('t1'));
            });
        });
    });

    describe('Null Action', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });

        describe('Navigate', function() {
            it('should throw error', function() {
                Navigation.StateController.navigate('d');
                assert.throws(() => Navigation.StateController.navigate(null));            
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                assert.throws(() => Navigation.StateController.getNavigationLink(null));
            });
        });
    });
    
    describe('Transition From Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                var link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.dialog.initial);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });

    describe('Transition Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
            });
            it('should have crumb trail of length 2', function() {
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
                assert.equal(Navigation.StateController.crumbs[1].state, Navigation.StateContext.previousState);
                assert.ok(!Navigation.StateController.crumbs[0].last);
                assert.ok(Navigation.StateController.crumbs[1].last);
            });
        }
    });
    
    describe('Transition Transition Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
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
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });
    
    describe('Refresh', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to current State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State with current State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not change crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });

    describe('Refresh Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to current State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });
    
    describe('Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State with current State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should reduce crumb trail by one', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });

    describe('Back Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Back Two', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', transitions: [
                        { key: 't2', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', transitions: [
                        { key: 't3', to: 's4' }
                    ]},
                    { key: 's4', route: 'r4' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
                Navigation.StateController.navigate('t2');
                Navigation.StateController.navigate('t3');
                Navigation.StateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t2');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t3');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(2);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[2]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should populate previous State with current State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[4]);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should reduce crumb trail by two', function() {
                assert.equal(Navigation.StateController.crumbs.length, 2);
                assert.ok(!Navigation.StateController.crumbs[0].last);
                assert.ok(Navigation.StateController.crumbs[1].last);
                for (var i = 0; i < Navigation.StateController.crumbs.length; i++) {
                    assert.equal(Navigation.StateController.crumbs[i].state, Navigation.StateInfoConfig._dialogs[0]._states[i]);
                }
            });
        }
    });

    describe('Back Two Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
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
                    { key: 's3', route: 'r3', transitions: [
                        { key: 't3', to: 's4' }
                    ]},
                    { key: 's4', route: 'r4' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
                Navigation.StateController.navigate('t2');
                Navigation.StateController.navigate('t3');
                Navigation.StateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t2');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t3');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(2);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[2]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Back One By One', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should populate previous State with previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[1]);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Back One By One Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Can Navigate Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should return false for 0', function() {
                assert.ok(!Navigation.StateController.canNavigateBack(0));
            });
            it('should return true for 1', function() {
                assert.ok(Navigation.StateController.canNavigateBack(1));
            });
            it('should return true for 2', function() {
                assert.ok(Navigation.StateController.canNavigateBack(2));
            });
            it('should return false for 3', function() {
                assert.ok(!Navigation.StateController.canNavigateBack(3));
            });
        }
    });

    describe('Without Trail Can Navigate Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should return false for 0', function() {
                assert.ok(!Navigation.StateController.canNavigateBack(0));
            });
            it('should return false for 1', function() {
                assert.ok(!Navigation.StateController.canNavigateBack(1));
            });
        }
    });

    describe('Invalid Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.navigateBack(3));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.getNavigationBackLink(3));
            });
        });
    });

    describe('Without Trail Invalid Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.navigateBack(1));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.getNavigationBackLink(1));
            });
        });
    });

    describe('Back Invalid Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.navigateBack(2));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.getNavigationBackLink(2));
            });
        });
    });

    describe('Back Without Trail Invalid Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.navigateBack(1));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.getNavigationBackLink(1));
            });
        });
    });

    describe('Back Refresh', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0].states['s0']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should populate previous State with previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0].states['s0']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Back Without Trail Refresh', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0].states['s0']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should note populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Back Refresh Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't0', to: 's2' },
                        { key: 't1', to: 's3' }
                    ]},
                    { key: 's2', route: 'r2' },
                    { key: 's3', route: 'r3' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.refresh();
                Navigation.StateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s3']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State with previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not change crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 2);
                assert.ok(!Navigation.StateController.crumbs[0].last);
                assert.ok(Navigation.StateController.crumbs[1].last);
                for (var i = 0; i < Navigation.StateController.crumbs.length; i++) {
                    assert.equal(Navigation.StateController.crumbs[i].state, Navigation.StateInfoConfig._dialogs[0]._states[i]);
                }
            });
        }
    });

    describe('Back Without Trail Refresh Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't0', to: 's2' },
                        { key: 't1', to: 's3' }
                    ]},
                    { key: 's2', route: 'r2' },
                    { key: 's3', route: 'r3' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.refresh();
                Navigation.StateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s3']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State with previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not change crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.ok(Navigation.StateController.crumbs[0].last);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            });
        }
    });

    describe('Transition Without Trail Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.ok(Navigation.StateController.crumbs[0].last);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            });
        }
    });

    describe('Crumb Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', transitions: [
                        { key: 't', to: 's4' }
                    ]},
                    { key: 's4', route: 'r4' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb State', function() {
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.equal(Navigation.StateController.crumbs[1].state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateController.crumbs[2].state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
                assert.equal(Navigation.StateController.crumbs[3].state, Navigation.StateInfoConfig.dialogs['d'].states['s3']);
                assert.equal(Navigation.StateController.crumbs.length, 4);
            });
            it('should populate crumb last', function() {
                assert.ok(!Navigation.StateController.crumbs[0].last);
                assert.ok(!Navigation.StateController.crumbs[1].last);
                assert.ok(!Navigation.StateController.crumbs[2].last);
                assert.ok(Navigation.StateController.crumbs[3].last);
            });
        }
    });

    describe('Dialog Dialog Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'r0' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r1' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('d1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d0'].states['s']);
            });
        }
    });

    describe('Cross Dialog Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r2' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should have crumb trail of length 2', function() {
                assert.equal(Navigation.StateController.crumbs.length, 2);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
                assert.equal(Navigation.StateController.crumbs[1].state, Navigation.StateInfoConfig.dialogs['d0']._states[1]);
            });
        }
    });

    describe('Dialog Dialog Back Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'r0' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r1' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous Dialog', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0']._states[0]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d0']);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Cross Dialog Back Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r2' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
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
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.refresh();
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous Dialog', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0']._states[1]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d0']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
            });
        }
    });

    describe('Cross Dialog Back Two Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r3' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(2);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous Dialog', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0']._states[1]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d0']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
            });
        }
    });

    describe('Dialog Back Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r3' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
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
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1']._states[0]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d1']);
            });
            it('should have crumb trail of length 2', function() {
                assert.equal(Navigation.StateController.crumbs.length, 2);
            });
        }
    });

    describe('Cross Dialog Back One By One Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r3' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
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
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
            });
        }
    });

    describe('Cross Dialog Navigated', function () {
        it('should call all lifecycle functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => navigated = true;
            Navigation.StateController.navigate('d1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        })
    });

    describe('Cross Dialog Unloading', function () {
        it('should only call unloading function', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => unloading = true;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => navigated = true;
            Navigation.StateController.navigate('d1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        });
    });

    describe('Cross Dialog Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => navigated = true;
            Navigation.StateController.navigate('d1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        });
    });

    it('NavigatedDialogDialogTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigating = (data, url, navigate) => {
            navigating = true;
            navigate();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigated = () => navigated = true;
        Navigation.StateController.navigate('d0');
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, true);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
    });

    it('UnloadingDialogDialogTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].unloading = (state, data, url, unload) => unloading = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigated = () => navigated = true;
        Navigation.StateController.navigate('d0');
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, undefined);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
    });

    it('NavigatingDialogDialogTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigated = () => navigated = true;
        Navigation.StateController.navigate('d0');
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
    });

    it('NavigatedTransitionTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate) => {
            navigating = true;
            navigate();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = () => navigated = true;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, true);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, true);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
    });

    it('UnloadingTransitionTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].unloading = (state, data, url, unload) => unloading = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = () => navigated = true;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, undefined);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
    });

    it('NavigatingTransitionTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = () => navigated = true;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
    });

    it('NavigatingNavigateTransitionTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t0');
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate) => {
            Navigation.StateController.navigate('t0');
        }
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
    });

    it('NavigatedTransitionTransitionTest', function () {
        Navigation.StateController.navigate('d2');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d2'].states['s1'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d2'].states['s1'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigating = (data, url, navigate) => {
            navigating = true;
            navigate();
        }
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, true);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, true);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s2']);
    });

    it('UnloadingTransitionTransitionTest', function () {
        Navigation.StateController.navigate('d2');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d2'].states['s1'].unloading = (state, data, url, unload) => unloading = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s1'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, undefined);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s1']);
    });

    it('NavigatingTransitionTransitionTest', function () {
        Navigation.StateController.navigate('d2');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d2'].states['s1'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d2'].states['s1'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s1']);
    });

    it('NavigatedRefreshTest', function () {
        var link = Navigation.StateController.getNavigationLink('d2');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t0');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigating = (data, url, navigate) => {
            navigating = true;
            navigate();
        }
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.refresh();
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, true);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s2']);
    });

    it('UnloadingRefreshTest', function () {
        var link = Navigation.StateController.getNavigationLink('d2');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t0');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].unloading = (state, data, url, unload) => unloading = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.refresh();
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, undefined);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s2']);
    });

    it('NavigatingRefreshTest', function () {
        var link = Navigation.StateController.getNavigationLink('d2');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t0');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d2'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.refresh();
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d2'].states['s2']);
    });

    it('NavigatedBackOneTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t2');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s3'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s3'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigating = (data, url, navigate) => {
            navigating = true;
            navigate();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigated = () => navigated = true;
        var link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, true);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, true);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
    });

    it('UnloadingBackOneTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t2');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s3'].unloading = (state, data, url, unload) => unloading = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s3'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigated = () => navigated = true;
        var link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, undefined);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s3']);
    });

    it('NavigatingBackOneTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t2');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s3'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s3'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigated = () => navigated = true;
        var link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s3']);
    });

    it('NavigatedBackTwoTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t0');
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t0');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigating = (data, url, navigate) => {
            navigating = true;
            navigate();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.navigateBack(2);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, true);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, true);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s2']);
    });

    it('UnloadingBackTwoTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t0');
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t0');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].unloading = (state, data, url, unload) => unloading = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.navigateBack(2);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, undefined);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s4']);
    });

    it('NavigatingBackTwoTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t0');
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t0');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.navigateBack(2);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s4']);
    });

    it('NavigatedBackOneByOneTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t1');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t1');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigating = (data, url, navigate) => {
            navigating = true;
            navigate();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, true);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, true);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s2']);
        unloading = undefined;
        disposed = undefined;
        navigating = undefined;
        navigated = undefined;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigating = (data, url, navigate) => {
            navigating = true;
            navigate();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].navigated = () => navigated = true;
        var link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, true);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, true);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
    });

    it('UnloadingBackOneByOneTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t1');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t1');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].unloading = (state, data, url, unload) => unloading = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, undefined);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s4']);
        unloading = undefined;
        disposed = undefined;
        navigating = undefined;
        navigated = undefined;
        var link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, undefined);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s4']);
    });

    it('NavigatingBackOneByOneTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t1');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('t1');
        var unloading, disposed, navigating, navigated;
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].unloading = (state, data, url, unload) => {
            unloading = true;
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s4'].dispose = () => disposed = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigating = (data, url, navigate) => navigating = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigated = () => navigated = true;
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s4']);
        unloading = undefined;
        disposed = undefined;
        navigating = undefined;
        navigated = undefined;
        var link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(unloading, true);
        assert.strictEqual(disposed, undefined);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated, undefined);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s4']);
    });

    it('UnloadingNavigateTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var disposed = 0, unloading, navigated10, navigated01;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].unloading = (state, data, url, unload) => {
            if (!unloading) {
                unloading = true;
                Navigation.StateController.navigateLink(link);
            } else {
                unload();
            }
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].dispose = () => disposed++;
        Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => navigated10 = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = () => navigated01 = true;
        Navigation.StateController.navigate('d1');
        assert.strictEqual(disposed, 1);
        assert.strictEqual(unloading, true);
        assert.strictEqual(navigated10, undefined);
        assert.strictEqual(navigated01, true);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
    });

    it('NavigatingNavigateTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var disposed = 0, navigating, navigated10, navigated01;
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].dispose = () => disposed++;
        Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
            navigating = true;
            Navigation.StateController.navigateLink(link);
        }
        Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => navigated10 = true;
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = () => navigated01 = true;
        Navigation.StateController.navigate('d1');
        assert.strictEqual(disposed, 1);
        assert.strictEqual(navigating, true);
        assert.strictEqual(navigated10, undefined);
        assert.strictEqual(navigated01, true);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
    });

    it('OnNavigateTest', function () {
        var oldStates: Array<State> = [];
        var states: Array<State> = [];
        Navigation.StateController.navigate('d0');
        var navigatedHandler = (oldState, state, data) => {
            oldStates.push(oldState);
            states.push(state);
        };
        Navigation.StateController.onNavigate(navigatedHandler);
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('d1');
        Navigation.StateController.offNavigate(navigatedHandler);
        assert.equal(oldStates[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(states[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(oldStates[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(states[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.equal(oldStates.length, 2);
        assert.equal(states.length, 2);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
    });

    it('OnNavigateDuplicateTest', function () {
        var oldStates: Array<State> = [];
        var states: Array<State> = [];
        Navigation.StateController.navigate('d0');
        var navigatedHandler = (oldState, state, data) => {
            oldStates.push(oldState);
            states.push(state);
        };
        Navigation.StateController.onNavigate(navigatedHandler);
        Navigation.StateController.onNavigate(navigatedHandler);
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('d1');
        Navigation.StateController.offNavigate(navigatedHandler);
        assert.equal(oldStates[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(states[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(oldStates[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(states[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.equal(oldStates.length, 2);
        assert.equal(states.length, 2);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
    });

    it('OnOffNavigateDuplicateTest', function () {
        var oldStates: Array<State> = [];
        var states: Array<State> = [];
        Navigation.StateController.navigate('d0');
        var navigatedHandler = (oldState, state, data) => {
            oldStates.push(oldState);
            states.push(state);
        };
        Navigation.StateController.onNavigate(navigatedHandler);
        Navigation.StateController.offNavigate(navigatedHandler);
        Navigation.StateController.onNavigate(navigatedHandler);
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('d1');
        Navigation.StateController.offNavigate(navigatedHandler);
        assert.equal(oldStates[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(states[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(oldStates[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(states[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.equal(oldStates.length, 2);
        assert.equal(states.length, 2);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
    });

    it('OnNavigateCopyTest', function () {
        var oldStates: Array<State> = [];
        var states: Array<State> = [];
        Navigation.StateController.navigate('d0');
        var navigatedHandler1 = (oldState, state, data) => {
            oldStates.push(oldState);
            states.push(state);
        };
        var navigatedHandler2 = (oldState, state, data) => {
            oldStates.push(oldState);
            states.push(state);
        };
        Navigation.StateController.onNavigate(navigatedHandler1);
        Navigation.StateController.onNavigate(navigatedHandler2);
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('d1');
        Navigation.StateController.offNavigate(navigatedHandler1);
        Navigation.StateController.offNavigate(navigatedHandler2);
        assert.equal(oldStates[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(states[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(oldStates[1], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(states[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(oldStates[2], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(states[2], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.equal(oldStates[3], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(states[3], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.equal(oldStates.length, 4);
        assert.equal(states.length, 4);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
    });

    it('OnNavigateMultipleTest', function () {
        var oldStates1: Array<State> = [];
        var states1: Array<State> = [];
        var oldStates2: Array<State> = [];
        var states2: Array<State> = [];
        Navigation.StateController.navigate('d0');
        var navigatedHandler1 = (oldState, state, data) => {
            oldStates1.push(oldState);
            states1.push(state);
        };
        var navigatedHandler2 = (oldState, state, data) => {
            oldStates2.push(oldState);
            states2.push(state);
        };
        Navigation.StateController.onNavigate(navigatedHandler1);
        Navigation.StateController.onNavigate(navigatedHandler2);
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.navigate('d1');
        Navigation.StateController.offNavigate(navigatedHandler1);
        Navigation.StateController.offNavigate(navigatedHandler2);
        assert.equal(oldStates1[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(states1[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(oldStates2[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(states2[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(oldStates1[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(states1[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.equal(oldStates2[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(states2[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.equal(oldStates1.length, 2);
        assert.equal(states1.length, 2);
        assert.equal(oldStates2.length, 2);
        assert.equal(states2.length, 2);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
    });

    it('OffNavigateTest', function () {
        var oldStates: Array<State> = [];
        var states: Array<State> = [];
        Navigation.StateController.navigate('d0');
        var navigatedHandler = (oldState, state, data) => {
            oldStates.push(oldState);
            states.push(state);
        };
        Navigation.StateController.onNavigate(navigatedHandler);
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.offNavigate(navigatedHandler);
        Navigation.StateController.offNavigate(navigatedHandler);
        Navigation.StateController.navigate('d1');
        assert.equal(oldStates[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(states[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(oldStates.length, 1);
        assert.equal(states.length, 1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
    });

    it('OffNavigateMultipleTest', function () {
        var oldStates1: Array<State> = [];
        var states1: Array<State> = [];
        var oldStates2: Array<State> = [];
        var states2: Array<State> = [];
        Navigation.StateController.navigate('d0');
        var navigatedHandler1 = (oldState, state, data) => {
            oldStates1.push(oldState);
            states1.push(state);
        };
        var navigatedHandler2 = (oldState, state, data) => {
            oldStates2.push(oldState);
            states2.push(state);
        };
        Navigation.StateController.onNavigate(navigatedHandler1);
        Navigation.StateController.onNavigate(navigatedHandler2);
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateController.offNavigate(navigatedHandler1);
        Navigation.StateController.navigate('d1');
        Navigation.StateController.offNavigate(navigatedHandler2);
        assert.equal(oldStates1[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(states1[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(oldStates2[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
        assert.equal(states2[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(oldStates2[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(states2[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.equal(oldStates1.length, 1);
        assert.equal(states1.length, 1);
        assert.equal(oldStates2.length, 2);
        assert.equal(states2.length, 2);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
    });

    it('UnloadingNavigateAndContinueTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
            if (data.x)
                Navigation.StateController.navigate('t0');
            unload();
        }
        var navigating;
        Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
            navigating = true;
            navigate();
        }
        Navigation.StateController.navigate('d1', { x: true });
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s2']);
        assert.strictEqual(navigating, undefined);
    });

    it('UnloadingNavigateUrlAndContinueTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var unloading;
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
            if (!unloading) {
                unloading = true;
                Navigation.StateController.navigateLink(url);
            }
            unload();
        }
        var navigating = 0;
        Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
            navigating++;
            navigate();
        }
        Navigation.StateController.navigate('d1');
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.strictEqual(navigating, 1);
    });

    it('NavigatingNavigateAndContinueTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
            Navigation.StateController.navigate('t0');
            navigate();
        }
        Navigation.StateController.navigate('d1');
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s2']);
    });

    it('NavigatedNavigateOnNavigateTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => {
            Navigation.StateController.navigate('t0');
        }
        var navigatedState;
        var hits = 0;
        var navigatedHandler = (oldState, state, data) => {
            navigatedState = state;
            hits++;
        };
        Navigation.StateController.onNavigate(navigatedHandler);
        Navigation.StateController.navigate('d1');
        Navigation.StateController.offNavigate(navigatedHandler);
        assert.equal(hits, 1);
        assert.equal(navigatedState, Navigation.StateContext.state);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s1']);
    });

    it('NavigateHistoryTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        var unloadingHistory, navigatingHistory;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].unloading = (state, data, url, unload, history) => {
            unloadingHistory = history; 
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate, history) => {
            navigatingHistory = history;
            navigate();
        }
        Navigation.StateController.navigateLink(link, true);
        assert.strictEqual(unloadingHistory, true);
        assert.strictEqual(navigatingHistory, true);
    });

    it('NavigateNonHistoryTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        var unloadingHistory, navigatingHistory;
        Navigation.StateInfoConfig.dialogs['d0'].states['s0'].unloading = (state, data, url, unload, history) => {
            unloadingHistory = history; 
            unload();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate, history) => {
            navigatingHistory = history;
            navigate();
        }
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(unloadingHistory, false);
        assert.strictEqual(navigatingHistory, false);
    });

    it('NavigatingAsyncDataTest', function (done: MochaDone) {
        Navigation.StateController.navigate('d0');
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = (data, asyncData) => {
            assert.equal(asyncData, 'hello');
            done();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate) => {
            setTimeout(() => navigate('hello'), 0);
        }
        Navigation.StateController.navigate('t0');
    });

    it('NavigatingNavigatingAsyncDataTest', function (done: MochaDone) {
        Navigation.StateController.navigate('d0');
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = (data, asyncData) => {
            assert.equal(asyncData, 0);
            done();
        }
        var i = 0;
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate) => {
            ((count) => setTimeout(() => navigate(count), 0))(i);
            i++;
        }
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
    });

    it('NavigatingNavigatingReversedAsyncDataTest', function (done: MochaDone) {
        Navigation.StateController.navigate('d0');
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = (data, asyncData) => {
            assert.equal(asyncData, 1);
            done();
        }
        var i = 0;
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate) => {
            ((count) => setTimeout(() => navigate(count), 5 - 5 * count))(i);
            i++;
        }
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
    });

    it('NavigatingNoAsyncDataTest', function (done: MochaDone) {
        Navigation.StateController.navigate('d0');
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = (data, asyncData) => {
            Navigation.StateController.navigate('t0');
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s2'].navigated = (data, asyncData) => {
            assert.equal(asyncData, undefined);
            done();
        }
        Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate) => {
            setTimeout(() => navigate('hello'), 0);
        }
        Navigation.StateController.navigate('t0');
    });

    it('NavigateTransitionStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.notEqual(link.indexOf('aaa'), -1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[0]);
        assert.equal(Navigation.StateController.crumbs.length, 1);
    });

    it('NavigateTransitionTransitionStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        Navigation.StateController.navigate('d1');
        Navigation.StateController.navigate('t0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.notEqual(link.indexOf('bbb'), -1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[1]._states[2]);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[1]._states[1]);
        assert.equal(Navigation.StateController.crumbs.length, 2);
    });

    it('Navigate26TimesStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        for(var i = 0; i < 26; i++) {
            Navigation.StateController.navigate('d0');
        }
        var link = Navigation.StateController.getRefreshLink();
        assert.notEqual(link.indexOf('aaz'), -1);
    });

    it('Navigate27TimesStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        for(var i = 0; i < 27; i++) {
            Navigation.StateController.navigate('d0');
        }
        var link = Navigation.StateController.getRefreshLink();
        assert.notEqual(link.indexOf('aaA'), -1);
    });

    it('Navigate52TimesStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        for(var i = 0; i < 52; i++) {
            Navigation.StateController.navigate('d0');
        }
        var link = Navigation.StateController.getRefreshLink();
        assert.notEqual(link.indexOf('aaZ'), -1);
    });

    it('Navigate53TimesStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        for(var i = 0; i < 53; i++) {
            Navigation.StateController.navigate('d0');
        }
        var link = Navigation.StateController.getRefreshLink();
        assert.notEqual(link.indexOf('aaa1'), -1);
    });

    it('Navigate78TimesStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        for(var i = 0; i < 78; i++) {
            Navigation.StateController.navigate('d0');
        }
        var link = Navigation.StateController.getRefreshLink();
        assert.notEqual(link.indexOf('aaz1'), -1);
    });

    it('Navigate79TimesStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        for(var i = 0; i < 79; i++) {
            Navigation.StateController.navigate('d0');
        }
        var link = Navigation.StateController.getRefreshLink();
        assert.notEqual(link.indexOf('aaA1'), -1);
    });

    it('Navigate104TimesStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        for(var i = 0; i < 104; i++) {
            Navigation.StateController.navigate('d0');
        }
        var link = Navigation.StateController.getRefreshLink();
        assert.notEqual(link.indexOf('aaZ1'), -1);
    });

    it('Navigate207TimesStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        for(var i = 0; i < 207; i++) {
            Navigation.StateController.navigate('d0');
        }
        var link = Navigation.StateController.getRefreshLink();
        assert.notEqual(link.indexOf('aaY3'), -1);
    });

    it('Navigate50TimesNoRecycleStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0, 5);
        for(var i = 0; i < 50; i++) {
            Navigation.StateController.navigate('d0');
        }
        var link = Navigation.StateController.getRefreshLink();
        assert.notEqual(link.indexOf('aaX'), -1);
    });

    it('Navigate51TimesRecycleStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0, 5);
        for(var i = 0; i < 51; i++) {
            Navigation.StateController.navigate('d0');
        }
        var link = Navigation.StateController.getRefreshLink();
        assert.notEqual(link.indexOf('aaa'), -1);
    });

    it('Navigate4TimesNoEmptyStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0, 5);
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        for(var i = 0; i < 4; i++) {
            Navigation.StateController.navigate('d0');
        }
        Navigation.StateController.navigateLink(link);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[0]);
        assert.equal(Navigation.StateController.crumbs.length, 1);
    });

    it('Navigate5TimesEmptyStorageTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0, 5);
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        for(var i = 0; i < 5; i++) {
            Navigation.StateController.navigate('d0');
        }
        Navigation.StateController.navigateLink(link);
        assert.equal(Navigation.StateContext.previousState, null);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    it('NavigateNoStorageLength7Test', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(7, 5);
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.equal(link.indexOf('aaa'), -1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[0]);
        assert.equal(Navigation.StateController.crumbs.length, 1);
    });

    it('NavigateStorageLength6Test', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(6, 5);
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.notEqual(link.indexOf('aaa'), -1);
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[0]);
        assert.equal(Navigation.StateController.crumbs.length, 1);
    });

    it('NavigateStorageMismtachTest', function () {
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigateLink(link);
        assert.equal(Navigation.StateController.crumbs.length, 0);
    });

    it('NavigateUncombinedToCombinedCrumbTrailTest', function () {
        Navigation.settings.combineCrumbTrail = false;
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.settings.combineCrumbTrail = true;
        Navigation.StateController.navigateLink(link);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        assert.equal(Navigation.StateController.crumbs.length, 2);
    });

    it('NavigateCombinedToUnombinedCrumbTrailTest', function () {
        Navigation.settings.combineCrumbTrail = true;
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var link = Navigation.StateController.getNavigationLink('t0');
        Navigation.settings.combineCrumbTrail = false;
        Navigation.StateController.navigateLink(link);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        assert.equal(Navigation.StateController.crumbs.length, 2);
    });

    it('NavigateTwoRouteTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's0', states: [
                { key: 's0', route: 's', trackCrumbTrail: false },
                { key: 's1', route: ['abc/{x}', 'def/{y}'], trackCrumbTrail: false }]}
            ]);
        Navigation.StateController.navigateLink('/abc/de');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        Navigation.StateController.navigateLink('/def/gh');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        Navigation.StateController.navigateLink('/s');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
    });

    it('NavigateTwoRouteRootTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's0', states: [
                { key: 's0', route: ['abc/{x}', '{y}'], trackCrumbTrail: false },
                { key: 's1', route: 's', trackCrumbTrail: false }]}
            ]);
        Navigation.StateController.navigateLink('/abc/de');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
        Navigation.StateController.navigateLink('/sa');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
        Navigation.StateController.navigateLink('/s');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
    });
});